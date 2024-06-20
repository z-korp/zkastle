// Internal imports

use zkastle::constants::SIDE_BIT_SIZE;
use zkastle::types::card::{Card, CardTrait};
use zkastle::types::side::Side;
use zkastle::types::deck::{Deck, DeckTrait};
use zkastle::helpers::packer::SizedPacker;
use zkastle::elements::achievements::interface::AchievementTrait;

impl AchievementImpl of AchievementTrait {
    fn condition(deck: Deck, sides: u128, stores: u32, score: u8) -> bool {
        // [Check] Score must be at least 32
        if score < 32 {
            return false;
        }
        // [Check] All taverns must be upgraded to level 2 or more
        let mut ids: Array<u8> = deck.ids(Card::Tavern);
        let taverns = loop {
            match ids.pop_front() {
                Option::Some(id) => {
                    let index: u8 = id - 1;
                    let raw: u8 = SizedPacker::get(sides, index, SIDE_BIT_SIZE, deck.count());
                    let side: Side = raw.into();
                    let upgrade: u8 = Card::Monastery.upgrade(side);
                    if upgrade < 2 {
                        break false;
                    };
                },
                Option::None => { break true; },
            };
        };
        if !taverns {
            return false;
        }
        // [Check] All citadels must be upgraded to level 2 or more
        let mut ids: Array<u8> = deck.ids(Card::Citadel);
        loop {
            match ids.pop_front() {
                Option::Some(id) => {
                    let index: u8 = id - 1;
                    let raw: u8 = SizedPacker::get(sides, index, SIDE_BIT_SIZE, deck.count());
                    let side: Side = raw.into();
                    let upgrade: u8 = Card::Citadel.upgrade(side);
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
        sides
    }
}
