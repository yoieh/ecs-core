import { BaseSystem } from '../ecs/BaseSystem';
import { IUpdate } from '../lifecycle/IUpdate';
import { EntityManager } from '../ecs/EntityManager';
import { Signal } from '@yoieh/signal';

export class Engine implements IUpdate {
  public onSystemAdded = new Signal();

  public onSystemRemoved = new Signal();

  private _lastDeltaTime = 0;

  public get lastDeltaTime() {
    return this._lastDeltaTime;
  }

  private static _instance: Engine;
  public static get instance(): Engine {
    if (!Engine._instance) {
      Engine._instance = new Engine();
    }
    return Engine._instance;
  }

  public systems: BaseSystem[] = [];

  public entityManager: EntityManager = EntityManager.instance;

  public update(deltaTime: number): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const system of this.systems) {
      if (system.enabled) {
        system.onUpdate(deltaTime);
      }
    }

    this._lastDeltaTime = deltaTime;
  }

  public registerSystem(system: BaseSystem): void {
    system.onCreate(this._lastDeltaTime);
    this.systems.push(system);
    this.onSystemAdded.dispatch(system);
  }

  public unregisterSystem(system: BaseSystem): void {
    this.systems = this.systems.filter((s) => s !== system);
    this.onSystemRemoved.dispatch(system);
    system.onDestroy(this._lastDeltaTime);
  }
}

export default Engine;
