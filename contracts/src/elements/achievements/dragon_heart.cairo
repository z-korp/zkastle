// Internal imports

use zkastle::constants::{CARD_BIT_SIZE, SIDE_BIT_SIZE};
use zkastle::types::card::{Card, CardTrait};
use zkastle::types::side::Side;
use zkastle::types::deck::{Deck, DeckTrait};
use zkastle::types::resource::Resource;
use zkastle::helpers::packer::{Packer, SizedPacker};
use zkastle::elements::achievements::interface::AchievementTrait;

impl AchievementImpl of AchievementTrait {
    fn condition(deck: Deck, sides: u128, stores: u32, score: u8) -> bool {
        // [Check] Score must be at least 25
        if score < 25 {
            return false;
        }
        // [Check] At least 9 iron resources stored
        let mut resource: Resource = core::Zeroable::zero();
        let mut ids: Array<u8> = Packer::unpack(stores, CARD_BIT_SIZE);
        loop {
            match ids.pop_front() {
                Option::Some(id) => {
                    let index: u8 = id - 1;
                    let card: Card = deck.get(id);
                    let raw: u8 = SizedPacker::get(sides, index, SIDE_BIT_SIZE, deck.count());
                    let side: Side = raw.into();
                    resource = resource + card.resource(side);
                },
                Option::None => { break; },
            };
        };
        return resource.iron >= 9;
    }

    #[inline(always)]
    fn sides(deck: Deck, sides: u128) -> u128 {
        sides
    }
}
