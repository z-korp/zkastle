import { Action, ActionType } from "../../types/action";
import { Resource } from "../../types/resource";
import { Side, SideType } from "../../types/side";

export class Monastery {
  public static resource(side: Side): Resource {
    return new Resource(0, 0, 0);
  }

  public static score(side: Side): number {
    switch (side.value) {
      case SideType.Two:
        return 3;
      case SideType.Three:
        return 10;
      case SideType.Four:
        return 6;
      default:
        return 0;
    }
  }

  public static upgrade(side: Side): number {
    return 0;
  }

  public static can(side: Side, action: Action): boolean {
    switch (action.value) {
      case ActionType.Rotate:
        switch (side.value) {
          case SideType.One:
            return true;
          case SideType.Four:
            return true;
          default:
            return false;
        }
      case ActionType.Flip:
        switch (side.value) {
          case SideType.Two:
            return true;
          default:
            return false;
        }
      case ActionType.Discard:
        return true;
      default:
        return false;
    }
  }

  public static cost(side: Side, action: Action): Resource[] {
    switch (action.value) {
      case ActionType.Rotate:
        switch (side.value) {
          case SideType.One:
            return [new Resource(1, 1, 2)];
          case SideType.Four:
            return [new Resource(3, 3, 4)];
          default:
            return [];
        }
      case ActionType.Flip:
        switch (side.value) {
          case SideType.Two:
            return [new Resource(2, 2, 3)];
          default:
            return [];
        }
      default:
        return [];
    }
  }
}
