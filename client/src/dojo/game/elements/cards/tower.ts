import { Action, ActionType } from "../../types/action";
import { Deck } from "../../types/deck";
import { Resource } from "../../types/resource";
import { Side, SideType } from "../../types/side";
import { CardInterface } from "./interface";

export const Tower: CardInterface = class Tower {
  public static resource(side: Side): Resource {
    return new Resource(0, 0, 0);
  }

  public static score(side: Side): number {
    switch (side.value) {
      case SideType.Two:
        return 1;
      case SideType.Three:
        return 6;
      case SideType.Four:
        return 3;
      default:
        return 0;
    }
  }

  public static upgrade(side: Side): number {
    switch (side.value) {
      case SideType.Two:
        return 1;
      case SideType.Three:
        return 3;
      case SideType.Four:
        return 2;
      default:
        return 0;
    }
  }

  public static update(side: Side, action: Action): Side {
    return new Side(side.update(action));
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
            return [new Resource(1, 1, 0)];
          case SideType.Four:
            return [new Resource(2, 2, 2)];
          default:
            return [];
        }
      case ActionType.Flip:
        switch (side.value) {
          case SideType.Two:
            return [new Resource(1, 1, 1)];
          default:
            return [];
        }
      default:
        return [];
    }
  }

  public static condition(
    side: Side,
    action: Action,
    deck: Deck,
    sides: Side[],
  ): boolean {
    return true;
  }

  public static sides(): Side[] {
    return [
      new Side(SideType.One),
      new Side(SideType.Two),
      new Side(SideType.Three),
      new Side(SideType.Four),
    ];
  }
};
