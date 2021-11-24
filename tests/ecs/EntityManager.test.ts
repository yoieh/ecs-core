import { SignalListener } from '@yoieh/signal';
import { Entity } from '../../src';
import { EntityManager } from '../../src/ecs/EntityManager';

class E extends Entity {}

describe('>>> EntityManager', () => {
  let entityManager: EntityManager;

  it("should create an instance of 'EntityManager'", () => {
    entityManager = EntityManager.instance;
    expect(entityManager).toBeInstanceOf(EntityManager);
  });

  it('should create an instance of "Entity" with id', () => {
    const entity = new E(1);
    expect(entity.id).toBe(1);
  });

  it("should add an instance of 'Entity' to 'EntityManager'", () => {
    const entity = new E(1);
    entityManager = EntityManager.instance;
    const spy1 = jest.fn();
    new SignalListener(entityManager.onEntityAdded, spy1);

    entityManager.addEntity(entity);

    expect(entityManager.entities.length).toBe(1);
    expect(spy1).toHaveBeenCalledTimes(1);
  });

  it("should remove an instance of 'Entity' from 'EntityManager'", () => {
    const entity = new E(1);
    entityManager = EntityManager.instance;
    const spy1 = jest.fn();
    new SignalListener(entityManager.onEntityAdded, spy1);

    entityManager.addEntity(entity);
    entityManager.removeEntity(entity.id);
    expect(entityManager.entities.length).toBe(0);
    expect(spy1).toHaveBeenCalledTimes(1);
  });
});
