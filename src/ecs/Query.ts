import { IEntity } from '..';
import { EntityManager } from '..';

export type QueryFilter = (entity: IEntity) => boolean;

export class Query {
  private readonly _filter: QueryFilter;

  public get getFilter(): QueryFilter {
    return this._filter;
  }

  private readonly _entityManager: EntityManager;

  constructor(filter: QueryFilter, entityManager: EntityManager = EntityManager.instance) {
    this._filter = filter;
    this._entityManager = entityManager;
  }

  public find(entities: IEntity[]): IEntity | undefined {
    return entities.find(this._filter);
  }

  public filter(entities: IEntity[] = this._entityManager.entities): IEntity[] {
    return entities.filter(this._filter);
  }

  public map(callback: (entity: IEntity) => IEntity, entities: IEntity[] = this.filter()): IEntity[] {
    return entities.map((entity) => {
      return callback(entity);
    });
  }

  public foreach(callback: (entity: IEntity) => void, entities: IEntity[] = this.filter()): void {
    entities.forEach((entity) => {
      if (this._filter(entity)) {
        callback(entity);
      }
    });
  }

  public matches(entity: IEntity): boolean {
    return this._filter(entity);
  }

  public matchesAll(entities: IEntity[]): boolean {
    return entities.every(this._filter);
  }

  public matchesAny(entities: IEntity[]): boolean {
    return entities.some(this._filter);
  }

  public matchesNone(entities: IEntity[]): boolean {
    return entities.every((entity) => !this._filter(entity));
  }

  public matchesOne(entities: IEntity[]): boolean {
    return entities.some((entity) => this._filter(entity));
  }

  public matchesAllExcept(entities: IEntity[], except: IEntity): boolean {
    return entities.every((entity) => entity !== except || !this._filter(entity));
  }

  public matchesAnyExcept(entities: IEntity[], except: IEntity): boolean {
    return entities.some((entity) => entity !== except || this._filter(entity));
  }
}
