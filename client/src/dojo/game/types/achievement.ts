// use zkastle::elements::achievements;
// use zkastle::types::deck::Deck;

// #[derive(Copy, Drop, Serde, Introspect)]
// enum Achievement {
//     None,
//     OniFang,
//     ShrineOfValor,
//     DragonHeart,
//     GuardianKami,
//     SpiritualForge,
//     SamuraiHorn,
//     OracleStone,
//     MonkStaff,
//     ShogunAxe,
// }

// #[generate_trait]
// impl AchievementImpl of AchievementTrait {
//     #[inline(always)]
//     fn condition(self: Achievement, deck: Deck, sides: u128, stores: u32, score: u8) -> bool {
//         match self {
//             Achievement::OniFang => achievements::oni_fang::AchievementImpl::condition(
//                 deck, sides, stores, score
//             ),
//             Achievement::ShrineOfValor => achievements::shrine_of_valor::AchievementImpl::condition(
//                 deck, sides, stores, score
//             ),
//             Achievement::DragonHeart => achievements::dragon_heart::AchievementImpl::condition(
//                 deck, sides, stores, score
//             ),
//             Achievement::GuardianKami => achievements::guardian_kami::AchievementImpl::condition(
//                 deck, sides, stores, score
//             ),
//             Achievement::SpiritualForge => achievements::spiritual_forge::AchievementImpl::condition(
//                 deck, sides, stores, score
//             ),
//             Achievement::SamuraiHorn => achievements::samurai_horn::AchievementImpl::condition(
//                 deck, sides, stores, score
//             ),
//             Achievement::OracleStone => achievements::oracle_stone::AchievementImpl::condition(
//                 deck, sides, stores, score
//             ),
//             Achievement::MonkStaff => achievements::monk_staff::AchievementImpl::condition(
//                 deck, sides, stores, score
//             ),
//             Achievement::ShogunAxe => achievements::shogun_axe::AchievementImpl::condition(
//                 deck, sides, stores, score
//             ),
//             _ => false,
//         }
//     }

//     #[inline(always)]
//     fn index(self: Achievement) -> u8 {
//         let id: u8 = self.into();
//         return id - 1;
//     }

//     #[inline(always)]
//     fn sides(self: Achievement, deck: Deck, sides: u128) -> u128 {
//         match self {
//             Achievement::OniFang => achievements::oni_fang::AchievementImpl::sides(deck, sides),
//             Achievement::ShrineOfValor => achievements::shrine_of_valor::AchievementImpl::sides(
//                 deck, sides
//             ),
//             Achievement::DragonHeart => achievements::dragon_heart::AchievementImpl::sides(
//                 deck, sides
//             ),
//             Achievement::GuardianKami => achievements::guardian_kami::AchievementImpl::sides(
//                 deck, sides
//             ),
//             Achievement::SpiritualForge => achievements::spiritual_forge::AchievementImpl::sides(
//                 deck, sides
//             ),
//             Achievement::SamuraiHorn => achievements::samurai_horn::AchievementImpl::sides(
//                 deck, sides
//             ),
//             Achievement::OracleStone => achievements::oracle_stone::AchievementImpl::sides(
//                 deck, sides
//             ),
//             Achievement::MonkStaff => achievements::monk_staff::AchievementImpl::sides(deck, sides),
//             Achievement::ShogunAxe => achievements::shogun_axe::AchievementImpl::sides(deck, sides),
//             _ => sides,
//         }
//     }
// }

import { Card } from "./card";
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

export enum AchievementType {
  None = "None",
  OniFang = "OniFang",
  ShrineOfValor = "ShrineOfValor",
  DragonHeart = "DragonHeart",
  GuardianKami = "GuardianKami",
  SpiritualForge = "SpiritualForge",
  SamuraiHorn = "SamuraiHorn",
  OracleStone = "OracleStone",
  MonkStaff = "MonkStaff",
  ShogunAxe = "ShogunAxe",
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

  public condition(
    deck: Deck,
    sides: Side[],
    stores: { card: Card; side: Side; id: number }[],
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
}
