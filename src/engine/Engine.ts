import { BaseSystem } from '../ecs/BaseSystem';
import { IUpdate } from '../lifecycle/IUpdate';
import { EntityManager } from '../ecs/EntityManager';

export class Engine implements IUpdate {
  private stopUpdate = false;

  private static _instance: Engine;
  public static get instance(): Engine {
    if (!Engine._instance) {
      Engine._instance = new Engine();
    }
    return Engine._instance;
  }

  private lastTimestamp = 0;

  public systems: BaseSystem[] = [];

  public entityManager: EntityManager = EntityManager.instance;

  public constructor() {
    // eslint-disable-next-line no-console
    console.log('Engine created');
  }

  public update(deltaTime: number): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const system of this.systems) {
      if (system.enabled) {
        system.onUpdate(deltaTime);
      }
    }
  }

  public registerSystem(system: BaseSystem): void {
    // eslint-disable-next-line no-console
    console.log(`Register: ${system.constructor.name}`);
    this.systems.push(system);
  }

  public unregisterSystem(system: BaseSystem): void {
    // eslint-disable-next-line no-console
    console.log(`Unregister: ${system.constructor.name}`);
    this.systems = this.systems.filter((s) => s !== system);
  }
}

export default Engine;
