import { Action, ActionType } from "../../types/action";
import { Deck } from "../../types/deck";
import { Resource } from "../../types/resource";
import { Side, SideType } from "../../types/side";
import { CardInterface } from "./interface";

export const ShrineOfValor: CardInterface = class ShrineOfValor {
  public static resource(side: Side): Resource {
    switch (side.value) {
      case SideType.One:
        return new Resource(1, 1, 1);
      default:
        return new Resource(1, 1, 1);
    }
  }

  public static score(side: Side): number {
    return 0;
  }

  public static upgrade(side: Side): number {
    return 0;
  }

  public static update(side: Side, action: Action): Side {
    switch (action.value) {
      case ActionType.Store:
        return new Side(SideType.None);
      default:
        return new Side(side.update(action));
    }
  }

  public static can(side: Side, action: Action): boolean {
    switch (action.value) {
      case ActionType.Store:
        switch (side.value) {
          case SideType.One:
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
    return [];
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
    return [new Side(SideType.One)];
  }
};
