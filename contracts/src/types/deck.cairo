// External imports

use origami::random::deck::{Deck as OrigamiDeck, DeckTrait as OrigamiDeckTrait};
use alexandria_math::fast_power::fast_power;

// Internal imports

use zkastle::constants::CARD_BIT_SIZE;
use zkastle::helpers::packer::{Packer, SizedPacker};
use zkastle::elements::decks;
use zkastle::types::card::Card;
use zkastle::types::achievement::{Achievement, AchievementTrait};

#[derive(Copy, Drop, Serde, Introspect)]
enum Deck {
    None,
    Base,
}

#[generate_trait]
impl DeckImpl of DeckTrait {
    #[inline(always)]
    fn count(self: Deck) -> u8 {
        match self {
            Deck::None => 0,
            Deck::Base => decks::base::DeckImpl::count(),
        }
    }

    #[inline(always)]
    fn base_count(self: Deck) -> u8 {
        match self {
            Deck::None => 0,
            Deck::Base => decks::base::DeckImpl::base_count(),
        }
    }

    #[inline(always)]
    fn achievement_count(self: Deck) -> u8 {
        match self {
            Deck::None => 0,
            Deck::Base => decks::base::DeckImpl::achievement_count(),
        }
    }

    #[inline(always)]
    fn base_sides(self: Deck) -> u128 {
        match self {
            Deck::None => 0,
            Deck::Base => decks::base::DeckImpl::sides(),
        }
    }

    #[inline(always)]
    fn drawables(self: Deck, achievements: u32) -> u128 {
        let cards = match self {
            Deck::None => 0,
            Deck::Base => decks::base::DeckImpl::cards(),
        };
        let power: u128 = fast_power(2_u128, self.base_count().into());
        let achievement_cards: u128 = power * achievements.into();
        let base_cards: u128 = (power - 1) & cards;
        cards & (base_cards + achievement_cards)
    }

    #[inline(always)]
    fn get(self: Deck, index: u8) -> Card {
        match self {
            Deck::None => Card::None,
            Deck::Base => decks::base::DeckImpl::draw(index),
        }
    }

    #[inline(always)]
    fn ids(self: Deck, card: Card) -> Array<u8> {
        match self {
            Deck::None => array![],
            Deck::Base => decks::base::DeckImpl::ids(card),
        }
    }

    #[inline(always)]
    fn draw(self: Deck, packed: u128) -> (u8, u128) {
        let mut card_ids: Array<u8> = Packer::unpack(packed, CARD_BIT_SIZE);
        let id: u8 = card_ids.pop_front().unwrap();
        (id, Packer::pack(card_ids, CARD_BIT_SIZE))
    }

    #[inline(always)]
    fn discard(self: Deck, packed: u128, card_id: u8) -> u128 {
        let mut card_ids: Array<u8> = Packer::unpack(packed, CARD_BIT_SIZE);
        card_ids.append(card_id);
        Packer::pack(card_ids, CARD_BIT_SIZE)
    }

    fn cards(self: Deck, seed: felt252, first: u8, achivements: u32) -> (u8, u128) {
        // [Compute] Draw a cards randomly to design the deck
        let count: u32 = self.count().into();
        let drawables: u128 = self.drawables(achivements);
        let mut drawer: OrigamiDeck = OrigamiDeckTrait::from_bitmap(seed, count, ~drawables);
        let mut cards: Array<u8> = if first == 0 {
            array![]
        } else {
            array![first]
        };
        loop {
            if drawer.remaining == 0 {
                break;
            }
            let card_id = drawer.draw();
            if card_id == first {
                continue;
            }
            cards.append(card_id);
        };
        (cards.len().try_into().unwrap(), SizedPacker::pack(cards, CARD_BIT_SIZE))
    }

    fn sides(self: Deck, mut achievements: u32) -> u128 {
        match self {
            Deck::None => 0,
            Deck::Base => {
                let mut sides: u128 = decks::base::DeckImpl::sides();
                let mut id: u8 = 1;
                loop {
                    if achievements == 0 {
                        break sides;
                    }
                    if achievements % 2 == 1 {
                        // [Effect] Apply achievement effect to the sides
                        let achievement: Achievement = id.into();
                        sides = achievement.sides(self, sides);
                    }
                    id += 1;
                    achievements /= 2;
                }
            },
        }
    }
}

impl IntoDeckFelt252 of core::Into<Deck, felt252> {
    #[inline(always)]
    fn into(self: Deck) -> felt252 {
        match self {
            Deck::None => 'NONE',
            Deck::Base => 'BASE',
        }
    }
}

impl IntoDeckU8 of core::Into<Deck, u8> {
    #[inline(always)]
    fn into(self: Deck) -> u8 {
        match self {
            Deck::None => 0,
            Deck::Base => 1,
        }
    }
}

impl IntoU8Deck of core::Into<u8, Deck> {
    #[inline(always)]
    fn into(self: u8) -> Deck {
        let deck: felt252 = self.into();
        match deck {
            0 => Deck::None,
            1 => Deck::Base,
            _ => Deck::None,
        }
    }
}

impl DeckPrint of core::debug::PrintTrait<Deck> {
    #[inline(always)]
    fn print(self: Deck) {
        let felt: felt252 = self.into();
        felt.print();
    }
}
