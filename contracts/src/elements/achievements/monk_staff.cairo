// Internal imports

use zkastle::constants::SIDE_BIT_SIZE;
use zkastle::types::card::{Card, CardTrait};
use zkastle::types::side::Side;
use zkastle::types::deck::{Deck, DeckTrait};
use zkastle::helpers::packer::SizedPacker;
use zkastle::elements::achievements::interface::AchievementTrait;

impl AchievementImpl of AchievementTrait {
    fn condition(deck: Deck, sides: u128, stores: u32, score: u8) -> bool {
        // [Check] All buildings must be upgraded to level 2 or more
        let mut index = deck.count();
        loop {
            if index == 0 {
                break true;
            }
            index = index - 1;
            let raw: u8 = SizedPacker::get(sides, index, SIDE_BIT_SIZE, deck.count());
            let side: Side = raw.into();
            let upgrade: u8 = Card::Monastery.upgrade(side);
            if upgrade < 2 {
                break false;
            };
        }
    }

    #[inline(always)]
    fn sides(deck: Deck, sides: u128) -> u128 {
        sides
    }
}
