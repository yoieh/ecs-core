import { IAwake, IEntity, IUpdate } from '..';

export interface IComponent extends IAwake, IUpdate {
  entity: IEntity | null;
}

export default IComponent;
