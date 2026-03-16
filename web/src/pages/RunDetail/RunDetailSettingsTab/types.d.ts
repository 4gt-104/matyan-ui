export interface IRunDetailSettingsTabProps {
  runHash: string;
  defaultName: string;
  defaultDescription?: string;
  isArchived: boolean;
  isActive: boolean;
}

export interface IRunNameAndDescriptionCardProps
  extends IRunDetailSettingsTabProps {}
