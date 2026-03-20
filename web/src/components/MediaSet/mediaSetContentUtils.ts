import _ from 'lodash-es';

import { formatValue } from 'utils/formatValue';
import { SortField } from 'utils/getSortedFields';

export type MediaSetContentItem = [
  (string | Record<string, unknown>)[],
  [] | [][],
];

/** Nested orderedMap: key -> { key, orderKey, ordering, ... } or nested maps. */
type OrderedMap = Record<
  string,
  { key?: string; orderKey?: string; ordering?: unknown[] } & Record<
    string,
    unknown
  >
>;

/**
 * Build the content array used by MediaSet (and MediaSetColumns): list of [path, items]
 * with stacking and ordering applied.
 *
 * :param data: Grouped data (nested by grouping keys).
 * :param orderedMap: Map of grouping key to ordering/options.
 * :param stacking: Whether to stack groups at the same level.
 * :param sortFieldsDict: Dict of sort field key to SortField for ordering.
 * :param sortFields: Array of sort fields for list ordering.
 * :returns: Array of [path, items] entries.
 */
export function buildMediaSetContent(
  data: [] | { [key: string]: [] | Record<string, unknown> },
  orderedMap: OrderedMap,
  stacking: boolean,
  sortFieldsDict: { [key: string]: { order?: string } } | undefined,
  sortFields: SortField[] | undefined,
): MediaSetContentItem[] {
  const content: MediaSetContentItem[] = [];
  const keysMap: { [key: string]: number } = {};

  function setStackedList(list: [], stackedList: [][]): void {
    for (let j = 0; j < list.length; j++) {
      if (!stackedList[j]) {
        stackedList[j] = [];
      }
      (stackedList[j] as unknown[]).push(list[j]);
    }
  }

  function setStackedContent(
    list: [],
    path: (string | Record<string, unknown>)[],
  ): void {
    const last = content[content.length - 1];
    if (!last) return;
    const [lastContentPath, lastContentList] = last;
    const lastPath = path[path.length - 1];
    const pathStr = typeof lastPath === 'string' ? lastPath : '';
    const [orderedMapKey, value] = pathStr.split(' = ');
    if (path.length === lastContentPath.length) {
      const lastPathObj = lastContentPath[lastContentPath.length - 1] as Record<
        string,
        unknown[]
      >;
      if (!Array.isArray(lastPathObj[orderedMapKey])) {
        lastPathObj[orderedMapKey] = [];
      }
      lastPathObj[orderedMapKey].push(value);
      setStackedList(list, lastContentList as [][]);
    } else {
      const stackedList: [][] = [];
      setStackedList(list, stackedList);
      const newPath = path.slice(0, -1).concat({ [orderedMapKey]: [value] });
      content.push([newPath, stackedList]);
    }
  }

  function getOrderedContentList(list: []): [] {
    const listKeys: string[] = [];
    const listOrderTypes: ('asc' | 'desc')[] = [];
    sortFields?.forEach((sortField: SortField) => {
      listKeys.push(sortField.value);
      listOrderTypes.push(sortField.order ?? 'asc');
    });
    return _.orderBy(list, listKeys, listOrderTypes) as [];
  }

  function fillContent(
    list: [] | { [key: string]: [] | Record<string, unknown> },
    path: (string | Record<string, unknown>)[] = [''],
    map: OrderedMap,
  ): void {
    if (Array.isArray(list)) {
      const orderedContentList = getOrderedContentList(list);
      if (stacking && content.length > 0) {
        setStackedContent(orderedContentList as [], path);
      } else {
        content.push([path, orderedContentList as [] | [][]]);
      }
    } else {
      const rawOrdering = map?.ordering as unknown[] | Set<unknown> | undefined;
      const ordering: unknown[] = Array.isArray(rawOrdering)
        ? rawOrdering
        : Array.from(rawOrdering ?? []);
      const key = (map?.key as string) ?? '';
      const orderKey = map?.orderKey as string | undefined;
      const orderRaw = sortFieldsDict?.[orderKey ?? '']?.order ?? 'asc';
      const order: 'asc' | 'desc' = orderRaw === 'desc' ? 'desc' : 'asc';
      const reduced = ordering.reduce<Record<string, unknown>[]>(
        (acc, value) => {
          acc.push({ [key]: value });
          return acc;
        },
        [],
      );
      const fieldSortedValues = _.orderBy(reduced, [key], [order]).map(
        (value: Record<string, unknown>) => value[key],
      );
      fieldSortedValues.forEach((val: unknown) => {
        const fieldName = `${key} = ${formatValue(val)}`;
        const pathKey = path.join('');
        if (!keysMap.hasOwnProperty(pathKey)) {
          content.push([path, []]);
          keysMap[pathKey] = 1;
        }
        const nextMap = (map[fieldName] ?? {}) as OrderedMap;
        fillContent(
          list[fieldName] as
            | []
            | { [key: string]: [] | Record<string, unknown> },
          path.concat([fieldName]),
          nextMap,
        );
      });
    }
  }

  fillContent(data, [''], orderedMap);
  return content;
}
