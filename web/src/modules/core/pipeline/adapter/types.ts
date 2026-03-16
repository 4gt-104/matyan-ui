import { MatyanObjectDepths } from 'types/core/enums';
import {
  IndexRanges,
  RecordRanges,
  MatyanFlatObjectBase,
} from 'types/core/MatyanObjects';
import { Context } from 'types/core/shared';

export type ProcessInterceptor = (...arg: any) => any;

export type DepthInterceptors = {
  [key in MatyanObjectDepths]: ProcessInterceptor;
};

export interface IQueryableData {
  ranges?: RecordRanges & IndexRanges;
}

export interface ProcessedData {
  objectList: MatyanFlatObjectBase[];
  queryable_data: IQueryableData;
  additionalData: {
    params: string[];
    sequenceInfo: string[];
    modifiers: string[];
  };
}

export type ObjectHashCreator = {
  runHash: string;
  name?: string;
  context?: Context;
  step?: number;
  index?: number;
};
