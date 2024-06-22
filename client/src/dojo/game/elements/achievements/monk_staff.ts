import { AchievementInterface } from "./interface";
import { Deck } from "../../types/deck";
import { Side } from "../../types/side";
import { Card } from "../../types/card";

export const MonkStaff: AchievementInterface = class MonkStaff {
  public static condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
    score: number,
  ): boolean {
    let id = deck.baseCount();
    while (id > 0) {
      let side = sides[id - 1];
      let card = deck.reveal(id);
      let upgrade = card.getUpgrade(side);
      if (upgrade < 2) {
        return false;
      }
      id--;
    }
    return true;
  }

  public static sides(deck: Deck, sides: Side[]): Side[] {
    return sides;
  }

  public static description(): string {
    return "Have all cards set at 2 Upgrades at the end of the game.";
  }

  public static effect(): string {
    return "";
  }
};
