import React from 'react';
import _ from 'lodash-es';
import { VariableSizeList as List, areEqual } from 'react-window';
import classNames from 'classnames';

import { Tooltip } from '@material-ui/core';

import MediaList from 'components/MediaList';
import { JsonViewPopover } from 'components/kit';
import ControlPopover from 'components/ControlPopover/ControlPopover';
import { MediaTypeEnum } from 'components/MediaPanel/config';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import DepthDropdown from 'components/DepthDropdown/DepthDropdown';
import DepthSlider from 'components/DepthSlider/DepthSlider';

import {
  ITEM_CAPTION_HEIGHT,
  MEDIA_ITEMS_SIZES,
  MEDIA_SET_SIZE,
  MEDIA_SET_SLIDER_HEIGHT,
  MEDIA_SET_TITLE_HEIGHT,
  MEDIA_SET_WRAPPER_PADDING_HEIGHT,
} from 'config/mediaConfigs/mediaConfigs';

import { jsonParse } from 'utils/jsonParse';
import getBiggestImageFromList from 'utils/getBiggestImageFromList';

import { buildMediaSetContent } from './mediaSetContentUtils';
import { IMediaSetProps } from './MediaSet.d';

import './MediaSet.scss';

const MediaSet = ({
  data,
  onListScroll,
  addUriToList,
  index = 0,
  mediaSetKey,
  wrapperOffsetHeight,
  wrapperOffsetWidth,
  orderedMap,
  focusedState,
  additionalProperties,
  tableHeight,
  tooltip,
  mediaType,
  sortFieldsDict,
  sortFields,
  selectOptions,
  onRunsTagsChange,
  listLayout = 'rows',
}: IMediaSetProps): React.FunctionComponentElement<React.ReactNode> => {
  const [depthMap, setDepthMap] = React.useState<number[]>([]);

  const content = React.useMemo(
    () =>
      buildMediaSetContent(
        data,
        orderedMap,
        additionalProperties.stacking,
        sortFieldsDict,
        sortFields,
      ),
    [
      data,
      orderedMap,
      additionalProperties.stacking,
      sortFieldsDict,
      sortFields,
    ],
  );

  function getItemSize(index: number): number {
    let [path, items] = content[index];
    const { maxHeight, maxWidth } = getBiggestImageFromList(items.flat());
    const { mediaItemSize, alignmentType, stacking } = additionalProperties;
    const lastPath = path[path.length - 1];
    const isStackedPath = stacking && typeof lastPath === 'object';
    const { pathValue } = getPathDetails({
      isStackedPath,
      lastPath,
    });
    if (path.length === 1) {
      return 0;
    }
    if (items.length > 0) {
      if (mediaType === MediaTypeEnum.IMAGE) {
        return MEDIA_SET_SIZE[mediaType]({
          maxHeight,
          maxWidth,
          mediaItemHeight,
          alignmentType,
          wrapperOffsetWidth,
          mediaItemSize,
          stacking: isStackedPath && pathValue.length > 1,
        });
      }
      if (mediaType === MediaTypeEnum.AUDIO) {
        return MEDIA_SET_SIZE[mediaType]();
      }
    }
    return MEDIA_SET_TITLE_HEIGHT + MEDIA_SET_WRAPPER_PADDING_HEIGHT;
  }

  const onDepthChange = React.useCallback(
    (value: number, index: number): void => {
      if (value !== depthMap[index]) {
        let tmpDepthMap = [...depthMap];
        tmpDepthMap[index] = value;
        setDepthMap(tmpDepthMap);
      }
    },
    [depthMap, setDepthMap],
  );

  const isColumns = listLayout === 'columns';

  // In columns mode images are stacked vertically and often appear too small.
  // Scale the effective height up so that column widths (derived from aspect
  // ratio × height) are more comfortable to read.
  const COLUMNS_HEIGHT_SCALE = 1.5;
  const effectiveWrapperOffsetHeight = isColumns
    ? wrapperOffsetHeight * COLUMNS_HEIGHT_SCALE
    : wrapperOffsetHeight;

  const mediaItemHeight = React.useMemo(() => {
    if (mediaType === MediaTypeEnum.AUDIO) {
      return MEDIA_ITEMS_SIZES[mediaType]()?.height;
    } else {
      return MEDIA_ITEMS_SIZES[mediaType]({
        data,
        additionalProperties,
        wrapperOffsetWidth,
        wrapperOffsetHeight: effectiveWrapperOffsetHeight,
      })?.height;
    }
  }, [
    additionalProperties,
    data,
    mediaType,
    effectiveWrapperOffsetHeight,
    wrapperOffsetWidth,
  ]);

  React.useEffect(() => {
    if (additionalProperties.stacking && content.length) {
      setDepthMap(Array(content.length).fill(0));
    }
  }, [additionalProperties.stacking, data, content.length]);

  const itemData = React.useMemo(
    () => ({
      data: content,
      addUriToList,
      wrapperOffsetWidth,
      wrapperOffsetHeight: effectiveWrapperOffsetHeight,
      index,
      mediaSetKey,
      mediaItemHeight,
      focusedState,
      additionalProperties,
      tooltip,
      mediaType,
      depthMap,
      onDepthChange,
      selectOptions,
      onRunsTagsChange,
      listLayout,
    }),
    [
      content,
      addUriToList,
      wrapperOffsetWidth,
      wrapperOffsetHeight,
      index,
      mediaSetKey,
      mediaItemHeight,
      focusedState,
      additionalProperties,
      tooltip,
      mediaType,
      depthMap,
      onDepthChange,
      selectOptions,
      onRunsTagsChange,
      listLayout,
    ],
  );

  if (isColumns) {
    // Group content items into visual columns. A path.length=2 item starts a
    // new column; all deeper items (path.length>=3) belong to the most-recently
    // opened column. This ensures that multi-level grouping produces nested
    // headers inside one column instead of separate empty "padding" columns.
    const columnGroups: number[][] = [];
    content.forEach(([path], originalIndex) => {
      if (path.length < 2) return; // skip separators
      if (path.length === 2) {
        columnGroups.push([originalIndex]);
      } else {
        if (columnGroups.length === 0) columnGroups.push([]);
        columnGroups[columnGroups.length - 1].push(originalIndex);
      }
    });

    return (
      <ErrorBoundary>
        <div className='MediaSet__columns'>
          {columnGroups.map((groupIndices, groupIdx) => (
            <div key={groupIdx} className='MediaSet__column'>
              {groupIndices.map((originalIndex) => (
                <MediaGroupedList
                  key={originalIndex}
                  index={originalIndex}
                  style={{}}
                  data={itemData}
                />
              ))}
            </div>
          ))}
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <List
        key={`${content.length}-${tableHeight}-${mediaSetKey}`}
        height={wrapperOffsetHeight || 0}
        itemCount={content.length}
        itemSize={getItemSize}
        width='100%'
        onScroll={onListScroll}
        itemData={itemData}
      >
        {MediaGroupedList}
      </List>
    </ErrorBoundary>
  );
};

function propsComparator(
  prevProps: IMediaSetProps,
  nextProps: IMediaSetProps,
): boolean {
  if (
    prevProps.mediaSetKey !== nextProps.mediaSetKey ||
    prevProps.data !== nextProps.data ||
    prevProps.wrapperOffsetHeight !== nextProps.wrapperOffsetHeight ||
    prevProps.wrapperOffsetWidth !== nextProps.wrapperOffsetWidth ||
    prevProps.focusedState !== nextProps.focusedState ||
    prevProps.sortFieldsDict !== nextProps.sortFieldsDict ||
    prevProps.listLayout !== nextProps.listLayout
  ) {
    return false;
  }
  return true;
}

export default React.memo(MediaSet, propsComparator);

const MediaGroupedList = React.memo(function MediaGroupedList({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: { [key: string]: any };
}) {
  const [path, items] = data.data[index];
  const lastPath = path[path.length - 1];
  const depth = data.depthMap[index] || 0;
  const isStackedPath =
    data.additionalProperties.stacking && typeof lastPath === 'object';
  const { pathKey, pathValue } = getPathDetails({
    isStackedPath,
    lastPath,
  });
  const { currentValue, currentItems } = getCurrentContent({
    isStackedPath,
    pathValue,
    depth,
    items,
  });
  const json: string | object = jsonParse(currentValue);
  const isJson: boolean = typeof json === 'object';
  const renderStacking =
    currentItems.length > 0 && isStackedPath && pathValue.length > 1;
  const isColumns = (data.listLayout ?? 'rows') === 'columns';

  // Compute the column width from the actual rendered image widths so images
  // are the same size as in rows mode (no stretching).
  const naturalColumnWidth = React.useMemo(() => {
    if (!isColumns || currentItems.length === 0) return undefined;
    const maxW = Math.max(
      ...currentItems.map((_: any, i: number) => {
        const sizeFn = (MEDIA_ITEMS_SIZES as any)[data.mediaType]; // noqa: ANN401
        const size = sizeFn?.({
          data: currentItems,
          index: i,
          additionalProperties: data.additionalProperties,
          wrapperOffsetWidth: data.wrapperOffsetWidth,
          wrapperOffsetHeight: data.wrapperOffsetHeight,
        });
        return size?.width ?? 60;
      }),
    );
    return Math.max(maxW, 60);
  }, [
    isColumns,
    currentItems,
    data.mediaType,
    data.additionalProperties,
    data.wrapperOffsetWidth,
    data.wrapperOffsetHeight,
  ]);

  const mergedStyle: React.CSSProperties = isColumns
    ? currentItems.length > 0
      ? { width: naturalColumnWidth }
      : {} // header-only item: let the parent column div determine width
    : {
        paddingLeft: `calc(0.625rem * ${path.length - 2})`,
        ...style,
      };
  return (
    <ErrorBoundary>
      <div
        className={classNames('MediaSet', { 'MediaSet--columns': isColumns })}
        style={mergedStyle}
      >
        {!isColumns &&
          path.slice(2).map((key: string, i: number) => (
            <ErrorBoundary key={key}>
              <div
                className='MediaSet__connectorLine'
                style={{ left: `calc(0.625rem * ${i})` }}
              />
            </ErrorBoundary>
          ))}
        <div
          className={`MediaSet__container ${path.length > 2 ? 'withDash' : ''}`}
        >
          {path.length > 1 && (
            <ErrorBoundary>
              <ControlPopover
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                anchor={({ onAnchorClick }) => (
                  <span className='MediaSet__container__path'>
                    <Tooltip
                      placement='top-start'
                      title={`${pathKey} = ${currentValue}`}
                    >
                      <span
                        className='MediaSet__container__path__title'
                        style={{
                          height: MEDIA_SET_TITLE_HEIGHT,
                          width: renderStacking ? '' : '100%',
                        }}
                      >
                        <span
                          className={classNames(
                            'MediaSet__container__path__title__key',
                            {
                              stacked: renderStacking,
                            },
                          )}
                        >
                          {pathKey}
                        </span>
                        =
                        <span
                          onClick={isJson ? onAnchorClick : undefined}
                          className={classNames(
                            'MediaSet__container__path__title__value',
                            {
                              stacked: renderStacking,
                              MediaSet__container__path__title__pointer: isJson,
                            },
                          )}
                        >
                          {currentValue}
                        </span>
                      </span>
                    </Tooltip>
                    {renderStacking && (
                      <DepthDropdown
                        index={index}
                        pathValue={pathValue}
                        depth={depth}
                        onDepthChange={data.onDepthChange}
                      />
                    )}
                  </span>
                )}
                component={<JsonViewPopover json={json as object} />}
              />
            </ErrorBoundary>
          )}
          {renderStacking && (
            <DepthSlider
              index={index}
              items={pathValue as string[]}
              depth={depth}
              onDepthChange={data.onDepthChange}
              style={{ height: MEDIA_SET_SLIDER_HEIGHT }}
            />
          )}
          {currentItems.length > 0 && (
            <div className='MediaSet__container__mediaItemsList'>
              <MediaList
                key={`${index}-${depth}-${data.listLayout ?? 'rows'}`}
                data={currentItems}
                addUriToList={data.addUriToList}
                wrapperOffsetWidth={data.wrapperOffsetWidth}
                wrapperOffsetHeight={data.wrapperOffsetHeight}
                mediaItemHeight={data.mediaItemHeight}
                focusedState={data.focusedState}
                additionalProperties={data.additionalProperties}
                tooltip={data.tooltip}
                mediaType={data.mediaType}
                selectOptions={data.selectOptions}
                onRunsTagsChange={data.onRunsTagsChange}
                listLayout={isColumns ? 'vertical' : 'horizontal'}
                columnWidth={isColumns ? naturalColumnWidth : undefined}
                listHeightOverride={
                  isColumns
                    ? currentItems.length *
                        (data.mediaItemHeight + ITEM_CAPTION_HEIGHT) +
                      1
                    : undefined
                }
              />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
},
areEqual);

function getPathDetails({
  isStackedPath,
  lastPath,
}: {
  isStackedPath: boolean;
  lastPath: any;
}) {
  let pathKey = '';
  let pathValue: string | string[] = '';
  if (isStackedPath) {
    pathKey = Object.keys(lastPath)[0];
    pathValue = lastPath[pathKey];
  } else {
    [pathKey = '', pathValue = ''] = lastPath?.split(' = ');
  }
  return { pathKey, pathValue };
}

function getCurrentContent({
  isStackedPath,
  pathValue,
  depth,
  items,
}: {
  isStackedPath: boolean;
  pathValue: string | string[];
  depth: number;
  items: [] | [][];
}) {
  let currentValue = '';
  let currentItems: [] = [];

  if (isStackedPath) {
    currentValue = (pathValue[depth] as string)?.trim();
    for (let item of items) {
      if (item[depth]) {
        currentItems.push(item[depth]);
      }
    }
  } else {
    currentValue = (pathValue as string)?.trim();
    currentItems = items as [];
  }
  return { currentValue, currentItems };
}
