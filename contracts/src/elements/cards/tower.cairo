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
        match side {
            Side::Two => 1,
            Side::Three => 6,
            Side::Four => 3,
            _ => 0,
        }
    }

    #[inline(always)]
    fn upgrade(side: Side) -> u8 {
        match side {
            Side::Two => 1,
            Side::Three => 3,
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
            Action::Rotate => match side {
                Side::One => true,
                Side::Four => true,
                _ => false,
            },
            Action::Flip => match side {
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
                Side::One => array![ResourceTrait::new(1, 1, 0)],
                Side::Four => array![ResourceTrait::new(2, 2, 2)],
                _ => array![],
            },
            Action::Flip => match side {
                Side::Two => array![ResourceTrait::new(1, 1, 1)],
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
