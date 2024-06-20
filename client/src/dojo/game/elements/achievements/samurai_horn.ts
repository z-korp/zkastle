import { AchievementInterface } from "./interface";
import { Deck } from "../../types/deck";
import { Side } from "../../types/side";
import { Card, CardType } from "../../types/card";

export const SamuraiHorn: AchievementInterface = class SamuraiHorn {
  public static condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
    score: number,
  ): boolean {
    if (score < 32) {
      return false;
    }
    const taverns: number[] = deck.ids(CardType.Tavern);
    for (let i = 0; i < taverns.length; i++) {
      const id = taverns[i];
      const index = id - 1;
      const side = sides[index];
      const card = deck.reveal(id);
      const upgrade = card.getUpgrade(side);
      if (upgrade < 2) {
        return false;
      }
    }
    const citadels: number[] = deck.ids(CardType.Citadel);
    for (let i = 0; i < citadels.length; i++) {
      const id = citadels[i];
      const index = id - 1;
      const side = sides[index];
      const card = deck.reveal(id);
      const upgrade = card.getUpgrade(side);
      if (upgrade < 2) {
        return false;
      }
    }
    return true;
  }

  public static sides(deck: Deck, sides: Side[]): Side[] {
    return sides;
  }

  public static description(): string {
    return "Have 32 points or more and 2 upgrades on all taverns and citadels in the deck.";
  }
};
