import { TConstr } from '..';
import { IComponent } from '../../';

export interface IEntity {
  id: number;
  components: IComponent[];
  addComponent(component: IComponent): void;
  getComponent<C extends IComponent>(constr: TConstr<C>): C;
  removeComponent<C extends IComponent>(constr: TConstr<C>): void;
  hasComponent<C extends IComponent>(constr: TConstr<C>): boolean;
}
