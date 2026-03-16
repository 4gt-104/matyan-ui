import renderer from 'modules/BaseExplorer';
import AudioBox from 'modules/BaseExplorer/components/AudioBox';

import { MatyanObjectDepths, SequenceTypesEnum } from 'types/core/enums';

import { getAudiosDefaultConfig } from './config';

const defaultConfig = getAudiosDefaultConfig();

const AudiosExplorer = renderer(
  {
    name: 'Audios Explorer',
    sequenceName: SequenceTypesEnum.Audios,
    basePath: 'audios',
    persist: true,
    adapter: {
      objectDepth: MatyanObjectDepths.Index,
    },
    groupings: defaultConfig.groupings,
    visualizations: {
      vis1: {
        component: defaultConfig.Visualizer,
        controls: defaultConfig.controls,
        box: {
          ...defaultConfig.box,
          component: AudioBox,
        },
      },
    },
    getStaticContent: defaultConfig.getStaticContent,
  },
  __DEV__,
);

export default AudiosExplorer;
