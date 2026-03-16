import React, { memo } from 'react';
import { useResizeObserver } from 'hooks';

import { MediaTypeEnum } from 'components/MediaPanel/config';
import MediaPanel from 'components/MediaPanel';
import BusyLoaderWrapper from 'components/BusyLoaderWrapper/BusyLoaderWrapper';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import {
  ImageRenderingEnum,
  MediaItemAlignmentEnum,
} from 'config/enums/imageEnums';

import blobsURIModel from 'services/models/media/blobsURIModel';
import imagesExploreService from 'services/api/imagesExplore/imagesExploreService';

import {
  decodeBufferPairs,
  decodePathsVals,
  iterFoldTree,
} from 'utils/encoder/streamEncoding';
import arrayBufferToBase64 from 'utils/arrayBufferToBase64';

import { IImagesVisualizerProps } from '../types';

import './ImagesVisualizer.scss';

function ImagesVisualizer(
  props: IImagesVisualizerProps | any,
): React.FunctionComponentElement<React.ReactNode> {
  const { data, isLoading } = props;
  const imagesWrapperRef = React.useRef<any>(null);
  const [focusedState, setFocusedState] = React.useState({
    active: false,
    key: null,
  });
  const [offsetHeight, setOffsetHeight] = React.useState(0);
  const [offsetWidth, setOffsetWidth] = React.useState(0);

  const resizeObserverCb = React.useCallback(() => {
    const el = imagesWrapperRef.current;
    if (el) {
      setOffsetHeight(el.offsetHeight);
      setOffsetWidth(el.offsetWidth);
    }
  }, []);

  useResizeObserver(resizeObserverCb, imagesWrapperRef);

  React.useEffect(() => {
    blobsURIModel.init();
    resizeObserverCb();
  }, [resizeObserverCb]);

  function getImagesBlobsData(uris: string[]) {
    const request = imagesExploreService.getImagesByURIs(uris);
    return {
      abort: request.abort,
      call: () => {
        return request
          .call()
          .then(async (stream) => {
            let bufferPairs = decodeBufferPairs(stream);
            let decodedPairs = decodePathsVals(bufferPairs);
            let objects = iterFoldTree(decodedPairs, 1);
            for await (let [keys, val] of objects) {
              const URI = keys[0];
              blobsURIModel.emit(URI as string, {
                [URI]: arrayBufferToBase64(val as ArrayBuffer) as string,
              });
            }
          })
          .catch((ex) => {
            if (ex.name === 'AbortError') {
              // Abort Error
            } else {
              // eslint-disable-next-line no-console
              console.log('Unhandled error: ');
            }
          });
      },
    };
  }

  const onActivePointChange = React.useCallback(
    (activePoint: any, focusedStateActive: boolean = false) => {
      setFocusedState({ key: activePoint.key, active: focusedStateActive });
    },
    [],
  );

  const additionalProperties = React.useMemo(() => {
    return {
      alignmentType: MediaItemAlignmentEnum.Height,
      mediaItemSize: 25,
      imageRendering: ImageRenderingEnum.Pixelated,
    };
  }, []);

  const sortFieldsDict = React.useMemo(() => {
    return {
      step: {
        group: 'record',
        label: 'record.step',
        value: 'step',
        readonly: false,
        order: 'desc',
      },
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className='ImagesVisualizer' ref={imagesWrapperRef}>
        <BusyLoaderWrapper
          className='VisualizationLoader'
          isLoading={!!props.isLoading}
        >
          <MediaPanel
            mediaType={MediaTypeEnum.IMAGE}
            getBlobsData={getImagesBlobsData}
            data={data?.imageSetData}
            orderedMap={data?.orderedMap}
            isLoading={!data || isLoading}
            panelResizing={false}
            tableHeight={'0'}
            wrapperOffsetHeight={offsetHeight || 0}
            wrapperOffsetWidth={offsetWidth || 0}
            sortFieldsDict={sortFieldsDict}
            focusedState={focusedState}
            additionalProperties={additionalProperties}
            onActivePointChange={onActivePointChange}
            illustrationConfig={{ title: 'No Tracked Images' }}
          />
        </BusyLoaderWrapper>
      </div>
    </ErrorBoundary>
  );
}

ImagesVisualizer.displayName = 'ImagesVisualizer';

export default memo<IImagesVisualizerProps>(ImagesVisualizer);
