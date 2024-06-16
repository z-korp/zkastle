// Internal imports

use zkastle::elements::decks::interface::{DeckTrait, Card};

impl DeckImpl of DeckTrait {
    #[inline(always)]
    fn count() -> u8 {
        16
    }

    #[inline(always)]
    fn draw(index: u8) -> Card {
        let id: felt252 = (index % Self::count().into()).into();
        match id {
            0 => Card::Farm,
            1 => Card::Farm,
            2 => Card::Farm,
            3 => Card::Quarry,
            4 => Card::Quarry,
            5 => Card::Quarry,
            6 => Card::Mine,
            7 => Card::Mine,
            8 => Card::Mine,
            9 => Card::Monastery,
            10 => Card::Monastery,
            11 => Card::Tower,
            12 => Card::Tower,
            13 => Card::Forge,
            14 => Card::Tavern,
            15 => Card::Citadel,
            _ => Card::None,
        }
    }
}
