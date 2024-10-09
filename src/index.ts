import Sakura from '@/sakura';
import { lazy } from '@/utils/lazy';
import SakuraLogger from '@/utils/logger';

const sakura = new Sakura();

export { sakura, Sakura, lazy, SakuraLogger };
export type * from '@/types';
