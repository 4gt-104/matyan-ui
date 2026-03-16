import React from 'react';

import { IconDownload, IconFileZip } from '@tabler/icons-react';

import { Card, Text } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import BusyLoaderWrapper from 'components/BusyLoaderWrapper/BusyLoaderWrapper';
import { ICardProps } from 'components/kit/Card/Card.d';
import CopyToClipBoard from 'components/CopyToClipBoard/CopyToClipBoard';

import { getAPIHost } from 'config/config';

import { IRunOverviewTabArtifactsCardProps } from './RunOverviewTabArtifactsCard.d';

function RunOverviewTabArtifactsCard({
  artifacts,
  isRunInfoLoading,
  runHash,
}: IRunOverviewTabArtifactsCardProps) {
  const tableData = React.useMemo(() => artifacts, [artifacts]);

  const downloadAllUrl = React.useMemo(
    () => `${getAPIHost()}/runs/${runHash}/artifacts/download-all/`,
    [runHash],
  );

  const dataListProps = React.useMemo(
    (): ICardProps['dataListProps'] => ({
      calcTableHeight: true,
      tableColumns: [
        {
          dataKey: 'name',
          key: 'name',
          width: '20%',
          title: (
            <Text weight={600} size={14} tint={100}>
              Name
              <Text
                weight={600}
                size={14}
                tint={50}
                className='RunOverviewTab__cardBox__tableTitleCount'
              >
                ({tableData.length})
              </Text>
            </Text>
          ),
          cellRenderer: ({ cellData }: any) => (
            <p title={cellData}>{cellData}</p>
          ),
        },
        {
          dataKey: 'path',
          key: 'path',
          width: '30%',
          title: 'Path',
          cellRenderer: ({ cellData }: any) => (
            <p title={cellData}>{cellData}</p>
          ),
        },
        {
          dataKey: 'uri',
          key: 'uri',
          width: '35%',
          title: 'URI',
          cellRenderer: ({ cellData }: any) => (
            <div>
              <Text size={14}>{cellData}</Text>
              <CopyToClipBoard
                iconSize='xSmall'
                isURL='true'
                copyContent={cellData}
              />
            </div>
          ),
        },
        {
          dataKey: 'path',
          key: 'download',
          width: '15%',
          title: '',
          cellRenderer: ({ cellData, rowData }: any) => {
            const url =
              `${getAPIHost()}/runs/${runHash}/artifacts/download` +
              `?path=${encodeURIComponent(cellData)}`;
            return (
              <a
                href={url}
                download={rowData.name}
                title='Download artifact'
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <IconDownload size={16} />
                <Text size={14} style={{ marginLeft: 4 }}>
                  Download
                </Text>
              </a>
            );
          },
        },
      ],
      tableData,
      illustrationConfig: {
        size: 'large',
        title: 'No Results',
      },
    }),
    [tableData, runHash],
  );
  return (
    <ErrorBoundary>
      <BusyLoaderWrapper isLoading={isRunInfoLoading} height='100%'>
        <div style={{ position: 'relative' }}>
          {tableData.length > 0 && (
            <a
              href={downloadAllUrl}
              download
              title='Download all artifacts as ZIP'
              style={{
                position: 'absolute',
                right: 16,
                top: 12,
                zIndex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <IconFileZip size={16} />
              <Text size={14} weight={500} style={{ marginLeft: 4 }}>
                Download All
              </Text>
            </a>
          )}
          <Card
            title='Run Artifacts'
            className='RunOverviewTab__cardBox'
            dataListProps={dataListProps}
          />
        </div>
      </BusyLoaderWrapper>
    </ErrorBoundary>
  );
}

RunOverviewTabArtifactsCard.displayName = 'RunOverviewTabArtifactsCard';

export default React.memo<IRunOverviewTabArtifactsCardProps>(
  RunOverviewTabArtifactsCard,
);
