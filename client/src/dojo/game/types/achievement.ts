import { Card, CardType } from "./card";
import { Deck } from "./deck";
import { Side } from "./side";
import { OniFang } from "../elements/achievements/oni_fang";
import { ShrineOfValor } from "../elements/achievements/shrine_of_valor";
import { DragonHeart } from "../elements/achievements/dragon_heart";
import { GuardianKami } from "../elements/achievements/guardian_kami";
import { SpiritualForge } from "../elements/achievements/spiritual_forge";
import { SamuraiHorn } from "../elements/achievements/samurai_horn";
import { OracleStone } from "../elements/achievements/oracle_stone";
import { MonkStaff } from "../elements/achievements/monk_staff";
import { ShogunAxe } from "../elements/achievements/shogun_axe";
import { CardDetail } from "../models/game";

export enum AchievementType {
  None = "None",
  OniFang = "Oni Fang",
  ShrineOfValor = "Shrine Of Valor",
  DragonHeart = "Dragon Heart",
  GuardianKami = "Guardian Kami",
  SpiritualForge = "Spiritual Forge",
  SamuraiHorn = "Samurai Horn",
  OracleStone = "Oracle Stone",
  MonkStaff = "Monk Staff",
  ShogunAxe = "Shogun Axe",
}

export class Achievement {
  value: AchievementType;

  constructor(value: AchievementType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(AchievementType).indexOf(this.value);
  }

  public static from(index: number): Achievement {
    const item = Object.values(AchievementType)[index];
    return new Achievement(item);
  }

  public static getAchievements(): Achievement[] {
    return [
      new Achievement(AchievementType.OniFang),
      new Achievement(AchievementType.ShrineOfValor),
      new Achievement(AchievementType.DragonHeart),
      new Achievement(AchievementType.GuardianKami),
      new Achievement(AchievementType.SpiritualForge),
      new Achievement(AchievementType.SamuraiHorn),
      new Achievement(AchievementType.OracleStone),
      new Achievement(AchievementType.MonkStaff),
      new Achievement(AchievementType.ShogunAxe),
    ];
  }

  public getCard(): Card {
    const card = Card.getCards().find(
      (card) => card.value.toString() === this.value.toString(),
    );
    return card || new Card(CardType.None);
  }

  public condition(
    deck: Deck,
    sides: Side[],
    stores: CardDetail[],
    score: number,
  ): boolean {
    switch (this.value) {
      case AchievementType.OniFang:
        return OniFang.condition(deck, sides, stores, score);
      case AchievementType.ShrineOfValor:
        return ShrineOfValor.condition(deck, sides, stores, score);
      case AchievementType.DragonHeart:
        return DragonHeart.condition(deck, sides, stores, score);
      case AchievementType.GuardianKami:
        return GuardianKami.condition(deck, sides, stores, score);
      case AchievementType.SpiritualForge:
        return SpiritualForge.condition(deck, sides, stores, score);
      case AchievementType.SamuraiHorn:
        return SamuraiHorn.condition(deck, sides, stores, score);
      case AchievementType.OracleStone:
        return OracleStone.condition(deck, sides, stores, score);
      case AchievementType.MonkStaff:
        return MonkStaff.condition(deck, sides, stores, score);
      case AchievementType.ShogunAxe:
        return ShogunAxe.condition(deck, sides, stores, score);
      default:
        return false;
    }
  }

  public sides(deck: Deck, sides: Side[]): Side[] {
    switch (this.value) {
      case AchievementType.OniFang:
        return OniFang.sides(deck, sides);
      case AchievementType.ShrineOfValor:
        return ShrineOfValor.sides(deck, sides);
      case AchievementType.DragonHeart:
        return DragonHeart.sides(deck, sides);
      case AchievementType.GuardianKami:
        return GuardianKami.sides(deck, sides);
      case AchievementType.SpiritualForge:
        return SpiritualForge.sides(deck, sides);
      case AchievementType.SamuraiHorn:
        return SamuraiHorn.sides(deck, sides);
      case AchievementType.OracleStone:
        return OracleStone.sides(deck, sides);
      case AchievementType.MonkStaff:
        return MonkStaff.sides(deck, sides);
      case AchievementType.ShogunAxe:
        return ShogunAxe.sides(deck, sides);
      default:
        return sides;
    }
  }

  public description(): string {
    switch (this.value) {
      case AchievementType.OniFang:
        return OniFang.description();
      case AchievementType.ShrineOfValor:
        return ShrineOfValor.description();
      case AchievementType.DragonHeart:
        return DragonHeart.description();
      case AchievementType.GuardianKami:
        return GuardianKami.description();
      case AchievementType.SpiritualForge:
        return SpiritualForge.description();
      case AchievementType.SamuraiHorn:
        return SamuraiHorn.description();
      case AchievementType.OracleStone:
        return OracleStone.description();
      case AchievementType.MonkStaff:
        return MonkStaff.description();
      case AchievementType.ShogunAxe:
        return ShogunAxe.description();
      default:
        return "";
    }
  }

  public effect(): string {
    switch (this.value) {
      case AchievementType.OniFang:
        return OniFang.effect();
      case AchievementType.ShrineOfValor:
        return ShrineOfValor.effect();
      case AchievementType.DragonHeart:
        return DragonHeart.effect();
      case AchievementType.GuardianKami:
        return GuardianKami.effect();
      case AchievementType.SpiritualForge:
        return SpiritualForge.effect();
      case AchievementType.SamuraiHorn:
        return SamuraiHorn.effect();
      case AchievementType.OracleStone:
        return OracleStone.effect();
      case AchievementType.MonkStaff:
        return MonkStaff.effect();
      case AchievementType.ShogunAxe:
        return ShogunAxe.effect();
      default:
        return "";
    }
  }
}
