import { Signal } from '@yoieh/signal';
import { IComponent, IEntity, TConstr } from '..';

export class Entity implements IEntity {
  public onComponentAdded = new Signal();
  public onComponentRemoved = new Signal();

  id: number;

  protected _components: IComponent[] = [];

  get components(): IComponent[] {
    return this._components;
  }

  constructor(entityId: number) {
    this.id = entityId;
    this._components = [];
  }

  public add(component: IComponent) {
    this.addComponent(component);
    return this;
  }

  public addComponent(component: IComponent) {
    // overtides component if already exists
    this._components = [...this.components.filter((c) => c.constructor.name !== component.constructor.name), component];
    this.onComponentAdded.dispatch(this, component);
  }

  public remove<C extends IComponent>(constr: TConstr<C>) {
    this.removeComponent(constr);
    return this;
  }

  public removeComponent<C extends IComponent>(constr: TConstr<C>): void {
    this._components = this.components.filter((c) => !(c instanceof constr));
    this.onComponentRemoved.dispatch(constr);
  }

  public get<C extends IComponent>(constr: TConstr<C>): C {
    const component = this.components.find((c) => c instanceof constr);

    if (component) {
      return component as C;
    }

    throw new Error(`Component ${constr.name} not found on Entity ${this.constructor.name}`);
  }

  public has<C extends IComponent>(constr: TConstr<C>): boolean {
    return this.components.find((c) => c instanceof constr) !== undefined;
  }

  public hasAll(...constrs: TConstr<IComponent>[]): boolean {
    return constrs.every((c) => this.has(c));
  }

  public hasAny(...constrs: TConstr<IComponent>[]): boolean {
    return constrs.some((c) => this.has(c));
  }

  public hasNone(...constrs: TConstr<IComponent>[]): boolean {
    return !this.hasAny(...constrs);
  }
}

export default Entity;
