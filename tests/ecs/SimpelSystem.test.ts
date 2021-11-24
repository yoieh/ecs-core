import { Engine, Entity, EntityManager, IEntity } from '../../src';
import { Query } from '../../src/ecs/Query';
import { SimpelSystem } from '../_test_classes/SimpelSystem';
import { CValue } from '../_test_classes/CValue';

const tick = (times: number) => {
  for (let i = 0; i < times; i++) {
    Engine.instance.update(i);
  }
};

describe('>>> SimpelSystem', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = Engine.instance;
    for (const system of engine.systems) {
      engine.unregisterSystem(system);
    }

    // remove all entities
    for (const entity of engine.entityManager.entities) {
      engine.entityManager.removeEntity(entity.id);
    }
  });

  it('should be able to create a system', () => {
    const system = new SimpelSystem();
    expect(system).toBeInstanceOf(SimpelSystem);
  });

  it('should have been registerd', () => {
    const system = new SimpelSystem();
    expect(engine.systems.length).toBe(1);
  });

  it('should be abel to be unregisterd', () => {
    const system = new SimpelSystem();
    engine.unregisterSystem(system);
    expect(engine.systems.length).toBe(0);
  });

  it('should be able to update', () => {
    const expectedValue = 10;
    const initialValue = 0;

    new SimpelSystem();
    const query = new Query((e: IEntity) => e.has(CValue));

    const valueEntity = new Entity(1);
    valueEntity.add(new CValue(initialValue));

    EntityManager.instance.addEntity(valueEntity);

    const filterdBefore = query.filter(EntityManager.instance.entities);
    expect(filterdBefore.length).toBe(1);

    tick(expectedValue);

    const filterdAfter = query.filter(EntityManager.instance.entities);

    filterdAfter.forEach((entity) => {
      expect(entity.get(CValue).value).not.toBe(0);
      expect(entity.get(CValue).value).toBe(expectedValue);
    });
  });
});
