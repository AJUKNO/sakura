/**
 * @vitest-environment jsdom
 */

/* eslint-disable @typescript-eslint/unbound-method */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CustomManager from '@/managers/custom-manager';
import CustomElement from './custom-element';

describe('CustomManager', () => {
  let manager: CustomManager;

  beforeEach(() => {
    manager = new CustomManager();

    vi.spyOn(document, 'querySelector').mockReturnValue(
      document.createElement('my-element')
    );
    vi.spyOn(customElements, 'get').mockReturnValue(undefined);
    vi.spyOn(customElements, 'define');
  });

  it('should define a custom element with a constructor', async () => {
    const tag = 'my-element';

    await manager.defineElement(tag, CustomElement);

    expect(customElements.define).toHaveBeenCalledWith(tag, CustomElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
