/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityManager } from './EntityManager';
import { Engine } from '../engine/Engine';

export abstract class BaseSystem {
  entityManager: EntityManager = EntityManager.instance;

  public enabled = true;

  public onCreate(deltaTime: number) {}

  public onUpdate(deltaTime: number) {}

  public onDestroy(deltaTime: number) {}

  public onRender(deltaTime: number) {}
}
