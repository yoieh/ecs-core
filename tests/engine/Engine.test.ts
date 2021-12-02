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

    engine.tick(dt);
    engine.render();
  };

  const loop = (updates: number) => {
    for (let index = 0; index < updates; index++) {
      tick();
    }
  };

  beforeEach(() => {
    engine = Engine.instance;

    // window.requestAnimationFrame = jest.fn().mockImplementationOnce((cb) => cb()); // <-- ADD
  });

  afterEach(() => {
    jest.clearAllMocks();

    for (const system of engine.systems) {
      engine.unregisterSystem(system);
    }

    loop(5);
  });

  it('should register a new system with out a engine tick', () => {
    engine.createSystem(S1);
    expect(engine.systems.length).toBe(1);
  });

  it('should update registerd systems', () => {
    engine = Engine.instance;
    engine.update(1);
    const s1 = engine.createSystem(S1);
    const s2 = engine.createSystem(S2);
    const s3 = engine.createSystem(S3);

    const spyOnUpdate1 = jest.spyOn(s1, 'onUpdate');
    const spyOnUpdate2 = jest.spyOn(s2, 'onUpdate');
    const spyOnUpdate3 = jest.spyOn(s3, 'onUpdate');

    const updates = 10;
    loop(updates);

    expect(spyOnUpdate1).toHaveBeenCalledTimes(updates);
    expect(spyOnUpdate2).toHaveBeenCalledTimes(updates);
    expect(spyOnUpdate3).toHaveBeenCalledTimes(updates);
  });

  it('should render registerd systems', () => {
    engine = Engine.instance;
    const s1 = engine.createSystem(S1);
    const s2 = engine.createSystem(S2);
    const s3 = engine.createSystem(S3);

    const spyOnRender1 = jest.spyOn(s1, 'onRender');
    const spyOnRender2 = jest.spyOn(s2, 'onRender');
    const spyOnRender3 = jest.spyOn(s3, 'onRender');

    const updates = 10;
    loop(updates);

    expect(spyOnRender1).toHaveBeenCalledTimes(updates);
    expect(spyOnRender2).toHaveBeenCalledTimes(updates);
    expect(spyOnRender3).toHaveBeenCalledTimes(updates);
  });

  it('should register systems', () => {
    engine = Engine.instance;

    const spy1 = jest.spyOn(engine, 'registerSystem');
    const spy2 = jest.fn();

    new SignalListener(engine.onSystemAdded, spy2);

    engine.createSystem(S1);
    engine.createSystem(S2);
    engine.createSystem(S3);

    expect(spy1).toHaveBeenCalledTimes(3);
    expect(spy2).toHaveBeenCalledTimes(3);

    expect(engine.systems.length).toBe(3);
  });

  it('should unregister systems', () => {
    engine = Engine.instance;

    const spy1 = jest.spyOn(engine, 'unregisterSystem');
    const spy2 = jest.fn();

    new SignalListener(engine.onSystemRemoved, spy2);

    const s1 = engine.createSystem(S1);
    engine.createSystem(S2);
    engine.createSystem(S3);

    const systemsCount = engine.systems.length;

    expect(systemsCount).toBe(3);

    engine.unregisterSystem(s1);

    loop(1);

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);

    expect(engine.systems.length).toBe(systemsCount - 1);
  });

  it('should create systems', () => {
    engine = Engine.instance;

    const spy1 = jest.spyOn(engine, 'createSystem');
    const spy2 = jest.fn();

    new SignalListener(engine.onSystemAdded, spy2);

    engine.createSystem(S1);
    engine.createSystem(S2);
    engine.createSystem(S3);

    expect(spy1).toHaveBeenCalledTimes(3);
    expect(spy2).toHaveBeenCalledTimes(3);

    expect(engine.systems.length).toBe(3);
  });
});
