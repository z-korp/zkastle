import { AchievementInterface } from "./interface";
import { Deck } from "../../types/deck";
import { Side } from "../../types/side";
import { Card } from "../../types/card";

export const DragonHeart: AchievementInterface = class DragonHeart {
  public static condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
    score: number,
  ): boolean {
    if (score < 25) {
      return false;
    }
    let iron = 0;
    stores.forEach(({ card, side }: { card: Card; side: Side }) => {
      iron += card.getResource(side).iron;
    });
    return iron >= 9;
  }

  public static sides(deck: Deck, sides: Side[]): Side[] {
    return sides;
  }
};
