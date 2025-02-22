import type { Control } from '..';

export interface UpdateStrategy {
  setControl(control: Control): void;
  dispose?(): void;
}
