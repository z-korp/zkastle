// Internal imports

use zkastle::constants::SIDE_BIT_SIZE;
use zkastle::types::card::{Card, CardTrait};
use zkastle::types::side::Side;
use zkastle::types::deck::{Deck, DeckTrait};
use zkastle::helpers::packer::SizedPacker;
use zkastle::elements::achievements::interface::AchievementTrait;

impl AchievementImpl of AchievementTrait {
    fn condition(deck: Deck, sides: u128, stores: u32, score: u8) -> bool {
        // [Check] Score must be at least 34
        if score < 34 {
            return false;
        }
        // [Check] All quarries must be upgraded to level 2 or more
        let mut ids: Array<u8> = deck.ids(Card::Quarry);
        loop {
            match ids.pop_front() {
                Option::Some(id) => {
                    let index: u8 = id - 1;
                    let raw: u8 = SizedPacker::get(sides, index, SIDE_BIT_SIZE, deck.count());
                    let side: Side = raw.into();
                    let upgrade: u8 = Card::Quarry.upgrade(side);
                    if upgrade < 2 {
                        break false;
                    };
                },
                Option::None => { break true; },
            };
        }
    }

    #[inline(always)]
    fn sides(deck: Deck, sides: u128) -> u128 {
        let mut ids = deck.ids(Card::Quarry);
        match ids.pop_front() {
            Option::Some(id) => {
                let index = id - 1;
                let value: u8 = Side::Two.into();
                SizedPacker::replace(sides, index, SIDE_BIT_SIZE, value, deck.count())
            },
            Option::None => { sides },
        }
    }
}
