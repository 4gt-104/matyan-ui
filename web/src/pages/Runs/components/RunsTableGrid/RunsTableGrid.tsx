import * as React from 'react';
import _ from 'lodash-es';
import { merge } from 'lodash-es';

import { Badge } from 'components/kit';
import RunNameColumn from 'components/Table/RunNameColumn';
import GroupedColumnHeader from 'components/Table/GroupedColumnHeader';
import AttachedTagsList from 'components/AttachedTagsList/AttachedTagsList';
import ExperimentNameBox from 'components/ExperimentNameBox';
import RunCreatorBox from 'components/RunCreatorBox';
import TableSortIcons from 'components/Table/TableSortIcons';

import COLORS from 'config/colors/colors';
import { TABLE_DEFAULT_CONFIG } from 'config/table/tableConfigs';

import { ITableColumn } from 'types/pages/metrics/components/TableColumns/TableColumns';
import { ITagInfo } from 'types/pages/tags/Tags';

import { formatSystemMetricName } from 'utils/formatSystemMetricName';
import alphabeticalSortComparator from 'utils/alphabeticalSortComparator';
import { getMetricHash } from 'utils/app/getMetricHash';
import { getMetricLabel } from 'utils/app/getMetricLabel';
import { isSystemMetric } from 'utils/isSystemMetric';
import { SortActionTypes, SortField } from 'utils/getSortedFields';

const RUNS_SORTABLE_COLUMN_KEYS = new Set([
  'experiment',
  'hash',
  'run',
  'description',
  'creator',
  'date',
  'duration',
]);

function wrapSortableContent(
  key: string,
  content: React.ReactNode,
  sortOptions: { value: string; label: string }[] | undefined,
  sortFields: SortField[] | undefined,
  onSort: ((arg: any) => void) | undefined,
): React.ReactNode {
  if (!onSort || !sortOptions || !RUNS_SORTABLE_COLUMN_KEYS.has(key)) {
    return content;
  }
  const sortItemIndex =
    sortFields?.findIndex((f: SortField) => f.value === key) ?? -1;
  const sortOption =
    sortItemIndex >= 0 && sortFields
      ? sortFields[sortItemIndex]
      : sortOptions.find((o) => o.value === key);
  return (
    <span className='flex'>
      {content}
      <TableSortIcons
        onSort={() =>
          onSort({
            sortFields: sortFields ?? [],
            index: sortItemIndex,
            field: sortOption,
            actionType:
              sortFields?.[sortItemIndex]?.order === 'desc'
                ? SortActionTypes.DELETE
                : SortActionTypes.ORDER_TABLE_TRIGGER,
          })
        }
        sort={
          !_.isNil(sortFields?.[sortItemIndex])
            ? sortFields?.[sortItemIndex]?.order ?? null
            : null
        }
      />
    </span>
  );
}

function getRunsTableColumns(
  metricsColumns: any,
  runColumns: string[] = [],
  order: { left: string[]; middle: string[]; right: string[] },
  hiddenColumns: string[],
  includeCreator: boolean = false,
  sortOptions?: { value: string; label: string }[],
  sortFields?: SortField[],
  onSort?: (arg: any) => void,
): ITableColumn[] {
  let columns: ITableColumn[] = [
    {
      key: 'experiment',
      sortableKey: 'experiment',
      content: wrapSortableContent(
        'experiment',
        <span>Name</span>,
        sortOptions,
        sortFields,
        onSort,
      ),
      topHeader: 'Experiment',
      pin: order?.left?.includes('experiment')
        ? 'left'
        : order?.middle?.includes('experiment')
        ? null
        : order?.right?.includes('experiment')
        ? 'right'
        : null,
    },
    {
      key: 'experiment_description',
      content: <span>Description</span>,
      topHeader: 'Experiment',
      pin: order?.left?.includes('experiment_description')
        ? 'left'
        : order?.middle?.includes('experiment_description')
        ? null
        : order?.right?.includes('experiment_description')
        ? 'right'
        : null,
    },
    {
      key: 'hash',
      sortableKey: 'hash',
      content: wrapSortableContent(
        'hash',
        <span>Hash</span>,
        sortOptions,
        sortFields,
        onSort,
      ),
      topHeader: 'Run',
      pin: order?.left?.includes('hash')
        ? 'left'
        : order?.middle?.includes('hash')
        ? null
        : order?.right?.includes('hash')
        ? 'right'
        : null,
    },
    {
      key: 'run',
      sortableKey: 'run',
      content: wrapSortableContent(
        'run',
        <span>Name</span>,
        sortOptions,
        sortFields,
        onSort,
      ),
      topHeader: 'Run',
      pin: order?.left?.includes('run')
        ? 'left'
        : order?.middle?.includes('run')
        ? null
        : order?.right?.includes('run')
        ? 'right'
        : 'left',
    },
    {
      key: 'description',
      sortableKey: 'description',
      content: wrapSortableContent(
        'description',
        <span>Description</span>,
        sortOptions,
        sortFields,
        onSort,
      ),
      topHeader: 'Run',
      pin: order?.left?.includes('description')
        ? 'left'
        : order?.middle?.includes('description')
        ? null
        : order?.right?.includes('description')
        ? 'right'
        : null,
    },
    ...(includeCreator
      ? [
          {
            key: 'creator',
            sortableKey: 'creator',
            content: wrapSortableContent(
              'creator',
              <span>Creator</span>,
              sortOptions,
              sortFields,
              onSort,
            ),
            topHeader: 'Run',
            pin: order?.left?.includes('creator')
              ? 'left'
              : order?.middle?.includes('creator')
              ? null
              : order?.right?.includes('creator')
              ? 'right'
              : null,
          },
        ]
      : []),
    {
      key: 'date',
      sortableKey: 'date',
      content: wrapSortableContent(
        'date',
        <span>Date</span>,
        sortOptions,
        sortFields,
        onSort,
      ),
      topHeader: 'Run',
      pin: order?.left?.includes('date')
        ? 'left'
        : order?.middle?.includes('date')
        ? null
        : order?.right?.includes('date')
        ? 'right'
        : null,
    },
    {
      key: 'duration',
      sortableKey: 'duration',
      content: wrapSortableContent(
        'duration',
        <span>Duration</span>,
        sortOptions,
        sortFields,
        onSort,
      ),
      topHeader: 'Run',
      pin: order?.left?.includes('date')
        ? 'left'
        : order?.right?.includes('date')
        ? 'right'
        : null,
    },
    {
      key: 'tags',
      content: <span>Tags</span>,
      topHeader: 'Run',
      pin: order?.left?.includes('tags')
        ? 'left'
        : order?.right?.includes('tags')
        ? 'right'
        : null,
    },
  ].concat(
    Object.keys(metricsColumns).reduce((acc: any, metricName: string) => {
      const systemMetricsList: ITableColumn[] = [];
      const isSystem = isSystemMetric(metricName);
      const metricsList: ITableColumn[] = [];
      Object.keys(metricsColumns[metricName]).forEach((metricContext) => {
        const metricHash = getMetricHash(metricName, metricContext);
        const metricLabel = getMetricLabel(metricName, metricContext);

        let column = {
          key: metricHash,
          label: metricLabel,
          content: isSystem ? (
            <span>{formatSystemMetricName(metricName)}</span>
          ) : (
            <Badge
              monospace
              size='xSmall'
              color={COLORS[0][0]}
              label={metricContext === '' ? 'Empty context' : metricContext}
            />
          ),
          topHeader: isSystem ? 'System Metrics' : metricName,
          pin: order?.left?.includes(metricHash)
            ? 'left'
            : order?.right?.includes(metricHash)
            ? 'right'
            : null,
        };
        isSystem ? systemMetricsList.push(column) : metricsList.push(column);
      });
      acc = [
        ...acc,
        ...metricsList.sort(alphabeticalSortComparator({ orderBy: 'key' })),
        ...systemMetricsList.sort(
          alphabeticalSortComparator({ orderBy: 'key' }),
        ),
      ];
      return acc;
    }, []),
    runColumns.map((param) => ({
      key: param,
      content: <span>{param}</span>,
      topHeader: 'Run Params',
      pin: order?.left?.includes(param)
        ? 'left'
        : order?.right?.includes(param)
        ? 'right'
        : null,
    })),
  );

  columns = columns.map((col) => ({
    ...col,
    isHidden:
      !TABLE_DEFAULT_CONFIG.runs.nonHidableColumns.has(col.key) &&
      hiddenColumns.includes(col.key),
  }));

  const columnsOrder = order?.left.concat(order.middle).concat(order.right);
  columns.sort((a, b) => {
    if (!columnsOrder.includes(a.key) && !columnsOrder.includes(b.key)) {
      return 0;
    } else if (!columnsOrder.includes(a.key)) {
      return 1;
    } else if (!columnsOrder.includes(b.key)) {
      return -1;
    }
    return columnsOrder.indexOf(a.key) - columnsOrder.indexOf(b.key);
  });

  return columns;
}

const TagsColumn = (props: {
  runHash: string;
  tags: ITagInfo[];
  onRunsTagsChange: (runHash: string, tags: ITagInfo[]) => void;
  headerRenderer: () => React.ReactNode;
  addTagButtonSize: 'xxSmall' | 'xSmall';
}) => {
  return <AttachedTagsList {...props} inlineAttachedTagsList />;
};

function runsTableRowRenderer(
  rowData: any,
  onRunsTagsChange: (runHash: string, tags: ITagInfo[]) => void,
  groupHeaderRow = false,
  columns: string[] = [],
) {
  if (groupHeaderRow) {
    const row: { [key: string]: any } = {};
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (Array.isArray(rowData[col])) {
        row[col] = {
          content: <GroupedColumnHeader data={rowData[col]} />,
        };
      }
    }

    return merge({}, rowData, row);
  } else {
    const row = {
      experiment: {
        content: (
          <ExperimentNameBox
            experimentName={rowData.experiment}
            experimentId={rowData.experimentId}
          />
        ),
      },
      run: {
        content: (
          <RunNameColumn
            run={rowData.run}
            runHash={rowData.hash}
            active={rowData.active}
          />
        ),
      },
      creator: {
        content: <RunCreatorBox creatorUsername={rowData.creator} />,
      },
      tags: {
        content: (
          <TagsColumn
            runHash={rowData.hash}
            tags={rowData.tags}
            onRunsTagsChange={onRunsTagsChange}
            headerRenderer={() => <></>}
            addTagButtonSize='xxSmall'
          />
        ),
      },
      actions: {
        content: null,
      },
    };

    return merge({}, rowData, row);
  }
}

export { getRunsTableColumns, runsTableRowRenderer };
