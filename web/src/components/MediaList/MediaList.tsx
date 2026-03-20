import React from 'react';
import { areEqual, VariableSizeList as List } from 'react-window';

import { MediaTypeEnum } from 'components/MediaPanel/config';
import AudioBox from 'components/kit/AudioBox';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import {
  ITEM_CAPTION_HEIGHT,
  MEDIA_ITEMS_SIZES,
  MEDIA_LIST_HEIGHT,
} from 'config/mediaConfigs/mediaConfigs';

import getBiggestImageFromList from 'utils/getBiggestImageFromList';

import ImageBox from './ImageBox';
import { IMediaListProps } from './MediaList.d';

const mediaBoxType: any = {
  [MediaTypeEnum.IMAGE]: ImageBox,
  [MediaTypeEnum.AUDIO]: AudioBox,
};

function MediaList({
  data,
  wrapperOffsetWidth,
  addUriToList,
  mediaItemHeight,
  focusedState,
  additionalProperties,
  tooltip,
  mediaType,
  wrapperOffsetHeight,
  selectOptions,
  onRunsTagsChange,
  listLayout = 'horizontal',
  columnWidth,
  listHeightOverride,
}: IMediaListProps): React.FunctionComponentElement<React.ReactNode> {
  const effectiveWidth =
    listLayout === 'vertical' && columnWidth != null
      ? columnWidth
      : wrapperOffsetWidth;

  const itemSize = React.useCallback(
    (index: number) => {
      if (mediaType === MediaTypeEnum.AUDIO) {
        const size = MEDIA_ITEMS_SIZES[mediaType]();
        return listLayout === 'vertical' ? size.height : size.width;
      } else {
        const size = MEDIA_ITEMS_SIZES[mediaType]({
          data,
          index,
          additionalProperties,
          wrapperOffsetWidth: effectiveWidth,
          wrapperOffsetHeight,
        });
        return listLayout === 'vertical'
          ? size.height + ITEM_CAPTION_HEIGHT
          : size.width;
      }
    },
    [
      additionalProperties,
      data,
      mediaType,
      wrapperOffsetHeight,
      effectiveWidth,
      listLayout,
    ],
  );

  const listHeight = React.useMemo(() => {
    if (listLayout === 'vertical') {
      return listHeightOverride ?? wrapperOffsetHeight;
    }
    const { maxWidth, maxHeight } = getBiggestImageFromList(data);
    const { alignmentType, mediaItemSize } = additionalProperties;
    if (mediaType === MediaTypeEnum.IMAGE) {
      return MEDIA_LIST_HEIGHT[mediaType]({
        alignmentType,
        maxHeight,
        maxWidth,
        wrapperOffsetWidth,
        mediaItemSize,
        mediaItemHeight,
      });
    } else {
      return MEDIA_LIST_HEIGHT[mediaType](mediaItemHeight);
    }
  }, [
    additionalProperties,
    data,
    mediaItemHeight,
    mediaType,
    wrapperOffsetWidth,
    wrapperOffsetHeight,
    listLayout,
    listHeightOverride,
  ]);

  const listWidth =
    listLayout === 'vertical' ? effectiveWidth : wrapperOffsetWidth;
  const mediaItemHeightForItems =
    listLayout === 'horizontal' ? listHeight : undefined;

  return (
    <ErrorBoundary>
      <List
        height={listHeight}
        itemCount={data.length}
        itemSize={itemSize}
        layout={listLayout}
        width={listWidth}
        style={{ overflowY: 'hidden' }}
        itemData={{
          data,
          addUriToList,
          mediaItemHeight: mediaItemHeightForItems ?? mediaItemHeight,
          focusedState,
          additionalProperties,
          tooltip,
          mediaType,
          selectOptions,
          onRunsTagsChange,
        }}
      >
        {MediaBoxMemoized}
      </List>
    </ErrorBoundary>
  );
}

export default MediaList;

const MediaBoxMemoized = React.memo(function MediaBoxMemoized(props: any) {
  const { index, style, data } = props;
  const Component = mediaBoxType[data.mediaType];

  return (
    <ErrorBoundary>
      <Component
        key={index}
        index={index}
        style={style}
        data={data.data[index]}
        addUriToList={data.addUriToList}
        mediaItemHeight={data.mediaItemHeight}
        focusedState={data.focusedState}
        additionalProperties={data.additionalProperties}
        tooltip={data.tooltip}
        selectOptions={data.selectOptions}
        onRunsTagsChange={data.onRunsTagsChange}
      />
    </ErrorBoundary>
  );
}, areEqual);
