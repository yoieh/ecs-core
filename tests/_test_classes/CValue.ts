import { IComponent } from '../../src';

export class CValue implements IComponent {
  public value: number;

  constructor(value: number) {
    this.value = value;
  }
}
