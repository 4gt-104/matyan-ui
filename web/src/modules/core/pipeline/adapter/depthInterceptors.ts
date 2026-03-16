import { MatyanObjectDepths } from 'types/core/enums';
import { SequenceFullView, Container } from 'types/core/MatyanObjects';
import { Record } from 'types/core/shared';

import { DepthInterceptors } from './types';

const depthInterceptors: DepthInterceptors = {
  [MatyanObjectDepths.Container]: (container: Container) => {
    return {
      data: {
        traces: (container as Container).traces,
      },
    };
  },
  [MatyanObjectDepths.Sequence]: (sequence: SequenceFullView) => {
    return {
      data: sequence,
    };
  },
  [MatyanObjectDepths.Step]: (sequenceBase: SequenceFullView) => {
    return {
      data: sequenceBase,
    };
  },
  [MatyanObjectDepths.Index]: (record: Record) => {
    return {
      data: record,
    };
  },
};

export default depthInterceptors;
