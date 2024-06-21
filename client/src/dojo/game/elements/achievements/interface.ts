import { Card } from "../../types/card";
import { Deck } from "../../types/deck";
import { Side } from "../../types/side";

export interface AchievementInterface {
  condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
    score: number,
  ): boolean;
  sides(deck: Deck, sides: Side[]): Side[];
  description(): string;
  effect(): string;
}
