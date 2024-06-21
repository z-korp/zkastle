import { AchievementInterface } from "./interface";
import { Deck } from "../../types/deck";
import { Side, SideType } from "../../types/side";
import { Card, CardType } from "../../types/card";

export const OniFang: AchievementInterface = class OniFang {
  public static condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
    score: number,
  ): boolean {
    if (score < 30) {
      return false;
    }
    const ids: number[] = deck.ids(CardType.Farm);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const index = id - 1;
      const side = sides[index];
      const card: Card = deck.reveal(id);
      const upgrade = card.getUpgrade(side);
      if (upgrade < 2) {
        return false;
      }
    }
    return true;
  }

  public static sides(deck: Deck, sides: Side[]): Side[] {
    const id = deck.ids(CardType.Farm).shift();
    const updated_sides: Side[] = sides.slice();
    if (id) {
      const index = id - 1;
      updated_sides[index] = new Side(SideType.Two);
    }
    return updated_sides;
  }

  public static description(): string {
    return "Have 30+ points and all Farms at III at the end of the game.";
  }

  public static effect(): string {
    return "Start the game with one Farm at II";
  }
};
