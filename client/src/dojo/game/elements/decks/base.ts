import { CardType } from "@/dojo/game/types/card";

export class Base {
  public static count(): number {
    return 16;
  }

  public static reveal(id: number): CardType {
    switch (id) {
      case 1:
      case 2:
      case 3:
        return CardType.Farm;
      case 4:
      case 5:
      case 6:
        return CardType.Quarry;
      case 7:
      case 8:
      case 9:
        return CardType.Mine;
      case 10:
      case 11:
        return CardType.Monastery;
      case 12:
      case 13:
        return CardType.Tower;
      case 14:
        return CardType.Forge;
      case 15:
        return CardType.Tavern;
      case 16:
        return CardType.Citadel;
      default:
        return CardType.None;
    }
  }
}
