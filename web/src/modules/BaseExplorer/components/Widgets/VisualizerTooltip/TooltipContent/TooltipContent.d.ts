import {
  ITooltipConfig,
  TooltipAppearanceEnum,
} from 'modules/BaseExplorer/components/Controls/ConfigureTooltip';

import { MatyanFlatObjectBaseRun } from 'types/core/MatyanObjects';

export interface ITooltipContentProps {
  tooltipAppearance?: TooltipAppearanceEnum;
  focused?: boolean;
  onChangeTooltip: (tooltipConfig: Partial<ITooltipConfig>) => void;
  run?: MatyanFlatObjectBaseRun;
  selectedProps?: Record<string, string | number>;
  selectedGroupingProps?: Record<string, any>;
  renderHeader?: Function;
}

export interface IAppearanceActionButtonsProps {
  appearance: TooltipAppearanceEnum;
  onChangeAppearance: (appearance: TooltipAppearanceEnum) => void;
}

export interface IRunAdditionalInfoProps {
  runHash?: string;
  experimentId?: string;
}

export interface ISelectedFieldsProps {
  fields?: Record<string, string | number>;
  isPopoverPinned?: boolean;
}

export interface ISelectedGroupingFieldsProps {
  fields?: Record<string, any>;
}
