/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

import { Engine } from '../../src';
import { BaseSystem } from '../../src/ecs/BaseSystem';

class S extends BaseSystem {}

describe('>>> System', () => {
  let engine: Engine;

  it('should trigger OnCreate', () => {
    const s = new S();
    const spy = jest.spyOn(s, 'onCreate');

    s.onCreate(0);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should trigger OnUpdate', () => {
    const s = new S();
    const spy = jest.spyOn(s, 'onUpdate');

    s.onUpdate(0);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should trigger OnDestroy', () => {
    const s = new S();
    const spy = jest.spyOn(s, 'onDestroy');

    s.onDestroy(0);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
