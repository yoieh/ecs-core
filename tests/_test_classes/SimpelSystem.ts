import { BaseSystem, IEntity } from '../../src';
import { Query } from '../../src/ecs/Query';
import { CValue } from './CValue';

export class SimpelSystem extends BaseSystem {
  public q!: Query;

  public constructor() {
    super();
  }

  public onCreate(delta: number): void {
    this.q = new Query((entity: IEntity) => entity.has(CValue));
  }

  public onUpdate(delta: number): void {
    const entities = this.q.filter(this.entityManager.entities);

    this.q.foreach((entity: IEntity) => {
      const cValue = entity.get(CValue);
      cValue.value = delta + 1;
    }, entities);
  }
}
