import Sakura from '@/sakura';
import CustomManager from '@/managers/custom-manager';
import CustomPluginManager from '@/managers/custom-plugin-manager';
import Logger from '@/utils/logger';
import CustomPubSub from '@/utils/pubsub';
import { SAKURA_LOGGER_OPTIONS } from '@/utils/constants';
import { BaseEvent } from '@/types';

const sakura = new Sakura({
  elementManager: new CustomManager(),
  pluginManager: new CustomPluginManager(),
  logger: new Logger(SAKURA_LOGGER_OPTIONS),
  pubsub: new CustomPubSub<BaseEvent>(),
});

export {
  sakura,
  Sakura,
  CustomManager,
  CustomPluginManager,
  Logger,
  CustomPubSub,
};
export type * from '@/types';
