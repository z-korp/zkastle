// Internal imports

use zkastle::elements::decks::interface::{DeckTrait, Card};

impl DeckImpl of DeckTrait {
    #[inline(always)]
    fn count() -> u8 {
        16
    }

    #[inline(always)]
    fn draw(id: u8) -> Card {
        match id {
            0 => Card::None,
            1 => Card::Farm,
            2 => Card::Farm,
            3 => Card::Farm,
            4 => Card::Quarry,
            5 => Card::Quarry,
            6 => Card::Quarry,
            7 => Card::Mine,
            8 => Card::Mine,
            9 => Card::Mine,
            10 => Card::Monastery,
            11 => Card::Monastery,
            12 => Card::Tower,
            13 => Card::Tower,
            14 => Card::Forge,
            15 => Card::Tavern,
            16 => Card::Citadel,
            _ => Card::None,
        }
    }
}
