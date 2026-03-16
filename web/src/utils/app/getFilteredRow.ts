import { decode } from 'utils/encoder/encoder';
import { formatSystemMetricName } from 'utils/formatSystemMetricName';
import { isMetricHash } from 'utils/isMetricHash';
import { isSystemMetric } from 'utils/isSystemMetric';

export default function getFilteredRow<R extends Record<string, any>>({
  columnKeys,
  row,
}: {
  columnKeys: string[];
  row: R;
}): { [key: string]: string } {
  return columnKeys.reduce((acc: { [key: string]: string }, column: string) => {
    let columnKey = column;
    if (isMetricHash(column)) {
      const { metricName, contextName } = JSON.parse(decode(column));
      columnKey = `${metricName}${contextName ? `${contextName} ` : ''}`;
    } else if (isSystemMetric(column)) {
      columnKey = formatSystemMetricName(column);
    }
    let value = row[column];
    if (Array.isArray(value)) {
      const first = value[0];
      const hasName =
        value.length > 0 &&
        first &&
        typeof first === 'object' &&
        'name' in first;
      value = hasName
        ? value.map((item: any) => item?.name ?? '').join(', ')
        : value.join(', ');
    } else if (typeof value !== 'string') {
      value = value || value === 0 ? JSON.stringify(value) : '-';
    }

    if (columnKey.startsWith('params.')) {
      acc[columnKey.replace('params.', '')] = value;
    } else {
      acc[columnKey] = value;
    }

    return acc;
  }, {});
}
