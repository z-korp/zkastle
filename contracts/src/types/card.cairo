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
