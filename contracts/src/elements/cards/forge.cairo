// Internal imports

use zkastle::elements::cards::interface::{CardTrait, Action, Side, Resource, ResourceTrait};

impl CardImpl of CardTrait {
    #[inline(always)]
    fn resource(side: Side) -> Resource {
        match side {
            Side::Three => ResourceTrait::new(1, 1, 0),
            Side::Four => ResourceTrait::new(1, 1, 1),
            _ => ResourceTrait::new(0, 0, 0),
        }
    }

    #[inline(always)]
    fn score(side: Side) -> u8 {
        match side {
            Side::Two => 4,
            _ => 0,
        }
    }

    #[inline(always)]
    fn upgrade(side: Side) -> u8 {
        0
    }

    #[inline(always)]
    fn can(side: Side, action: Action) -> bool {
        match action {
            Action::Store => match side {
                Side::Three => true,
                Side::Four => true,
                _ => false,
            },
            Action::Rotate => match side {
                Side::One => true,
                Side::Three => true,
                _ => false,
            },
            Action::Flip => match side {
                Side::One => true,
                Side::Four => true,
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
                Side::One => array![ResourceTrait::new(1, 1, 2)],
                Side::Three => array![ResourceTrait::new(1, 1, 1)],
                _ => array![],
            },
            Action::Flip => match side {
                Side::One => array![ResourceTrait::new(1, 1, 0)],
                Side::Four => array![ResourceTrait::new(2, 2, 2)],
                _ => array![],
            },
            _ => array![],
        }
    }
}
