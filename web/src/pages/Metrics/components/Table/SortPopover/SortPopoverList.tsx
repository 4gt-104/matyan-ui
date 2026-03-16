import React from 'react';
import classNames from 'classnames';
import _ from 'lodash-es';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
} from 'react-beautiful-dnd';

import { ToggleButton, Icon, Text, Button } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { ISortPopoverListProps } from 'types/pages/metrics/components/SortPopover/SortPopover';

import { SortActionTypes, SortField } from 'utils/getSortedFields';

import './SortPopover.scss';

function SortPopoverList({
  filteredSortFields,
  sortFields,
  onSort,
  title,
  reorderable = false,
}: ISortPopoverListProps): React.FunctionComponentElement<React.ReactNode> {
  function handleDelete(field: SortField): void {
    onSort({ field, actionType: SortActionTypes.DELETE });
  }

  function handleDragEnd(result: DropResult) {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }
    const reordered = Array.from(filteredSortFields);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const isReadOnlyList = filteredSortFields[0]?.readonly;
    const newSortFields = isReadOnlyList
      ? [...reordered, ...sortFields.filter((f: SortField) => !f.readonly)]
      : [...sortFields.filter((f: SortField) => f.readonly), ...reordered];

    onSort?.({ sortFields: newSortFields, actionType: SortActionTypes.CHANGE });
  }

  function renderChip(
    field: SortField,
    index: number,
    dragProvided?: DraggableProvided,
  ) {
    return (
      <div className='SortPopover__chip' key={field.value}>
        <div className='SortPopover__chip__left'>
          {reorderable && dragProvided?.dragHandleProps && (
            <span
              className='SortPopover__chip__dragHandle'
              {...dragProvided.dragHandleProps}
            >
              <Icon name='drag' fontSize={12} />
            </span>
          )}
          <Button
            className={classNames('SortPopover__chip__delete', {
              disabled: field.readonly,
            })}
            onClick={() => handleDelete(field)}
            withOnlyIcon
          >
            <Icon name='close' color='#414B6D' />
          </Button>
        </div>
        <ToggleButton
          className='TooltipContentPopover__toggle__button'
          onChange={(value) => {
            onSort &&
              onSort({
                sortFields,
                order: value,
                index: sortFields.findIndex(
                  (sortField: SortField) => sortField.value === field.value,
                ),
                field: field.value,
                actionType: SortActionTypes.ORDER_CHANGE,
              });
          }}
          leftLabel={'Asc'}
          rightLabel={'Desc'}
          leftValue={'asc'}
          rightValue={'desc'}
          value={field.order as string}
          title={field.label}
        />
      </div>
    );
  }

  const chipList = reorderable ? (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={`sort-fields-list-${title || 'default'}`}>
        {(droppableProvided) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className='SortPopover__container__chipContainer'
          >
            {filteredSortFields.map((field: SortField, index: number) => (
              <Draggable
                key={field.value}
                draggableId={field.value}
                index={index}
              >
                {(draggableProvided) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    className='SortPopover__chipWrapper'
                  >
                    {renderChip(field, index, draggableProvided)}
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  ) : (
    <div className='SortPopover__container__chipContainer'>
      {filteredSortFields.map((field: SortField, index: number) =>
        renderChip(field, index),
      )}
    </div>
  );

  return (
    <ErrorBoundary>
      {!_.isEmpty(filteredSortFields) && (
        <Text size={12} tint={50} className={'SortPopover__container__label'}>
          {title}
        </Text>
      )}
      {chipList}
    </ErrorBoundary>
  );
}

export default React.memo<ISortPopoverListProps>(SortPopoverList);
