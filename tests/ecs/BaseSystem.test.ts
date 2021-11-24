/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

import { Engine } from '../../src';
import { S1 } from '../_test_classes/S1';

describe('>>> System', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = Engine.instance;
    for (const system of engine.systems) {
      engine.unregisterSystem(system);
    }

    window.requestAnimationFrame = jest.fn().mockImplementationOnce((cb) => cb()); // <-- ADD
  });

  it('should trigger OnCreate', () => {
    const s = new S1();
    const spy = jest.spyOn(s, 'onCreate');

    s.onCreate(0);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should trigger OnUpdate', () => {
    engine = Engine.instance;
    const s = new S1();
    const spy = jest.spyOn(s, 'onUpdate');

    s.onUpdate(0);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should trigger OnDestroy', () => {
    const s = new S1();
    const spy = jest.spyOn(s, 'onDestroy');

    s.onDestroy(0);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
