import React from 'react';

import { MatyanFlatObjectBase } from 'types/core/MatyanObjects';

import { IGroupInfo } from '../../types';

export interface IBoxFullViewPopoverProps {
  onClose: () => void;
  item: MatyanFlatObjectBase;
  children: React.ReactNode;
  sequenceName: string;
  itemGroupInfo: Record<string, IGroupInfo>;
}
