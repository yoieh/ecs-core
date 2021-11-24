/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

import { Engine } from '../../src';
import { BaseSystem } from '../../src/ecs/BaseSystem';
import { SignalListener } from '@yoieh/signal';

class S1 extends BaseSystem {}
class S2 extends BaseSystem {}
class S3 extends BaseSystem {}

describe('>>> Engine', () => {
  let engine: Engine;

  let lastUpdate = Date.now();

  const tick = () => {
    const now = Date.now();
    const dt = now - lastUpdate;
    lastUpdate = now;

    engine.update(dt);
    // render(dt);
  };

  const loop = (updates: number) => {
    for (let index = 0; index < updates; index++) {
      tick();
    }
  };

  beforeEach(() => {
    engine = Engine.instance;
    for (const system of engine.systems) {
      engine.unregisterSystem(system);
    }

    window.requestAnimationFrame = jest.fn().mockImplementationOnce((cb) => cb()); // <-- ADD
  });

  it('should register a new system', () => {
    const s1 = new S1();

    expect(engine.systems.length).toBe(1);
  });

  it('should update registerd systems', () => {
    engine = Engine.instance;
    engine.update(1);
    const s1 = new S1();
    const s2 = new S2();
    const s3 = new S3();

    const spyOnUpdate1 = jest.spyOn(s1, 'onUpdate');
    const spyOnUpdate2 = jest.spyOn(s2, 'onUpdate');
    const spyOnUpdate3 = jest.spyOn(s3, 'onUpdate');

    const updates = 10;
    loop(updates);

    expect(spyOnUpdate1).toHaveBeenCalledTimes(updates);
    expect(spyOnUpdate2).toHaveBeenCalledTimes(updates);
    expect(spyOnUpdate3).toHaveBeenCalledTimes(updates);
  });

  it('should register systems', () => {
    engine = Engine.instance;

    const spy1 = jest.spyOn(engine, 'registerSystem');
    const spy2 = jest.fn();

    new SignalListener(engine.onSystemAdded, spy2);

    const s1 = new S1();
    const s2 = new S2();
    const s3 = new S3();

    expect(spy1).toHaveBeenCalledTimes(3);
    expect(spy2).toHaveBeenCalledTimes(3);

    expect(engine.systems.length).toBe(3);
  });

  it('should unregister systems', () => {
    engine = Engine.instance;

    const spy1 = jest.spyOn(engine, 'unregisterSystem');
    const spy2 = jest.fn();

    new SignalListener(engine.onSystemRemoved, spy2);

    const s1 = new S1();
    const s2 = new S2();
    const s3 = new S3();

    engine.unregisterSystem(s1);

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);

    expect(engine.systems.length).toBe(2);
  });
});
