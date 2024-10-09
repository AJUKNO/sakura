import {
  CustomElementManager,
  ElementDefinition,
  ElementProvider,
  Installer,
} from '@/types';

export default class ElementRegistrar<T extends ElementProvider>
  implements Installer<ElementDefinition<T>>
{
  private manager: CustomElementManager<T>;

  constructor(manager: CustomElementManager<T>) {
    this.manager = manager;
  }

  async install(
    items: ElementDefinition<T> | ElementDefinition<T>[]
  ): Promise<void> {
    if (Array.isArray(items)) {
      for (const item of items) {
        await this.manager.define(item.name, item.element);
      }
    } else {
      await this.manager.define(items.name, items.element);
    }
  }
}
