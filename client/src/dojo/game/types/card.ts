import { Resource } from "./resource";
import { Side } from "./side";
import { Farm } from "../elements/cards/farm";
import { Mine } from "../elements/cards/mine";
import { Quarry } from "../elements/cards/quarry";
import { Monastery } from "../elements/cards/monastery";
import { Tower } from "../elements/cards/tower";
import { Forge } from "../elements/cards/forge";
import { Tavern } from "../elements/cards/tavern";
import { Citadel } from "../elements/cards/citadel";
import { OniFang } from "../elements/cards/oni_fang";
import { ShrineOfValor } from "../elements/cards/shrine_of_valor";
import { DragonHeart } from "../elements/cards/dragon_heart";
import { GuardianKami } from "../elements/cards/guardian_kami";
import { SpiritualForge } from "../elements/cards/spiritual_forge";
import { SamuraiHorn } from "../elements/cards/samurai_horn";
import { OracleStone } from "../elements/cards/oracle_stone";
import { MonkStaff } from "../elements/cards/monk_staff";
import { ShogunAxe } from "../elements/cards/shogun_axe";

import citadel from "/assets/citadel-bg.png";
import farm from "/assets/farm-bg.png";
import forge from "/assets/forge-bg.png";
import mine from "/assets/mine-bg.png";
import monastery from "/assets/monastery-bg.png";
import quarry from "/assets/quarry-bg.png";
import tavern from "/assets/tavern-bg.png";
import tower from "/assets/tower-bg.png";
import oni_fang from "/assets/oni-fang-bg.png";
import shrine_of_valor from "/assets/shrine-of-valor-bg.png";
import dragon_heart from "/assets/dragon-heart-bg.png";
import guardian_kami from "/assets/guardian-kami-bg.png";
import spiritual_forge from "/assets/spiritual-forge-bg.png";
import samurai_horn from "/assets/samurai-horn-bg.png";
import oracle_stone from "/assets/oracle-stone-bg.png";
import monk_staff from "/assets/monk-staff-bg.png";
import shogun_axe from "/assets/shogun-axe-bg.png";

import { Action } from "./action";
import { Achievement, AchievementType } from "./achievement";

export enum CardType {
  None = "None",
  Farm = "Farm",
  Mine = "Mine",
  Quarry = "Quarry",
  Monastery = "Monastery",
  Tower = "Tower",
  Forge = "Forge",
  Tavern = "Tavern",
  Citadel = "Citadel",
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

export class Card {
  value: CardType;

  constructor(value: CardType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(CardType).indexOf(this.value);
  }

  public static from(index: number): Card {
    const item = Object.values(CardType)[index];
    return new Card(item);
  }

  public static getBaseCards(): Card[] {
    return [
      new Card(CardType.Farm),
      new Card(CardType.Mine),
      new Card(CardType.Quarry),
      new Card(CardType.Monastery),
      new Card(CardType.Tower),
      new Card(CardType.Forge),
      new Card(CardType.Tavern),
      new Card(CardType.Citadel),
    ];
  }

  public static getAchievementCards(): Card[] {
    return [
      new Card(CardType.OniFang),
      new Card(CardType.ShrineOfValor),
      new Card(CardType.DragonHeart),
      new Card(CardType.GuardianKami),
      new Card(CardType.SpiritualForge),
      new Card(CardType.SamuraiHorn),
      new Card(CardType.OracleStone),
      new Card(CardType.MonkStaff),
      new Card(CardType.ShogunAxe),
    ];
  }

  public static getCards(): Card[] {
    return [
      new Card(CardType.Farm),
      new Card(CardType.Mine),
      new Card(CardType.Quarry),
      new Card(CardType.Monastery),
      new Card(CardType.Tower),
      new Card(CardType.Forge),
      new Card(CardType.Tavern),
      new Card(CardType.Citadel),
      new Card(CardType.OniFang),
      new Card(CardType.ShrineOfValor),
      new Card(CardType.DragonHeart),
      new Card(CardType.GuardianKami),
      new Card(CardType.SpiritualForge),
      new Card(CardType.SamuraiHorn),
      new Card(CardType.OracleStone),
      new Card(CardType.MonkStaff),
      new Card(CardType.ShogunAxe),
    ];
  }

  public getSides(): Side[] {
    switch (this.value) {
      case CardType.Farm:
        return Farm.sides();
      case CardType.Mine:
        return Mine.sides();
      case CardType.Quarry:
        return Quarry.sides();
      case CardType.Monastery:
        return Monastery.sides();
      case CardType.Tower:
        return Tower.sides();
      case CardType.Forge:
        return Forge.sides();
      case CardType.Tavern:
        return Tavern.sides();
      case CardType.Citadel:
        return Citadel.sides();
      case CardType.OniFang:
        return OniFang.sides();
      case CardType.ShrineOfValor:
        return ShrineOfValor.sides();
      case CardType.DragonHeart:
        return DragonHeart.sides();
      case CardType.GuardianKami:
        return GuardianKami.sides();
      case CardType.SpiritualForge:
        return SpiritualForge.sides();
      case CardType.SamuraiHorn:
        return SamuraiHorn.sides();
      case CardType.OracleStone:
        return OracleStone.sides();
      case CardType.MonkStaff:
        return MonkStaff.sides();
      case CardType.ShogunAxe:
        return ShogunAxe.sides();
      default:
        return [];
    }
  }

  public isNone(): boolean {
    return this.value === CardType.None;
  }

  public getImage(): string {
    switch (this.value) {
      case CardType.Farm:
        return farm;
      case CardType.Mine:
        return mine;
      case CardType.Quarry:
        return quarry;
      case CardType.Monastery:
        return monastery;
      case CardType.Tower:
        return tower;
      case CardType.Forge:
        return forge;
      case CardType.Tavern:
        return tavern;
      case CardType.Citadel:
        return citadel;
      case CardType.OniFang:
        return oni_fang;
      case CardType.ShrineOfValor:
        return shrine_of_valor;
      case CardType.DragonHeart:
        return dragon_heart;
      case CardType.GuardianKami:
        return guardian_kami;
      case CardType.SpiritualForge:
        return spiritual_forge;
      case CardType.SamuraiHorn:
        return samurai_horn;
      case CardType.OracleStone:
        return oracle_stone;
      case CardType.MonkStaff:
        return monk_staff;
      case CardType.ShogunAxe:
        return shogun_axe;
      default:
        return "";
    }
  }

  public getResource(side: Side): Resource {
    switch (this.value) {
      case CardType.Farm:
        return Farm.resource(side);
      case CardType.Mine:
        return Mine.resource(side);
      case CardType.Quarry:
        return Quarry.resource(side);
      case CardType.Monastery:
        return Monastery.resource(side);
      case CardType.Tower:
        return Tower.resource(side);
      case CardType.Forge:
        return Forge.resource(side);
      case CardType.Tavern:
        return Tavern.resource(side);
      case CardType.Citadel:
        return Citadel.resource(side);
      case CardType.OniFang:
        return OniFang.resource(side);
      case CardType.ShrineOfValor:
        return ShrineOfValor.resource(side);
      case CardType.DragonHeart:
        return DragonHeart.resource(side);
      case CardType.GuardianKami:
        return GuardianKami.resource(side);
      case CardType.SpiritualForge:
        return SpiritualForge.resource(side);
      case CardType.SamuraiHorn:
        return SamuraiHorn.resource(side);
      case CardType.OracleStone:
        return OracleStone.resource(side);
      case CardType.MonkStaff:
        return MonkStaff.resource(side);
      case CardType.ShogunAxe:
        return ShogunAxe.resource(side);
      default:
        return new Resource(0, 0, 0);
    }
  }

  public getScore(side: Side): number {
    switch (this.value) {
      case CardType.Farm:
        return Farm.score(side);
      case CardType.Mine:
        return Mine.score(side);
      case CardType.Quarry:
        return Quarry.score(side);
      case CardType.Monastery:
        return Monastery.score(side);
      case CardType.Tower:
        return Tower.score(side);
      case CardType.Forge:
        return Forge.score(side);
      case CardType.Tavern:
        return Tavern.score(side);
      case CardType.Citadel:
        return Citadel.score(side);
      case CardType.OniFang:
        return OniFang.score(side);
      case CardType.ShrineOfValor:
        return ShrineOfValor.score(side);
      case CardType.DragonHeart:
        return DragonHeart.score(side);
      case CardType.GuardianKami:
        return GuardianKami.score(side);
      case CardType.SpiritualForge:
        return SpiritualForge.score(side);
      case CardType.SamuraiHorn:
        return SamuraiHorn.score(side);
      case CardType.OracleStone:
        return OracleStone.score(side);
      case CardType.MonkStaff:
        return MonkStaff.score(side);
      case CardType.ShogunAxe:
        return ShogunAxe.score(side);
      default:
        return 0;
    }
  }

  public getUpgrade(side: Side): number {
    switch (this.value) {
      case CardType.Farm:
        return Farm.upgrade(side);
      case CardType.Mine:
        return Mine.upgrade(side);
      case CardType.Quarry:
        return Quarry.upgrade(side);
      case CardType.Monastery:
        return Monastery.upgrade(side);
      case CardType.Tower:
        return Tower.upgrade(side);
      case CardType.Forge:
        return Forge.upgrade(side);
      case CardType.Tavern:
        return Tavern.upgrade(side);
      case CardType.Citadel:
        return Citadel.upgrade(side);
      case CardType.OniFang:
        return OniFang.upgrade(side);
      case CardType.ShrineOfValor:
        return ShrineOfValor.upgrade(side);
      case CardType.DragonHeart:
        return DragonHeart.upgrade(side);
      case CardType.GuardianKami:
        return GuardianKami.upgrade(side);
      case CardType.SpiritualForge:
        return SpiritualForge.upgrade(side);
      case CardType.SamuraiHorn:
        return SamuraiHorn.upgrade(side);
      case CardType.OracleStone:
        return OracleStone.upgrade(side);
      case CardType.MonkStaff:
        return MonkStaff.upgrade(side);
      case CardType.ShogunAxe:
        return ShogunAxe.upgrade(side);
      default:
        return 0;
    }
  }

  public isAllowed(side: Side, action: Action): boolean {
    switch (this.value) {
      case CardType.Farm:
        return Farm.can(side, action);
      case CardType.Mine:
        return Mine.can(side, action);
      case CardType.Quarry:
        return Quarry.can(side, action);
      case CardType.Monastery:
        return Monastery.can(side, action);
      case CardType.Tower:
        return Tower.can(side, action);
      case CardType.Forge:
        return Forge.can(side, action);
      case CardType.Tavern:
        return Tavern.can(side, action);
      case CardType.Citadel:
        return Citadel.can(side, action);
      case CardType.OniFang:
        return OniFang.can(side, action);
      case CardType.ShrineOfValor:
        return ShrineOfValor.can(side, action);
      case CardType.DragonHeart:
        return DragonHeart.can(side, action);
      case CardType.GuardianKami:
        return GuardianKami.can(side, action);
      case CardType.SpiritualForge:
        return SpiritualForge.can(side, action);
      case CardType.SamuraiHorn:
        return SamuraiHorn.can(side, action);
      case CardType.OracleStone:
        return OracleStone.can(side, action);
      case CardType.MonkStaff:
        return MonkStaff.can(side, action);
      case CardType.ShogunAxe:
        return ShogunAxe.can(side, action);
      default:
        return false;
    }
  }

  public getCost(side: Side, action: Action): Resource[] {
    switch (this.value) {
      case CardType.Farm:
        return Farm.cost(side, action);
      case CardType.Mine:
        return Mine.cost(side, action);
      case CardType.Quarry:
        return Quarry.cost(side, action);
      case CardType.Monastery:
        return Monastery.cost(side, action);
      case CardType.Tower:
        return Tower.cost(side, action);
      case CardType.Forge:
        return Forge.cost(side, action);
      case CardType.Tavern:
        return Tavern.cost(side, action);
      case CardType.Citadel:
        return Citadel.cost(side, action);
      case CardType.OniFang:
        return OniFang.cost(side, action);
      case CardType.ShrineOfValor:
        return ShrineOfValor.cost(side, action);
      case CardType.DragonHeart:
        return DragonHeart.cost(side, action);
      case CardType.GuardianKami:
        return GuardianKami.cost(side, action);
      case CardType.SpiritualForge:
        return SpiritualForge.cost(side, action);
      case CardType.SamuraiHorn:
        return SamuraiHorn.cost(side, action);
      case CardType.OracleStone:
        return OracleStone.cost(side, action);
      case CardType.MonkStaff:
        return MonkStaff.cost(side, action);
      case CardType.ShogunAxe:
        return ShogunAxe.cost(side, action);
      default:
        return [];
    }
  }

  public getAchievement(): Achievement {
    switch (this.value) {
      case CardType.OniFang:
        return new Achievement(AchievementType.OniFang);
      case CardType.ShrineOfValor:
        return new Achievement(AchievementType.ShrineOfValor);
      case CardType.DragonHeart:
        return new Achievement(AchievementType.DragonHeart);
      case CardType.GuardianKami:
        return new Achievement(AchievementType.GuardianKami);
      case CardType.SpiritualForge:
        return new Achievement(AchievementType.SpiritualForge);
      case CardType.SamuraiHorn:
        return new Achievement(AchievementType.SamuraiHorn);
      case CardType.OracleStone:
        return new Achievement(AchievementType.OracleStone);
      case CardType.MonkStaff:
        return new Achievement(AchievementType.MonkStaff);
      case CardType.ShogunAxe:
        return new Achievement(AchievementType.ShogunAxe);
      default:
        return new Achievement(AchievementType.None);
    }
  }
}
