import React from 'react';

import { MatyanFlatObjectBase } from 'types/core/MatyanObjects';

import BoxWithStacking from './BoxWithStacking';
import Box from './Box';

import { IBoxWrapperProps } from '.';

import './BoxWrapper.scss';

function BoxWrapper(props: IBoxWrapperProps<MatyanFlatObjectBase<any>>) {
  const {
    engine,
    component: BoxContent,
    boxId,
    boxItems,
    boxIndex,
    visualizationName,
    boxStacking,
    depthSelector,
    onDepthMapChange,
  } = props;

  if (boxStacking) {
    return (
      <BoxWithStacking
        engine={engine}
        boxId={boxId}
        boxItems={boxItems}
        boxIndex={boxIndex}
        component={BoxContent}
        visualizationName={visualizationName}
        depthSelector={depthSelector}
        onDepthMapChange={onDepthMapChange}
      />
    );
  }
  return (
    <Box
      engine={engine}
      boxId={boxId}
      boxItems={boxItems}
      boxIndex={boxIndex}
      component={BoxContent}
      visualizationName={visualizationName}
    />
  );
}

BoxWrapper.displayName = 'BoxWrapper';

export default React.memo<IBoxWrapperProps<MatyanFlatObjectBase>>(BoxWrapper);
