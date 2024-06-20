// Internal imports

use zkastle::constants::SIDE_BIT_SIZE;
use zkastle::elements::cards::interface::{
    CardTrait, Action, Side, SideTrait, Resource, ResourceTrait, Deck, DeckTrait
};
use zkastle::types::card::{Card, CardTrait as CardTypeTrait};
use zkastle::helpers::packer::SizedPacker;

impl CardImpl of CardTrait {
    #[inline(always)]
    fn resource(side: Side) -> Resource {
        ResourceTrait::new(0, 0, 0)
    }

    #[inline(always)]
    fn score(side: Side) -> u8 {
        match side {
            Side::Three => 1,
            Side::Four => 5,
            _ => 0,
        }
    }

    #[inline(always)]
    fn upgrade(side: Side) -> u8 {
        0
    }

    #[inline(always)]
    fn update(side: Side, action: Action) -> Side {
        side.update(action)
    }

    #[inline(always)]
    fn can(side: Side, action: Action) -> bool {
        match action {
            Action::Rotate => match side {
                Side::Three => true,
                _ => false,
            },
            Action::Flip => match side {
                Side::One => true,
                _ => false,
            },
            Action::Discard => true,
            _ => false,
        }
    }

    #[inline(always)]
    fn cost(side: Side, action: Action) -> Array<Resource> {
        match action {
            Action::Rotate => match side {
                Side::Three => array![ResourceTrait::new(3, 3, 3)],
                _ => array![],
            },
            _ => array![],
        }
    }

    fn condition(side: Side, action: Action, deck: Deck, sides: u128) -> bool {
        match action {
            Action::Flip => match side {
                Side::One => {
                    // [Check] All towers must be upgraded to level 3 or more
                    let mut ids: Array<u8> = deck.ids(Card::Tower);
                    loop {
                        match ids.pop_front() {
                            Option::Some(id) => {
                                let index: u8 = id - 1;
                                let raw: u8 = SizedPacker::get(
                                    sides, index, SIDE_BIT_SIZE, deck.count()
                                );
                                let side: Side = raw.into();
                                let upgrade: u8 = Card::Farm.upgrade(side);
                                if upgrade < 3 {
                                    break false;
                                };
                            },
                            Option::None => { break true; },
                        };
                    }
                },
                _ => true,
            },
            _ => true,
        }
    }
}
