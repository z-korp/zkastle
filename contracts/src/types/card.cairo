use core::clone::Clone;

// Internal imports

use zkastle::elements::cards;
use zkastle::types::side::Side;
use zkastle::types::action::Action;
use zkastle::types::resource::{Resource, ResourceTrait};

#[derive(Copy, Drop, Serde, Introspect)]
enum Card {
    None,
    Farm,
    Mine,
    Quarry,
    Monastery,
    Tower,
    Forge,
    Tavern,
    Citadel,
}

#[generate_trait]
impl CardImpl of CardTrait {
    #[inline(always)]
    fn resource(self: Card, side: Side) -> Resource {
        match self {
            Card::Farm => cards::farm::CardImpl::resource(side),
            Card::Mine => cards::mine::CardImpl::resource(side),
            Card::Quarry => cards::quarry::CardImpl::resource(side),
            Card::Monastery => cards::monastery::CardImpl::resource(side),
            Card::Tower => cards::tower::CardImpl::resource(side),
            Card::Forge => cards::forge::CardImpl::resource(side),
            Card::Tavern => cards::tavern::CardImpl::resource(side),
            Card::Citadel => cards::citadel::CardImpl::resource(side),
            _ => ResourceTrait::new(0, 0, 0),
        }
    }

    #[inline(always)]
    fn score(self: Card, side: Side) -> u8 {
        match self {
            Card::Farm => cards::farm::CardImpl::score(side),
            Card::Mine => cards::mine::CardImpl::score(side),
            Card::Quarry => cards::quarry::CardImpl::score(side),
            Card::Monastery => cards::monastery::CardImpl::score(side),
            Card::Tower => cards::tower::CardImpl::score(side),
            Card::Forge => cards::forge::CardImpl::score(side),
            Card::Tavern => cards::tavern::CardImpl::score(side),
            Card::Citadel => cards::citadel::CardImpl::score(side),
            _ => 0,
        }
    }

    #[inline(always)]
    fn upgrade(self: Card, side: Side) -> u8 {
        match self {
            Card::Farm => cards::farm::CardImpl::upgrade(side),
            Card::Mine => cards::mine::CardImpl::upgrade(side),
            Card::Quarry => cards::quarry::CardImpl::upgrade(side),
            Card::Monastery => cards::monastery::CardImpl::upgrade(side),
            Card::Tower => cards::tower::CardImpl::upgrade(side),
            Card::Forge => cards::forge::CardImpl::upgrade(side),
            Card::Tavern => cards::tavern::CardImpl::upgrade(side),
            Card::Citadel => cards::citadel::CardImpl::upgrade(side),
            _ => 0,
        }
    }

    #[inline(always)]
    fn can(self: Card, side: Side, action: Action) -> bool {
        match self {
            Card::Farm => cards::farm::CardImpl::can(side, action),
            Card::Mine => cards::mine::CardImpl::can(side, action),
            Card::Quarry => cards::quarry::CardImpl::can(side, action),
            Card::Monastery => cards::monastery::CardImpl::can(side, action),
            Card::Tower => cards::tower::CardImpl::can(side, action),
            Card::Forge => cards::forge::CardImpl::can(side, action),
            Card::Tavern => cards::tavern::CardImpl::can(side, action),
            Card::Citadel => cards::citadel::CardImpl::can(side, action),
            _ => false,
        }
    }

    #[inline(always)]
    fn cost(self: Card, side: Side, action: Action) -> Array<Resource> {
        match self {
            Card::Farm => cards::farm::CardImpl::cost(side, action),
            Card::Mine => cards::mine::CardImpl::cost(side, action),
            Card::Quarry => cards::quarry::CardImpl::cost(side, action),
            Card::Monastery => cards::monastery::CardImpl::cost(side, action),
            Card::Tower => cards::tower::CardImpl::cost(side, action),
            Card::Forge => cards::forge::CardImpl::cost(side, action),
            Card::Tavern => cards::tavern::CardImpl::cost(side, action),
            Card::Citadel => cards::citadel::CardImpl::cost(side, action),
            _ => array![],
        }
    }
}

impl IntoCardFelt252 of core::Into<Card, felt252> {
    #[inline(always)]
    fn into(self: Card) -> felt252 {
        match self {
            Card::None => 'NONE',
            Card::Farm => 'FARM',
            Card::Mine => 'MINE',
            Card::Quarry => 'QUARRY',
            Card::Monastery => 'MONASTERY',
            Card::Tower => 'TOWER',
            Card::Forge => 'FORGE',
            Card::Tavern => 'TAVERN',
            Card::Citadel => 'CITADEL',
        }
    }
}
impl IntoCardU8 of core::Into<Card, u8> {
    #[inline(always)]
    fn into(self: Card) -> u8 {
        match self {
            Card::None => 0,
            Card::Farm => 1,
            Card::Mine => 2,
            Card::Quarry => 3,
            Card::Monastery => 4,
            Card::Tower => 5,
            Card::Forge => 6,
            Card::Tavern => 7,
            Card::Citadel => 8,
        }
    }
}
impl IntoU8Card of core::Into<u8, Card> {
    #[inline(always)]
    fn into(self: u8) -> Card {
        let card: felt252 = self.into();
        match card {
            0 => Card::None,
            1 => Card::Farm,
            2 => Card::Mine,
            3 => Card::Quarry,
            4 => Card::Monastery,
            5 => Card::Tower,
            6 => Card::Forge,
            7 => Card::Tavern,
            8 => Card::Citadel,
            _ => Card::None,
        }
    }
}
impl CardPrint of core::debug::PrintTrait<Card> {
    #[inline(always)]
    fn print(self: Card) {
        let felt: felt252 = self.into();
        felt.print();
    }
}