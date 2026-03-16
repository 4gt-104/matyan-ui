import React from 'react';

import { Button, Text } from 'components/kit';

import './SelectFormActions.scss';

interface ISelectFormActionsProps {
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

function SelectFormActions({
  onSelectAll,
  onDeselectAll,
}: ISelectFormActionsProps): React.FunctionComponentElement<React.ReactNode> {
  return (
    <div className='SelectFormActions' onMouseDown={(e) => e.preventDefault()}>
      <Button
        variant='text'
        size='xSmall'
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onSelectAll();
        }}
      >
        <Text size={12} tint={100}>
          Select all
        </Text>
      </Button>
      <Button
        variant='text'
        size='xSmall'
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onDeselectAll();
        }}
      >
        <Text size={12} tint={100}>
          Deselect all
        </Text>
      </Button>
    </div>
  );
}

export default React.memo(SelectFormActions);
