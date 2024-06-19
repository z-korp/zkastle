// Internal imports

use zkastle::elements::cards::interface::{
    CardTrait, Action, Side, SideTrait, Resource, ResourceTrait, Deck
};

impl CardImpl of CardTrait {
    #[inline(always)]
    fn resource(side: Side) -> Resource {
        ResourceTrait::new(0, 0, 0)
    }

    #[inline(always)]
    fn score(side: Side) -> u8 {
        0
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
        false
    }

    #[inline(always)]
    fn cost(side: Side, action: Action) -> Array<Resource> {
        array![]
    }

    #[inline(always)]
    fn condition(side: Side, action: Action, deck: Deck, sides: u128) -> bool {
        true
    }
}
