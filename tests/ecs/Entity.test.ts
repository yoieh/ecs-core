/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

import { Entity, IComponent, IEntity } from '../../src';

class E extends Entity implements IEntity {}
class C1 implements IComponent {
  public entity: E = new E(1);

  public awake(): void {
    /* ... */
  }

  public update(_deltaTime: number): void {
    /* ... */
  }
}
class C2 implements IComponent {
  public entity: E = new E(2);

  public awake(): void {
    /* ... */
  }

  public update(_deltaTime: number): void {
    /* ... */
  }
}
class C3 implements IComponent {
  public entity: E = new E(3);

  public awake(): void {
    /* ... */
  }

  public update(_deltaTime: number): void {
    /* ... */
  }
}

describe('>>> Entity', () => {
  let e: E;
  const c1 = new C1();
  const c2 = new C2();
  const c3 = new C3();

  beforeEach(() => {
    e = new E(4);
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

  it('should have component', () => {
    expect(e.has(C1)).toBeFalsy();
    e.addComponent(c1);
    expect(e.has(C1)).toBeTruthy();
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
