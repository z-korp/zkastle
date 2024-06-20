import { AchievementInterface } from "./interface";
import { Deck } from "../../types/deck";
import { Side } from "../../types/side";
import { Card, CardType } from "../../types/card";

export const ShrineOfValor: AchievementInterface = class ShrineOfValor {
  public static condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
    score: number,
  ): boolean {
    if (score < 30) {
      return false;
    }
    const ids: number[] = deck.ids(CardType.Monastery);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const index = id - 1;
      const side = sides[index];
      const card = deck.reveal(id);
      const upgrade = card.getUpgrade(side);
      if (upgrade < 3) {
        return false;
      }
    }
    return true;
  }

  public static sides(deck: Deck, sides: Side[]): Side[] {
    return sides;
  }

  public static description(): string {
    return "Have 30 points or more and 3 upgrades on all monasteries in the deck.";
  }
};
