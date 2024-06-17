// External imports

use origami::random::deck::{Deck as OrigamiDeck, DeckTrait as OrigamiDeckTrait};

// Internal imports

use zkastle::constants::CARD_BIT_SIZE;
use zkastle::helpers::packer::{Packer, SizedPacker};
use zkastle::elements::decks;
use zkastle::types::card::Card;

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
    fn get(self: Deck, index: u8) -> Card {
        match self {
            Deck::None => Card::None,
            Deck::Base => decks::base::DeckImpl::draw(index),
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

    fn setup(self: Deck, seed: felt252) -> u128 {
        // [Compute] Draw a cards randomly to design the deck
        let count: u32 = self.count().into();
        let mut drawer: OrigamiDeck = OrigamiDeckTrait::new(seed, count);
        let mut cards: Array<u8> = array![];
        loop {
            if drawer.remaining == 0 {
                break;
            }
            cards.append(drawer.draw());
        };
        SizedPacker::pack(cards, CARD_BIT_SIZE)
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
