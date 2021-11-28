/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */

import { Entity, IEntity } from '../../src';
import { Query } from '../../src/ecs/Query';
import { C1 } from '../_test_classes/C1';
import { C2 } from '../_test_classes/C2';
import { C3 } from '../_test_classes/C3';
import { EntityManager } from '../../src/ecs/EntityManager';

describe('>>> Query', () => {
  it('should create a new query with a filter', () => {
    const query = new Query((entity: IEntity) => entity.has(C1));
    expect(query).toBeDefined();
    expect(query.getFilter).toBeDefined();
  });

  describe('>>> Query find, filter, foreach', () => {
    let entityManager: EntityManager;

    let e1: IEntity;
    let e2: IEntity;
    let e3: IEntity;
    let e4: IEntity;

    beforeEach(() => {
      entityManager = EntityManager.instance;

      e1 = entityManager.createEntity();
      e2 = entityManager.createEntity();
      e3 = entityManager.createEntity();
      e4 = new Entity(4);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      e2.addComponent(new C2());
      e3.addComponent(new C2());
      e4.addComponent(new C2());

      e3.addComponent(new C3());
      e4.addComponent(new C3());
    });

    afterEach(() => {
      // remove all entities
      for (const entity of entityManager.entities) {
        entityManager.removeEntity(entity.id);
      }
    });

    describe('>>> Query filter', () => {
      it('should find entitie with a filter', () => {
        const query = new Query((entity: IEntity) => entity.has(C1));
        const entitie = query.find(entityManager.entities);

        expect(entitie).toBeDefined();
        // will always just return first found entity
        expect(entitie?.id).toBe(1);
      });
    });

    describe('>>> Query filter', () => {
      it('should filter all entities with a componet C1', () => {
        const query = new Query((entity: IEntity) => entity.has(C1));
        const entities = query.filter(entityManager.entities);

        expect(entities).toBeDefined();
        expect(entities.length).toBe(3);

        expect(query.matchesNone(entities)).toBe(false);
        expect(query.matchesAll(entities)).toBe(true);
        expect(query.matchesAllExcept(entities, e4)).toBe(true);
      });

      it('should filter all entities with all componets C1 and C2', () => {
        const query = new Query((entity: IEntity) => entity.hasAll(C1, C2));
        const entities = query.filter(entityManager.entities);

        expect(entities).toBeDefined();
        expect(entities.length).toBe(2);

        expect(query.matchesNone(entities)).toBe(false);
        expect(query.matchesAll(entities)).toBe(true);
        expect(query.matchesAllExcept(entities, e4)).toBe(true);
      });

      it('should filter all entities with all componets C1 and C2 and C3', () => {
        const query = new Query((entity: IEntity) => entity.hasAll(C1, C2, C3));
        const entities = query.filter(entityManager.entities);

        expect(entities).toBeDefined();
        expect(entities.length).toBe(1);

        expect(query.matchesNone(entities)).toBe(false);
        expect(query.matchesAll(entities)).toBe(true);
        expect(query.matchesAllExcept(entities, e4)).toBe(true);
      });

      it('should fiter any entities with a componet C1', () => {
        const query = new Query((entity: IEntity) => entity.hasAny(C1, C2));
        const entities = query.filter(entityManager.entities);

        expect(entities).toBeDefined();
        expect(entities.length).toBe(3);

        expect(query.matchesNone(entities)).toBe(false);
        expect(query.matchesAll(entities)).toBe(true);
        expect(query.matchesAllExcept(entities, e4)).toBe(true);
      });
    });

    describe('>>> Query map', () => {
      it('should map all entities with a componet C1', () => {
        const query = new Query((entity: IEntity) => entity.has(C1));
        const entities = query.map(entityManager.entities, (entity: IEntity) => entity);

        expect(entities).toBeDefined();
        expect(entities.length).toBe(3);

        expect(query.matchesNone(entities)).toBe(false);
        expect(query.matchesAll(entities)).toBe(true);
        expect(query.matchesAllExcept(entities, e4)).toBe(true);
      });

      it('should map to add component C3 to all entities missing C3 component', () => {
        const beforeQuery = new Query((entity: IEntity) => entity.has(C3));
        const beforeFilter = beforeQuery.filter(entityManager.entities);

        expect(beforeFilter).toBeDefined();
        expect(beforeFilter.length).toBe(1);

        const beforeEntities = beforeQuery.map(beforeFilter, (entity: IEntity) => entity);

        expect(beforeEntities).toBeDefined();
        expect(beforeEntities.length).toBe(1);

        const updateQuery = new Query((entity: IEntity) => entity.hasNone(C3));
        const updateFilter = updateQuery.filter(entityManager.entities);

        expect(updateFilter).toBeDefined();
        expect(updateFilter.length).toBe(2);

        const updateEntities = updateQuery.map(updateFilter, (entity: IEntity) => entity.add(new C3()));

        expect(updateEntities).toBeDefined();
        expect(updateEntities.length).toBe(2);

        const afterQuery = new Query((entity: IEntity) => entity.has(C3));
        const afterFilter = afterQuery.filter(entityManager.entities);

        expect(afterFilter).toBeDefined();
        expect(afterFilter.length).toBe(beforeEntities.length + updateEntities.length);

        const afterEntities = afterQuery.map(afterFilter, (entity: IEntity) => entity);

        expect(afterEntities).toBeDefined();
        expect(afterEntities.length).toBe(beforeEntities.length + updateEntities.length);
      });

      it('should map to remove component C3 from all entities with a C3 componet', () => {
        const beforeQuery = new Query((entity: IEntity) => entity.has(C3));
        const beforeFilter = beforeQuery.filter(entityManager.entities);

        expect(beforeFilter).toBeDefined();
        expect(beforeFilter.length).toBe(1);

        const beforeEntities = beforeQuery.map(beforeFilter, (entity: IEntity) => entity);

        expect(beforeEntities).toBeDefined();
        expect(beforeEntities.length).toBe(1);

        const updateQuery = new Query((entity: IEntity) => entity.has(C3));
        const updateFilter = updateQuery.filter(entityManager.entities);

        expect(updateFilter).toBeDefined();
        expect(updateFilter.length).toBe(1);

        const updateEntities = updateQuery.map(updateFilter, (entity: IEntity) => entity.remove(C3));

        expect(updateEntities).toBeDefined();
        expect(updateEntities.length).toBe(1);

        const afterQuery = new Query((entity: IEntity) => entity.has(C3));
        const afterFilter = afterQuery.filter(entityManager.entities);

        expect(afterFilter).toBeDefined();
        expect(afterFilter.length).toBe(beforeEntities.length - updateEntities.length);

        const afterEntities = afterQuery.map(afterFilter, (entity: IEntity) => entity);

        expect(afterEntities).toBeDefined();
        expect(afterEntities.length).toBe(beforeEntities.length - updateEntities.length);
      });
    });

    describe('>>> Query foreach', () => {
      it('should iterate over all entities', () => {
        const query = new Query((entity: IEntity) => entity.has(C1));
        const entities = query.filter(entityManager.entities);

        let count = 0;
        query.foreach(entities, (entity: IEntity) => {
          count++;
        });

        expect(count).toBe(3);
      });

      it('should iterate over all entities with a componet C1', () => {
        const query = new Query((entity: IEntity) => entity.has(C1));
        const entities = query.filter(entityManager.entities);

        let count = 0;
        query.foreach(entities, (entity: IEntity) => {
          count++;
        });

        expect(count).toBe(3);
      });

      it('should iterate over all entities with all componet C1 and C2', () => {
        const query = new Query((entity: IEntity) => entity.hasAll(C1, C2));
        const entities = query.filter(entityManager.entities);

        let count = 0;
        query.foreach(entities, (entity: IEntity) => {
          count++;
        });

        expect(count).toBe(2);
      });

      it('should iterate over all entities with all componet C1 and C2 and C3', () => {
        const query = new Query((entity: IEntity) => entity.hasAll(C1, C2, C3));
        const entities = query.filter(entityManager.entities);

        let count = 0;
        query.foreach(entities, (entity: IEntity) => {
          count++;
        });

        expect(count).toBe(1);
      });

      it('should iterate over any entities with a componet C1 or C2 or C3', () => {
        const query = new Query((entity: IEntity) => entity.hasAny(C1, C2, C3));
        const entities = query.filter(entityManager.entities);

        let count = 0;
        query.foreach(entities, (entity: IEntity) => {
          count++;
        });

        expect(count).toBe(3);
      });

      it('should iterate over any entities with a componet C1', () => {
        const query = new Query((entity: IEntity) => entity.hasAny(C1, C2));
        const entities = query.filter(entityManager.entities);

        let count = 0;
        query.foreach(entities, (entity: IEntity) => {
          count++;
        });

        expect(count).toBe(3);
      });

      it('should iterate over any entities with a componet C2 or C3', () => {
        const query = new Query((entity: IEntity) => entity.hasAny(C2, C3));
        const entities = query.filter(entityManager.entities);

        let count = 0;
        query.foreach(entities, (entity: IEntity) => {
          count++;
        });

        expect(count).toBe(2);
      });
    });
  });

  describe('>>> Query match', () => {
    it('should match entities', () => {
      const e = new Entity(1);
      e.addComponent(new C1());
      const query = new Query((entity: IEntity) => entity.has(C1));
      expect(query.matches(e)).toBeTruthy();
    });

    it('should not match entities', () => {
      const e = new Entity(1);
      e.addComponent(new C1());
      const query = new Query((entity: IEntity) => entity.has(C2));
      expect(query.matches(e)).toBeFalsy();
    });

    it('should match all entities', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C1));
      expect(query.matchesAll([e1])).toBeTruthy();
      expect(query.matchesAll([e1, e2])).toBeTruthy();
      expect(query.matchesAll([e1, e2, e3])).toBeTruthy();
      expect(query.matchesAll([e2])).toBeTruthy();
      expect(query.matchesAll([e2, e3])).toBeTruthy();
      expect(query.matchesAll([e3])).toBeTruthy();
    });

    it('should not match all entities', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C2));
      expect(query.matchesAll([e1])).toBeFalsy();
      expect(query.matchesAll([e1, e2])).toBeFalsy();
      expect(query.matchesAll([e1, e2, e3])).toBeFalsy();
      expect(query.matchesAll([e2])).toBeFalsy();
      expect(query.matchesAll([e2, e3])).toBeFalsy();
      expect(query.matchesAll([e3])).toBeFalsy();
    });

    it('should match any entities', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C1));
      expect(query.matchesAny([e1])).toBeTruthy();
      expect(query.matchesAny([e1, e2])).toBeTruthy();
      expect(query.matchesAny([e1, e2, e3])).toBeTruthy();
      expect(query.matchesAny([e2])).toBeTruthy();
      expect(query.matchesAny([e2, e3])).toBeTruthy();
      expect(query.matchesAny([e3])).toBeTruthy();
    });

    it('should not match any entities', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C2));
      expect(query.matchesAny([e1])).toBeFalsy();
      expect(query.matchesAny([e1, e2])).toBeFalsy();
      expect(query.matchesAny([e1, e2, e3])).toBeFalsy();
      expect(query.matchesAny([e2])).toBeFalsy();
      expect(query.matchesAny([e2, e3])).toBeFalsy();
      expect(query.matchesAny([e3])).toBeFalsy();
    });

    it('should match none entities', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C2));
      expect(query.matchesNone([e1, e2, e3])).toBeTruthy();
      expect(query.matchesNone([e1])).toBeTruthy();
      expect(query.matchesNone([e1, e2])).toBeTruthy();
      expect(query.matchesNone([e1, e2, e3])).toBeTruthy();
      expect(query.matchesNone([e2])).toBeTruthy();
      expect(query.matchesNone([e2, e3])).toBeTruthy();
      expect(query.matchesNone([e3])).toBeTruthy();
    });

    it('should not match none entities', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C1));
      expect(query.matchesNone([e1, e2, e3])).toBeFalsy();
      expect(query.matchesNone([e1])).toBeFalsy();
      expect(query.matchesNone([e1, e2])).toBeFalsy();
      expect(query.matchesNone([e1, e2, e3])).toBeFalsy();
      expect(query.matchesNone([e2])).toBeFalsy();
      expect(query.matchesNone([e2, e3])).toBeFalsy();
      expect(query.matchesNone([e3])).toBeFalsy();
    });

    it('should match one entity', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C1));
      expect(query.matchesOne([e1, e2, e3])).toBeTruthy();
      expect(query.matchesOne([e1])).toBeTruthy();
      expect(query.matchesOne([e1, e2])).toBeTruthy();
      expect(query.matchesOne([e1, e2, e3])).toBeTruthy();
      expect(query.matchesOne([e2])).toBeTruthy();
      expect(query.matchesOne([e2, e3])).toBeTruthy();
      expect(query.matchesOne([e3])).toBeTruthy();
    });

    it('should not match one entity', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C2));
      expect(query.matchesOne([e1, e2, e3])).toBeFalsy();
      expect(query.matchesOne([e1])).toBeFalsy();
      expect(query.matchesOne([e1, e2])).toBeFalsy();
      expect(query.matchesOne([e1, e2, e3])).toBeFalsy();
      expect(query.matchesOne([e2])).toBeFalsy();
      expect(query.matchesOne([e2, e3])).toBeFalsy();
      expect(query.matchesOne([e3])).toBeFalsy();
    });

    it('should match all except entity', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C1));
      expect(query.matchesAllExcept([e1, e3], e2)).toBeTruthy();
      expect(query.matchesAllExcept([e1, e2, e3], e3)).toBeFalsy();
    });

    it('should match any except entity', () => {
      const e1 = new Entity(1);
      const e2 = new Entity(2);
      const e3 = new Entity(3);

      e1.addComponent(new C1());
      e2.addComponent(new C1());
      e3.addComponent(new C1());

      const query = new Query((entity: IEntity) => entity.has(C1));
      expect(query.matchesAnyExcept([e1, e3], e2)).toBeTruthy();
      expect(query.matchesAnyExcept([e1, e2, e3], e2)).toBeTruthy();
      expect(query.matchesAnyExcept([], e3)).toBeFalsy();
    });
  });
});
