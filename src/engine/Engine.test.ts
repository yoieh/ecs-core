/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

import { Engine } from '..';
import { BaseSystem } from '../ecs/BaseSystem';

class S extends BaseSystem {}

describe('>>> Engine', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = Engine.instance;

    window.requestAnimationFrame = jest.fn().mockImplementationOnce((cb) => cb()); // <-- ADD
  });

  // awake dosent exist in the engine anymore
  // it("should start update loop next frame after awake", () => {
  //   const spy = jest.spyOn(engine, "Update");

  //   engine.Awake();

  //   expect(spy).toHaveBeenCalledTimes(1);
  // });

  it('should register a new system', () => {
    const s = new S();

    expect(engine.systems.length).toBe(1);
  });
});
