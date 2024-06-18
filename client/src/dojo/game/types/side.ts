import { ActionType } from "./action";

export const SIDE_TYPE_COUNT = 4;

export enum SideType {
  None = "None",
  One = "One",
  Two = "Two",
  Three = "Three",
  Four = "Four",
}

export class Side {
  value: SideType;

  constructor(value: SideType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(SideType).indexOf(this.value);
  }

  public static from(index: number): Side {
    // Special case for when storage is by default 0
    if (index == 0) {
      return new Side(SideType.One);
    }
    const item = Object.values(SideType)[index];
    return new Side(item);
  }

  public getName(): string {
    switch (this.value) {
      case SideType.One:
        return "I";
      case SideType.Two:
        return "II";
      case SideType.Three:
        return "III";
      case SideType.Four:
        return "IV";
      default:
        return "";
    }
  }

  public update(action: ActionType): SideType {
    switch (action) {
      case ActionType.Rotate:
        switch (this.value) {
          case SideType.One:
            return SideType.Two;
          case SideType.Two:
            return SideType.One;
          case SideType.Three:
            return SideType.Four;
          case SideType.Four:
            return SideType.Three;
          default:
            return SideType.None;
        }
      case ActionType.Flip:
        switch (this.value) {
          case SideType.One:
            return SideType.Three;
          case SideType.Two:
            return SideType.Four;
          case SideType.Three:
            return SideType.One;
          case SideType.Four:
            return SideType.Two;
          default:
            return SideType.None;
        }
      default:
        return this.value;
    }
  }
}
