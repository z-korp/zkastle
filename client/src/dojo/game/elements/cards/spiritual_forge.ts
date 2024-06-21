import { Action, ActionType } from "../../types/action";
import { CardType } from "../../types/card";
import { Deck } from "../../types/deck";
import { Resource } from "../../types/resource";
import { Side, SideType } from "../../types/side";
import { CardInterface } from "./interface";
import { Tower } from "./tower";

const MESSAGE = "Towers at III";

export const SpiritualForge: CardInterface = class SpiritualForge {
  public static resource(side: Side): Resource {
    return new Resource(0, 0, 0);
  }

  public static score(side: Side): number {
    switch (side.value) {
      case SideType.Three:
        return 1;
      case SideType.Four:
        return 5;
      default:
        return 0;
    }
  }

  public static upgrade(side: Side): number {
    return 0;
  }

  public static update(side: Side, action: Action): Side {
    return new Side(side.update(action));
  }

  public static can(side: Side, action: Action): boolean {
    switch (action.value) {
      case ActionType.Rotate:
        switch (side.value) {
          case SideType.Three:
            return true;
          default:
            return false;
        }
      case ActionType.Flip:
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
    switch (action.value) {
      case ActionType.Flip:
        switch (side.value) {
          case SideType.One:
            return [new Resource(0, 0, 0, MESSAGE)];
          default:
            return [];
        }
      case ActionType.Rotate:
        switch (side.value) {
          case SideType.Three:
            return [new Resource(3, 3, 3)];
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
    switch (action.value) {
      case ActionType.Flip:
        switch (side.value) {
          case SideType.One:
            let ids: number[] = deck.ids(CardType.Tower);
            for (let id of ids) {
              let index: number = id - 1;
              let side: Side = sides[index];
              if (Tower.upgrade(side) < 3) {
                return false;
              }
            }
            return true;
          default:
            return true;
        }
      default:
        return true;
    }
  }

  public static sides(): Side[] {
    return [
      new Side(SideType.One),
      new Side(SideType.Three),
      new Side(SideType.Four),
    ];
  }
};
