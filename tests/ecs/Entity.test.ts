/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

import { SignalListener } from '@yoieh/signal';
import { Entity } from '../../src';
import { C1 } from '../_test_classes/C1';
import { C2 } from '../_test_classes/C2';
import { C3 } from '../_test_classes/C3';

describe('>>> Entity', () => {
  let e: Entity;
  const c1 = new C1();
  const c2 = new C2();
  const c3 = new C3();

  beforeEach(() => {
    e = new Entity(4);
  });

  it('should add, remove, get, and check components', () => {
    expect(e.components.length).toBe(0);
    e.addComponent(c1);
    e.addComponent(c2);
    e.addComponent(c3);

    expect(e.components.length).toBe(3);
    expect(e.components[0]).toBe(c1);
    expect(e.components[1]).toBe(c2);
    expect(e.components[2]).toBe(c3);

    e.removeComponent(C2);
    expect(e.components.length).toBe(2);
    expect(e.components[0]).toBe(c1);
    expect(e.components[1]).toBe(c3);

    expect(e.getComponent(C1)).toBe(c1);
    expect(e.getComponent(C3)).toBe(c3);

    expect(e.has(C1)).toBeTruthy();
    expect(e.has(C3)).toBeTruthy();
  });

  it("should throw error if component wasn't found", () => {
    expect(e.has(C1)).toBeFalsy();
    expect(() => e.getComponent(C1)).toThrow();
  });

  it('should trigger onComponentAdded', () => {
    const spy1 = jest.fn();
    new SignalListener(e.onComponentAdded, spy1);

    e.addComponent(c1);

    expect(spy1).toHaveBeenCalledTimes(1);
  });

  it('should trigger onComponentRemoved', () => {
    const spy1 = jest.fn();
    new SignalListener(e.onComponentRemoved, spy1);

    e.addComponent(c1);
    e.removeComponent(C1);

    expect(spy1).toHaveBeenCalledTimes(1);
  });

  it('should have component', () => {
    expect(e.has(C1)).toBeFalsy();
    e.addComponent(c1);
    expect(e.has(C1)).toBeTruthy();
  });

  it('should not have component', () => {
    expect(e.has(C1)).toBeFalsy();
    e.addComponent(c1);
    e.removeComponent(C1);
    expect(e.has(C1)).toBeFalsy();
    expect(e.hasNone(C1)).toBeTruthy();
  });

  it('should have all components', () => {
    expect(e.hasAll(C1, C2)).toBeFalsy();
    e.addComponent(c1);
    e.addComponent(c2);
    expect(e.hasAll(C1, C2)).toBeTruthy();
  });

  it('should have any componets', () => {
    expect(e.hasAny(C1, C2)).toBeFalsy();
    e.addComponent(c1);
    expect(e.hasAny(C1, C2)).toBeTruthy();
  });

  it('should not have all components', () => {
    expect(e.hasAll(C1, C2)).toBeFalsy();
    e.addComponent(c1);
    expect(e.hasAll(C1, C2)).toBeFalsy();
  });
});
