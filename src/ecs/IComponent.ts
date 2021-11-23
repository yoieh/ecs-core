import { IAwake, IUpdate } from '..';
import { IEntity } from '../../';

export interface IComponent extends IAwake, IUpdate {
  entity: IEntity | null;
}

export default IComponent;
