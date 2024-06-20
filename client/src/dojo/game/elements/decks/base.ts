import { CardType } from "@/dojo/game/types/card";

export class Base {
  public static count(): number {
    return 25;
  }

  public static baseCount(): number {
    return 16;
  }

  public static achievementCount(): number {
    return 9;
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
      case 17:
        return CardType.OniFang;
      case 18:
        return CardType.ShrineOfValor;
      case 19:
        return CardType.DragonHeart;
      case 20:
        return CardType.GuardianKami;
      case 21:
        return CardType.SpiritualForge;
      case 22:
        return CardType.SamuraiHorn;
      case 23:
        return CardType.OracleStone;
      case 24:
        return CardType.MonkStaff;
      case 25:
        return CardType.ShogunAxe;
      default:
        return CardType.None;
    }
  }

  public static ids(card: CardType): number[] {
    switch (card) {
      case CardType.Farm:
        return [1, 2, 3];
      case CardType.Quarry:
        return [4, 5, 6];
      case CardType.Mine:
        return [7, 8, 9];
      case CardType.Monastery:
        return [10, 11];
      case CardType.Tower:
        return [12, 13];
      case CardType.Forge:
        return [14];
      case CardType.Tavern:
        return [15];
      case CardType.Citadel:
        return [16];
      case CardType.OniFang:
        return [17];
      case CardType.ShrineOfValor:
        return [18];
      case CardType.DragonHeart:
        return [19];
      case CardType.GuardianKami:
        return [20];
      case CardType.SpiritualForge:
        return [21];
      case CardType.SamuraiHorn:
        return [22];
      case CardType.OracleStone:
        return [23];
      case CardType.MonkStaff:
        return [24];
      case CardType.ShogunAxe:
        return [25];
      default:
        return [];
    }
  }
}
