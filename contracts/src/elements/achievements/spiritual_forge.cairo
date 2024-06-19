// Internal imports

use zkastle::constants::SIDE_BIT_SIZE;
use zkastle::types::card::{Card, CardTrait};
use zkastle::types::side::Side;
use zkastle::types::deck::{Deck, DeckTrait};
use zkastle::helpers::packer::SizedPacker;
use zkastle::elements::achievements::interface::AchievementTrait;

impl AchievementImpl of AchievementTrait {
    fn condition(deck: Deck, sides: u128, stores: u32, score: u8) -> bool {
        // [Check] Score must be at least 30
        if score < 30 {
            return false;
        }
        // [Check] All monasteries must be not upgradable
        let mut ids: Array<u8> = deck.ids(Card::Monastery);
        loop {
            match ids.pop_front() {
                Option::Some(id) => {
                    let index: u8 = id - 1;
                    let raw: u8 = SizedPacker::get(sides, index, SIDE_BIT_SIZE, deck.count());
                    let side: Side = raw.into();
                    let upgrade: u8 = Card::Monastery.upgrade(side);
                    if upgrade != 0 {
                        break false;
                    };
                },
                Option::None => { break true; },
            };
        }
    }

    #[inline(always)]
    fn sides(deck: Deck, sides: u128) -> u128 {
        sides
    }
}
