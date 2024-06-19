use core::clone::Clone;
// Internal imports

use zkastle::elements::achievements;
use zkastle::types::deck::Deck;

#[derive(Copy, Drop, Serde, Introspect)]
enum Achievement {
    None,
    OniFang,
    ShrineOfValor,
    DragonHeart,
    GuardianKami,
    SpiritualForge,
    SamuraiHorn,
    OracleStone,
    MonkStaff,
    ShogunAxe,
}

#[generate_trait]
impl AchievementImpl of AchievementTrait {
    #[inline(always)]
    fn condition(self: Achievement, deck: Deck, sides: u128, stores: u32, score: u8) -> bool {
        match self {
            Achievement::OniFang => achievements::oni_fang::AchievementImpl::condition(
                deck, sides, stores, score
            ),
            Achievement::ShrineOfValor => achievements::shrine_of_valor::AchievementImpl::condition(
                deck, sides, stores, score
            ),
            Achievement::DragonHeart => achievements::dragon_heart::AchievementImpl::condition(
                deck, sides, stores, score
            ),
            Achievement::GuardianKami => achievements::guardian_kami::AchievementImpl::condition(
                deck, sides, stores, score
            ),
            Achievement::SpiritualForge => achievements::spiritual_forge::AchievementImpl::condition(
                deck, sides, stores, score
            ),
            Achievement::SamuraiHorn => achievements::samurai_horn::AchievementImpl::condition(
                deck, sides, stores, score
            ),
            Achievement::OracleStone => achievements::oracle_stone::AchievementImpl::condition(
                deck, sides, stores, score
            ),
            Achievement::MonkStaff => achievements::monk_staff::AchievementImpl::condition(
                deck, sides, stores, score
            ),
            Achievement::ShogunAxe => achievements::shogun_axe::AchievementImpl::condition(
                deck, sides, stores, score
            ),
            _ => false,
        }
    }

    #[inline(always)]
    fn index(self: Achievement) -> u8 {
        let id: u8 = self.into();
        return id - 1;
    }

    #[inline(always)]
    fn sides(self: Achievement, deck: Deck, sides: u128) -> u128 {
        match self {
            Achievement::OniFang => achievements::oni_fang::AchievementImpl::sides(deck, sides),
            Achievement::ShrineOfValor => achievements::shrine_of_valor::AchievementImpl::sides(
                deck, sides
            ),
            Achievement::DragonHeart => achievements::dragon_heart::AchievementImpl::sides(
                deck, sides
            ),
            Achievement::GuardianKami => achievements::guardian_kami::AchievementImpl::sides(
                deck, sides
            ),
            Achievement::SpiritualForge => achievements::spiritual_forge::AchievementImpl::sides(
                deck, sides
            ),
            Achievement::SamuraiHorn => achievements::samurai_horn::AchievementImpl::sides(
                deck, sides
            ),
            Achievement::OracleStone => achievements::oracle_stone::AchievementImpl::sides(
                deck, sides
            ),
            Achievement::MonkStaff => achievements::monk_staff::AchievementImpl::sides(deck, sides),
            Achievement::ShogunAxe => achievements::shogun_axe::AchievementImpl::sides(deck, sides),
            _ => sides,
        }
    }
}

impl IntoAchievementFelt252 of core::Into<Achievement, felt252> {
    #[inline(always)]
    fn into(self: Achievement) -> felt252 {
        match self {
            Achievement::None => 'NONE',
            Achievement::OniFang => 'ONI FANG',
            Achievement::ShrineOfValor => 'SHRINE OF VALOR',
            Achievement::DragonHeart => 'DRAGON HEART',
            Achievement::GuardianKami => 'GUARDIAN KAMI',
            Achievement::SpiritualForge => 'SPIRITUAL FORGE',
            Achievement::SamuraiHorn => 'SAMURAI HORN',
            Achievement::OracleStone => 'ORACLE STONE',
            Achievement::MonkStaff => 'MONK STAFF',
            Achievement::ShogunAxe => 'SHOGUN AXE',
        }
    }
}

impl IntoAchievementU8 of core::Into<Achievement, u8> {
    #[inline(always)]
    fn into(self: Achievement) -> u8 {
        match self {
            Achievement::None => 0,
            Achievement::OniFang => 1,
            Achievement::ShrineOfValor => 2,
            Achievement::DragonHeart => 3,
            Achievement::GuardianKami => 4,
            Achievement::SpiritualForge => 5,
            Achievement::SamuraiHorn => 6,
            Achievement::OracleStone => 7,
            Achievement::MonkStaff => 8,
            Achievement::ShogunAxe => 9,
        }
    }
}

impl IntoU8Achievement of core::Into<u8, Achievement> {
    #[inline(always)]
    fn into(self: u8) -> Achievement {
        let achievement: felt252 = self.into();
        match achievement {
            0 => Achievement::None,
            1 => Achievement::OniFang,
            2 => Achievement::ShrineOfValor,
            3 => Achievement::DragonHeart,
            4 => Achievement::GuardianKami,
            5 => Achievement::SpiritualForge,
            6 => Achievement::SamuraiHorn,
            7 => Achievement::OracleStone,
            8 => Achievement::MonkStaff,
            9 => Achievement::ShogunAxe,
            _ => Achievement::None,
        }
    }
}

impl AchievementPrint of core::debug::PrintTrait<Achievement> {
    #[inline(always)]
    fn print(self: Achievement) {
        let felt: felt252 = self.into();
        felt.print();
    }
}
