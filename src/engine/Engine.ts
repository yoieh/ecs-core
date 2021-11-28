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

  public systemsToDestroy: BaseSystem[] = [];

  public entityManager: EntityManager = EntityManager.instance;

  public tick(deltaTime: number): void {
    this._lastDeltaTime = deltaTime;

    this.update(deltaTime);

    this.cleanUp();
  }

  public update(deltaTime: number): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const system of this.systems) {
      if (system.enabled) {
        system.onUpdate(deltaTime);
      }
    }
  }

  public cleanUp(): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const system of this.systemsToDestroy) {
      system.onDestroy(this._lastDeltaTime);
      this.systems = this.systems.filter((s) => s !== system);
    }

    this.systemsToDestroy = [];
  }

  public createSystem(system: new (...args: any[]) => BaseSystem) {
    const newSystem = new system();
    newSystem.onCreate(this._lastDeltaTime);
    this.registerSystem(newSystem);
    return newSystem;
  }

  public registerSystem(system: BaseSystem): void {
    this.systems.push(system);
    this.onSystemAdded.dispatch(system);
  }

  public unregisterSystem(system: BaseSystem): void {
    this.systemsToDestroy.push(system);
    this.onSystemRemoved.dispatch(system);
  }
}

export default Engine;
