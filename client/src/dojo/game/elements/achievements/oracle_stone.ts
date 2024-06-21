import { AchievementInterface } from "./interface";
import { Deck } from "../../types/deck";
import { Side } from "../../types/side";
import { Card } from "../../types/card";

export const OracleStone: AchievementInterface = class OracleStone {
  public static condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
    score: number,
  ): boolean {
    return score >= 40;
  }

  public static sides(deck: Deck, sides: Side[]): Side[] {
    return sides;
  }

  public static description(): string {
    return "Have 40 points or more at the end of the game.";
  }

  public static effect(): string {
    return "Choose the first card of the game.";
  }
};
