import { IComponent } from '../../src';

export class C3 implements IComponent {
  public awake(): void {
    /* ... */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_deltaTime: number): void {
    /* ... */
  }
}
