// Internal imports

use zkastle::elements::cards::interface::{
    CardTrait, Action, Side, SideTrait, Resource, ResourceTrait, Deck
};

impl CardImpl of CardTrait {
    #[inline(always)]
    fn resource(side: Side) -> Resource {
        match side {
            Side::One => ResourceTrait::new(1, 0, 0),
            Side::Two => ResourceTrait::new(2, 0, 0),
            Side::Three => ResourceTrait::new(1, 1, 0),
            Side::Four => ResourceTrait::new(2, 1, 0),
            _ => ResourceTrait::new(0, 0, 0),
        }
    }

    #[inline(always)]
    fn score(side: Side) -> u8 {
        0
    }

    #[inline(always)]
    fn upgrade(side: Side) -> u8 {
        match side {
            Side::Two => 1,
            Side::Three => 1,
            Side::Four => 2,
            _ => 0,
        }
    }

    #[inline(always)]
    fn update(side: Side, action: Action) -> Side {
        side.update(action)
    }

    #[inline(always)]
    fn can(side: Side, action: Action) -> bool {
        match action {
            Action::Store => true,
            Action::Rotate => match side {
                Side::One => true,
                Side::Three => true,
                _ => false,
            },
            Action::Flip => match side {
                Side::One => true,
                Side::Two => true,
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
                Side::One => array![ResourceTrait::new(1, 0, 0)],
                Side::Three => array![ResourceTrait::new(1, 1, 0)],
                _ => array![],
            },
            Action::Flip => match side {
                Side::One => array![ResourceTrait::new(1, 0, 0)],
                Side::Two => array![ResourceTrait::new(1, 1, 0)],
                _ => array![],
            },
            _ => array![],
        }
    }

    #[inline(always)]
    fn condition(side: Side, action: Action, deck: Deck, sides: u128) -> bool {
        true
    }
}
