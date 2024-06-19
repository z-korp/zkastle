// Internal imports

use zkastle::elements::decks::interface::{DeckTrait, Card};

impl DeckImpl of DeckTrait {
    #[inline(always)]
    fn count() -> u8 {
        25
    }

    #[inline(always)]
    fn base_count() -> u8 {
        16
    }

    #[inline(always)]
    fn achievement_count() -> u8 {
        9
    }

    #[inline(always)]
    fn cards() -> u128 {
        // b0101111101111111111111111
        0xbeffff
    }

    #[inline(always)]
    fn sides() -> u128 {
        // b001001001001001001001001001001001001001001001001001001001001001001
        0x9249249249249249
    }

    #[inline(always)]
    fn draw(id: u8) -> Card {
        match id {
            0 => Card::None,
            1 => Card::Farm,
            2 => Card::Farm,
            3 => Card::Farm,
            4 => Card::Quarry,
            5 => Card::Quarry,
            6 => Card::Quarry,
            7 => Card::Mine,
            8 => Card::Mine,
            9 => Card::Mine,
            10 => Card::Monastery,
            11 => Card::Monastery,
            12 => Card::Tower,
            13 => Card::Tower,
            14 => Card::Forge,
            15 => Card::Tavern,
            16 => Card::Citadel,
            17 => Card::OniFang,
            18 => Card::ShrineOfValor,
            19 => Card::DragonHeart,
            20 => Card::GuardianKami,
            21 => Card::SpiritualForge,
            22 => Card::SamuraiHorn,
            23 => Card::OracleStone,
            24 => Card::MonkStaff,
            25 => Card::ShogunAxe,
            _ => Card::None,
        }
    }

    #[inline(always)]
    fn ids(card: Card) -> Array<u8> {
        match card {
            Card::None => array![],
            Card::Farm => array![1, 2, 3],
            Card::Quarry => array![4, 5, 6],
            Card::Mine => array![7, 8, 9],
            Card::Monastery => array![10, 11],
            Card::Tower => array![12, 13],
            Card::Forge => array![14],
            Card::Tavern => array![15],
            Card::Citadel => array![16],
            Card::OniFang => array![17],
            Card::ShrineOfValor => array![18],
            Card::DragonHeart => array![19],
            Card::GuardianKami => array![20],
            Card::SpiritualForge => array![21],
            Card::SamuraiHorn => array![22],
            Card::OracleStone => array![23],
            Card::MonkStaff => array![24],
            Card::ShogunAxe => array![25],
        }
    }
}
