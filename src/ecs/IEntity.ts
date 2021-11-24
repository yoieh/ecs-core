import { TConstr, IComponent } from '..';

export interface IEntity {
  id: number;
  components: IComponent[];
  addComponent(component: IComponent): void;
  getComponent<C extends IComponent>(constr: TConstr<C>): C;
  removeComponent<C extends IComponent>(constr: TConstr<C>): void;
  has<C extends IComponent>(constr: TConstr<C>): boolean;
}
