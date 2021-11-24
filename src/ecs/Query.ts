import { IEntity } from '..';

export type QueryFilter = (entity: IEntity) => boolean;

export class Query {
  private readonly _filter: QueryFilter;

  public get getFilter(): QueryFilter {
    return this._filter;
  }

  private readonly _options: { [key: string]: any };

  public get options(): { [key: string]: any } {
    return this._options;
  }

  constructor(filter: QueryFilter, options: { [key: string]: any } = {}) {
    this._filter = filter;
    this._options = options;
  }

  public find(entities: IEntity[]): IEntity | undefined {
    return entities.find(this._filter);
  }

  public filter(entities: IEntity[]): IEntity[] {
    return entities.filter(this._filter);
  }

  public map(entities: IEntity[], callback: (entity: IEntity) => IEntity): IEntity[] {
    return entities.map((entity) => {
      return callback(entity);
    });
  }

  public foreach(entities: IEntity[], callback: (entity: IEntity) => void): void {
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
