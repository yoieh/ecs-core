import { IComponent, IEntity, TConstr } from '..';

export class Entity implements IEntity {
  id: number;

  protected _components: IComponent[] = [];

  get components(): IComponent[] {
    return this._components;
  }

  constructor(entityId: number) {
    this.id = entityId;
    this._components = [];
  }

  public addComponent(component: IComponent) {
    this.components.push(component);
  }

  public removeComponent<C extends IComponent>(constr: TConstr<C>): void {
    this._components = this.components.filter((c) => !(c instanceof constr));
  }

  public getComponent<C extends IComponent>(constr: TConstr<C>): C {
    const component = this.components.find((c) => c instanceof constr);

    if (component) {
      return component as C;
    }

    throw new Error(`Component ${constr.name} not found on Entity ${this.constructor.name}`);
  }

  public hasComponent<C extends IComponent>(constr: TConstr<C>): boolean {
    return this.components.find((c) => c instanceof constr) !== undefined;
  }
}

export default Entity;
