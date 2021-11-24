import { TConstr, IComponent } from '..';
import { Signal } from '@yoieh/signal';

export interface IEntity {
  id: number;
  components: IComponent[];
  get<C extends IComponent>(constr: TConstr<C>): C;
  onComponentAdded: Signal<(entity: IEntity, component: IComponent) => void>;
  add<C extends IComponent>(component: C): this;
  addComponent(component: IComponent): void;
  onComponentRemoved: Signal<(args: IComponent) => void>;
  remove<C extends IComponent>(constr: TConstr<C>): this;
  removeComponent<C extends IComponent>(constr: TConstr<C>): void;
  has<C extends IComponent>(constr: TConstr<C>): boolean;
  hasAll<C extends IComponent>(...constrs: TConstr<C>[]): boolean;
  hasAny<C extends IComponent>(...constrs: TConstr<C>[]): boolean;
  hasNone<C extends IComponent>(...constrs: TConstr<C>[]): boolean;
}
