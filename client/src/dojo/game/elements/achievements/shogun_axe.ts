import { AchievementInterface } from "./interface";
import { Deck } from "../../types/deck";
import { Side, SideType } from "../../types/side";
import { Card, CardType } from "../../types/card";

export const ShogunAxe: AchievementInterface = class ShogunAxe {
  public static condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
    score: number,
  ): boolean {
    if (score < 34) {
      return false;
    }
    const ids: number[] = deck.ids(CardType.Quarry);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
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
    const id = deck.ids(CardType.Quarry).shift();
    const updated_sides: Side[] = sides.slice();
    if (id) {
      const index = id - 1;
      updated_sides[index] = new Side(SideType.Two);
    }
    return updated_sides;
  }

  public static description(): string {
    return "Have 34+ points and all Quarries at III or IV at the end of the game.";
  }

  public static effect(): string {
    return "Start the game with one Quarry at II";
  }
};
