export enum ActionType {
  None = "None",
  Store = "Store",
  Rotate = "Rotate",
  Flip = "Flip",
  Discard = "Discard",
}

export class Action {
  value: ActionType;

  constructor(value: ActionType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(ActionType).indexOf(this.value);
  }

  public static from(index: number): Action {
    const item = Object.values(ActionType)[index];
    return new Action(item);
  }
}
