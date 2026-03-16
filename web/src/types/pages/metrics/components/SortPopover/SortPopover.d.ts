import { AppNameEnum } from 'services/models/explorer';

import { IGroupingSelectOption } from 'types/services/models/imagesExplore/imagesExploreAppModel';

import { SortFields } from 'utils/getSortedFields';

export interface ISortPopoverProps {
  onSort: any;
  onReset: () => void;
  sortOptions: IGroupingSelectOption[];
  sortFields: SortFields;
  readOnlyFieldsLabel?: string;
  readOnlyFieldsReorderable?: boolean;
  appName?: AppNameEnum;
}
export interface ISortPopoverListProps {
  onSort: any;
  sortFields: SortFields;
  filteredSortFields: SortFields;
  title?: string;
  /** When true, the list can be reordered via drag-and-drop to change sort priority. */
  reorderable?: boolean;
}
