import { Action } from "../../types/action";
import { Deck } from "../../types/deck";
import { Resource } from "../../types/resource";
import { Side, SideType } from "../../types/side";
import { CardInterface } from "./interface";

export const OracleStone: CardInterface = class OracleStone {
  public static resource(side: Side): Resource {
    return new Resource(0, 0, 0);
  }

  public static score(side: Side): number {
    return 0;
  }

  public static upgrade(side: Side): number {
    return 0;
  }

  public static update(side: Side, action: Action): Side {
    return new Side(side.update(action));
  }

  public static can(side: Side, action: Action): boolean {
    return false;
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
    return [new Side(SideType.None)];
  }
};
