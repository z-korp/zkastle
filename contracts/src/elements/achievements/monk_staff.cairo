// Internal imports

use zkastle::constants::{CARD_BIT_SIZE, SIDE_BIT_SIZE};
use zkastle::types::card::{Card, CardTrait};
use zkastle::types::side::Side;
use zkastle::types::deck::{Deck, DeckTrait};
use zkastle::helpers::packer::{Packer, SizedPacker};
use zkastle::elements::achievements::interface::AchievementTrait;

impl AchievementImpl of AchievementTrait {
    fn condition(deck: Deck, sides: u128, stores: u32, score: u8) -> bool {
        // [Check] All base buildings must be upgraded to level 2 or more
        let sides: Array<u8> = Packer::unpack(sides, SIDE_BIT_SIZE);
        let mut id = deck.base_count();
        loop {
            if id == 0 {
                break true;
            }
            let index = id - 1;
            let side: Side = (*sides.at(index.into())).into();
            let card: Card = deck.get(id);
            if card.upgrade(side) < 2 {
                break false;
            };
            id -= 1;
        }
    }

    #[inline(always)]
    fn sides(deck: Deck, sides: u128) -> u128 {
        sides
    }
}
