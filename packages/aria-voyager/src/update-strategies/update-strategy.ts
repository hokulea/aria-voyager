import type { Control } from '#src/controls/control';

export interface UpdateStrategy {
  setControl(control: Control): void;
  dispose?(): void;
}
