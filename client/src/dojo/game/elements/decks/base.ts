import { CardType } from "@/dojo/game/types/card";

export class Base {
  public static count(): number {
    return 16;
  }

  public static draw(index: number): CardType {
    const id = index % this.count();
    switch (id) {
      case 0:
      case 1:
      case 2:
        return CardType.Farm;
      case 3:
      case 4:
      case 5:
        return CardType.Quarry;
      case 6:
      case 7:
      case 8:
        return CardType.Mine;
      case 9:
      case 10:
        return CardType.Monastery;
      case 11:
      case 12:
        return CardType.Tower;
      case 13:
        return CardType.Forge;
      case 14:
        return CardType.Tavern;
      case 15:
        return CardType.Citadel;
      default:
        return CardType.None;
    }
  }
}
