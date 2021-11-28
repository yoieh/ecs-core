import { SignalListener } from '@yoieh/signal';
import { EntityManager } from '../../src/ecs/EntityManager';

describe('>>> EntityManager', () => {
  let entityManager: EntityManager;

  beforeEach(() => {
    entityManager = EntityManager.instance;

    // remove all entities
    for (const entity of entityManager.entities) {
      entityManager.removeEntity(entity.id);
    }
  });

  it("should create an instance of 'EntityManager'", () => {
    expect(entityManager).toBeInstanceOf(EntityManager);
  });

  it('should create an instance of "Entity" with id', () => {
    const entity = entityManager.createEntity();
    expect(entity.id).toBe(1);
  });

  it('should auto increment id', () => {
    const lastID = entityManager.entityId;

    const entity1 = entityManager.createEntity();
    const entity2 = entityManager.createEntity();

    expect(entity1.id).toBe(lastID + 1);
    expect(entity2.id).toBe(lastID + 2);
  });

  it("should add an instance of 'Entity' to 'EntityManager'", () => {
    const spy1 = jest.fn();
    new SignalListener(entityManager.onEntityAdded, spy1);

    entityManager.createEntity();

    expect(entityManager.entities.length).toBe(1);
    expect(spy1).toHaveBeenCalledTimes(1);
  });

  it("should remove an instance of 'Entity' from 'EntityManager'", () => {
    const spy1 = jest.fn();
    new SignalListener(entityManager.onEntityAdded, spy1);

    const entity = entityManager.createEntity();

    entityManager.removeEntity(entity.id);
    expect(entityManager.entities.length).toBe(0);
    expect(spy1).toHaveBeenCalledTimes(1);
  });
});
