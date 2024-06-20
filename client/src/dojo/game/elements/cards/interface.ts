import { Action } from "../../types/action";
import { Deck } from "../../types/deck";
import { Resource } from "../../types/resource";
import { Side } from "../../types/side";

export interface CardInterface {
  resource(side: Side): Resource;
  score(side: Side): number;
  upgrade(side: Side): number;
  update(side: Side, action: Action): Side;
  can(side: Side, action: Action): boolean;
  cost(side: Side, action: Action): Resource[];
  condition(side: Side, action: Action, deck: Deck, sides: Side[]): boolean;
  sides(): Side[];
}
