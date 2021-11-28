import { Signal } from '@yoieh/signal';
import { Entity, IEntity } from '..';

export class EntityManager {
  public onEntityAdded = new Signal();

  public onEntityRemoved = new Signal();

  private static _instance: EntityManager;
  public static get instance(): EntityManager {
    if (!EntityManager._instance) {
      EntityManager._instance = new EntityManager();
    }
    return EntityManager._instance;
  }

  private _entities: IEntity[];

  get entities() {
    return this._entities;
  }

  public entityId: number;

  constructor() {
    this._entities = [];
    this.entityId = 0;
  }

  getEntity(id: number) {
    return this.entities.find((entity) => entity.id === id);
  }

  getEntities() {
    return this.entities;
  }

  addEntity(entity: IEntity) {
    this.entities.push(entity);
    this.onEntityAdded.dispatch(entity);

    return entity;
  }

  removeEntity(id: number) {
    const entity = this.getEntity(id);
    if (entity) {
      //   entity.remove();
      this._entities = this.entities.filter((e) => e.id !== id);
      this.onEntityRemoved.dispatch(entity);
    }
  }

  createEntity() {
    this.entityId += 1;
    const entity = new Entity(this.entityId);
    this.addEntity(entity);
    return entity;
  }
}
