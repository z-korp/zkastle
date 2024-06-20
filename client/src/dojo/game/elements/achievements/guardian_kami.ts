import { AchievementInterface } from "./interface";
import { Deck } from "../../types/deck";
import { Side } from "../../types/side";
import { Card } from "../../types/card";

export const GuardianKami: AchievementInterface = class GuardianKami {
  public static condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
    score: number,
  ): boolean {
    return score >= 30;
  }

  public static sides(deck: Deck, sides: Side[]): Side[] {
    return sides;
  }

  public static description(): string {
    return "Have 30 points or more at the end of the game.";
  }
};
