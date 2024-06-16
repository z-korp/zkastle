// External imports

use alexandria_math::bitmap::Bitmap;
use alexandria_math::fast_power::fast_power;
use origami::random::deck::{Deck as OrigamiDeck, DeckTrait as OrigamiDeckTrait};

// Internal imports

use zkastle::constants::CARD_BIT_SIZE;
use zkastle::helpers::packer::SizedPacker;
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
    fn is_empty(self: Deck, bitmap: u128) -> bool {
        match self {
            Deck::None => false,
            Deck::Base => fast_power(2_u128, self.count().into()) - 1 == bitmap,
        }
    }

    #[inline(always)]
    fn random_draw(self: Deck, seed: felt252, bitmap: u128) -> u8 {
        let mut drawer: OrigamiDeck = OrigamiDeckTrait::from_bitmap(
            seed, self.count().into(), bitmap
        );
        drawer.draw() - 1
    }

    #[inline(always)]
    fn ordered_draw(self: Deck, indexes: u64, index: u8) -> u8 {
        let indexes: Array<u8> = SizedPacker::unpack(indexes, CARD_BIT_SIZE, self.count().into());
        *indexes.at(index.into())
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
