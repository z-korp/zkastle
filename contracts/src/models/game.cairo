// Core imports

use core::debug::PrintTrait;
use core::poseidon::{PoseidonTrait, HashState};
use core::hash::HashStateTrait;

// External imports

use alexandria_math::bitmap::Bitmap;

// Inernal imports

use zkastle::constants::{DEFAULT_ROUND_COUNT, DEFAULT_STORE_SIZE, CARD_BIT_SIZE, SIDE_BIT_SIZE};
use zkastle::helpers::packer::SizedPacker;
use zkastle::models::index::Game;
use zkastle::types::action::Action;
use zkastle::types::card::{Card, CardTrait};
use zkastle::types::deck::{Deck, DeckTrait};
use zkastle::types::side::{Side, SideTrait};
use zkastle::types::resource::{Resource, ResourceTrait};

mod errors {
    const GAME_INVALID_HOST: felt252 = 'Game: invalid host';
    const GAME_INVALID_ACTION: felt252 = 'Game: invalid action';
    const GAME_NOT_EXISTS: felt252 = 'Game: does not exist';
    const GAME_IS_OVER: felt252 = 'Game: is over';
    const GAME_NOT_OVER: felt252 = 'Game: not over';
    const GAME_NOT_ENOUGH_RESOURCES: felt252 = 'Game: not enough resources';
    const GAME_STORAGE_IS_FULL: felt252 = 'Game: storage is full';
    const GAME_RESOURCES_NOT_SORTED: felt252 = 'Game: resources not sorted';
}

#[generate_trait]
impl GameImpl of GameTrait {
    #[inline(always)]
    fn new(id: u32) -> Game {
        // [Effect] Create a new game
        let deck: Deck = Deck::Base;
        let mut game = Game {
            id,
            over: false,
            card_one: 0,
            card_two: 0,
            card_three: 0,
            deck: deck.into(),
            move_count: 0,
            pointer: 0,
            store_count: 0,
            stores: 0,
            cards: 0,
            sides: 0,
            indexes: 0,
            seed: 0,
        };
        game.reseed();
        game
    }

    fn resource(self: Game, resources: u16) -> Resource {
        let mut shifted_indexes: Array<u8> = SizedPacker::unpack(
            resources, CARD_BIT_SIZE, self.store_count
        );
        let deck: Deck = self.deck.into();
        let mut resource: Resource = core::Zeroable::zero();
        loop {
            match shifted_indexes.pop_front() {
                Option::Some(shifted_index) => {
                    if shifted_index == 0 {
                        continue;
                    }
                    let index = shifted_index - 1;
                    let card_index: u8 = SizedPacker::get(
                        self.stores, index, CARD_BIT_SIZE, self.store_count
                    );
                    let card: Card = deck.get(card_index);
                    let raw: u8 = SizedPacker::get(
                        self.sides, card_index, SIDE_BIT_SIZE, deck.count()
                    );
                    let side: Side = raw.into();
                    resource = resource + card.resource(side);
                },
                Option::None => { break resource; },
            }
        }
    }

    #[inline(always)]
    fn reseed(ref self: Game) {
        // [Effect] Reseed the game
        let state = PoseidonTrait::new();
        let state = state.update(self.seed);
        let state = state.update(self.id.into());
        self.seed = state.finalize();
    }

    #[inline(always)]
    fn start(ref self: Game) {
        // [Effect] Start the game
        let deck: Deck = self.deck.into();
        let size: u8 = deck.count();
        self.move_count = DEFAULT_ROUND_COUNT * size;

        // [Effect] Draw 3 cards
        self.card_one = self.draw();
        self.card_two = self.draw();
        self.card_three = self.draw();

        // [Effect] Update seed
        self.reseed();
    }

    #[inline(always)]
    fn perform(ref self: Game, action: Action, choice: bool, resources: u16) {
        // [Check] Only card one can be discarded
        assert(action != Action::Discard || choice, errors::GAME_INVALID_ACTION);

        // [Check] Card can be performed
        let index: u8 = match choice {
            true => self.card_one.into(),
            false => self.card_two.into(),
        };
        let deck: Deck = self.deck.into();
        let card: Card = self.discard(index);
        let raw: u8 = SizedPacker::get(self.sides, index, SIDE_BIT_SIZE, deck.count());
        let side: Side = raw.into();
        assert(card.can(side, action), errors::GAME_INVALID_ACTION);

        // [Check] Affordable
        self.assert_is_affordable(resources, card.cost(side, action));

        // [Effect] Unstore selected resources
        // [Info] It reverts if resource not previously stored
        self.unstores(resources);

        // [Effect] Store action
        if action == Action::Store {
            self.store(index);
        }

        // [Effect] Update card side
        let value: u8 = side.update(action).into();
        let (sides, _) = SizedPacker::replace(
            self.sides, index, SIDE_BIT_SIZE, value, deck.count()
        );
        self.sides = sides;

        // [Effect] Draw a new card
        match choice {
            true => {
                self.card_one = self.card_two;
                self.card_two = self.card_three;
                self.card_three = self.draw();
            },
            false => {
                self.card_two = self.card_three;
                self.card_three = self.draw();
            }
        };

        // [Effect] Assess game over
        self.over = self.move_count == 0;
    }

    fn draw(ref self: Game) -> u8 {
        let deck: Deck = self.deck.into();
        // [Check] Draw randomly if all cards has not yet be drawn once
        let index = if self.move_count > (DEFAULT_ROUND_COUNT - 1) * deck.count() {
            // [Effect] Draw a card randomly
            let index = deck.random_draw(self.seed, self.cards.into());
            self.cards = Bitmap::set_bit_at(self.cards, index, true);
            if deck.is_empty(self.cards.into()) {
                self.cards = 0
            };
            self.move_count -= 1;
            index
        } else {
            // [Effect] Draw a card orderly
            self.move_count -= 1;
            let pointer = (self.pointer + 2) % deck.count();
            deck.ordered_draw(self.indexes, pointer)
        };

        // [Check] Card is not stored, otherwise unstore, discard and draw again
        if SizedPacker::contains(self.stores, index, CARD_BIT_SIZE, self.store_count) {
            self.unstore(index);
            self.discard(index);
            return self.draw();
        }
        index
    }

    fn discard(ref self: Game, index: u8) -> Card {
        // [Effect] Update indexes at index
        let deck: Deck = self.deck.into();
        let (indexes, _) = SizedPacker::replace(
            self.indexes, self.pointer, CARD_BIT_SIZE, index, deck.count()
        );
        self.indexes = indexes;
        // [Effect] Update pointer
        self.pointer = if self.pointer + 1 == deck.count() {
            0
        } else {
            self.pointer + 1
        };
        // [Return] Discarded Card
        deck.get(index)
    }

    #[inline(always)]
    fn store(ref self: Game, index: u8) {
        // [Check] Enough place to store
        self.assert_is_storable();
        // [Effect] Update stores
        let mut stores: Array<u8> = SizedPacker::unpack(
            self.stores, CARD_BIT_SIZE, self.store_count
        );
        stores.append(index);
        self.store_count += 1;
        self.stores = SizedPacker::pack(stores, CARD_BIT_SIZE);
    }

    #[inline(always)]
    fn unstore(ref self: Game, index: u8) {
        // [Effect] Remove last stored resource
        let (stores, _): (u16, u8) = SizedPacker::remove(
            self.stores, index, CARD_BIT_SIZE, self.store_count
        );
        self.store_count -= 1;
        self.stores = stores;
    }

    fn unstores(ref self: Game, resources: u16) {
        // [Effect] Remove resources from store
        let mut shited_indexes: Array<u8> = SizedPacker::unpack(
            resources, CARD_BIT_SIZE, self.store_count
        );
        let mut previous = DEFAULT_STORE_SIZE;
        loop {
            match shited_indexes.pop_front() {
                Option::Some(shited_index) => {
                    if shited_index == 0 {
                        break;
                    }
                    let index = shited_index - 1;
                    assert(index < previous, errors::GAME_RESOURCES_NOT_SORTED);
                    self.unstore(index);
                    previous = index;
                },
                Option::None => { break; },
            }
        };
    }
}

impl ZeroableGame of core::Zeroable<Game> {
    #[inline(always)]
    fn zero() -> Game {
        Game {
            id: 0,
            over: false,
            card_one: 0,
            card_two: 0,
            card_three: 0,
            deck: 0,
            move_count: 0,
            pointer: 0,
            store_count: 0,
            stores: 0,
            cards: 0,
            sides: 0,
            indexes: 0,
            seed: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: Game) -> bool {
        0 == self.seed.into()
    }

    #[inline(always)]
    fn is_non_zero(self: Game) -> bool {
        !self.is_zero()
    }
}

#[generate_trait]
impl GameAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Game) {
        assert(self.is_non_zero(), errors::GAME_NOT_EXISTS);
    }

    #[inline(always)]
    fn assert_not_over(self: Game) {
        assert(!self.over, errors::GAME_IS_OVER);
    }

    #[inline(always)]
    fn assert_is_over(self: Game) {
        assert(self.over || self.is_zero(), errors::GAME_NOT_OVER);
    }

    #[inline(always)]
    fn assert_valid_host(host: felt252) {
        assert(host != 0, errors::GAME_INVALID_HOST);
    }

    fn assert_is_affordable(self: Game, resources: u16, mut costs: Array<Resource>) {
        // [Check] No check if there is no cost
        if costs.is_empty() {
            return;
        }

        // [Check] At least one individual cost affordable
        let mut resource: Resource = self.resource(resources);
        let affordable = loop {
            match costs.pop_front() {
                Option::Some(cost) => { if resource >= cost {
                    break true;
                } },
                Option::None => { break false; },
            }
        };
        assert(affordable, errors::GAME_NOT_ENOUGH_RESOURCES);
    }

    #[inline(always)]
    fn assert_is_storable(self: Game) {
        assert(self.store_count < DEFAULT_STORE_SIZE, errors::GAME_STORAGE_IS_FULL);
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use core::debug::PrintTrait;

    // Local imports

    use super::{Game, GameTrait, AssertTrait, Action, Resource, ResourceTrait};

    #[test]
    fn test_game_new() {
        // Deck: 0xab0598c6fe1234d7
        let game = GameTrait::new(1);
        game.assert_exists();
        game.assert_not_over();
        assert(game.seed.into() > 0_u256, 'Game: seed is zero');
    }

    #[test]
    fn test_game_start() {
        let mut game = GameTrait::new(1);
        let seed = game.seed;
        game.start();
        // Cards: 0010000010010000
        // Card 1: Mine = 0x7
        // Card 2: Forge = 0xd
        // Card 3: Quarry = 0x4
        assert(game.card_one + game.card_two + game.card_three > 0, 'Game: cards are zero');
        assert(seed != game.seed, 'Game: seed is the same');
        assert(game.cards == 0x2090, 'Game: seed is the same');
    }

    #[test]
    fn test_game_play_quarry() {
        let mut game = GameTrait::new(1);
        game.start();
        // Cards: 0010000010010000
        // Card 1: Mine = 0x7
        // Card 2: Forge = 0xd
        // Card 3: Quarry = 0x4
        game.perform(Action::Discard, true, 0);
        // Cards: 0010000010011000
        // Card 1: Forge = 0xd
        // Card 2: Quarry = 0x4
        // Card 3: Quarry = 0x3
        game.perform(Action::Store, false, 0);
        // Cards: 0010000010011100
        // Card 1: Forge = 0xd
        // Card 2: Quarry = 0x3
        // Card 3: Farm = 0x2
        assert(game.resource(0x1) == ResourceTrait::new(0, 1, 0), 'Game: unexpected resource');
    }

    #[test]
    fn test_game_play_store_twice() {
        let mut game = GameTrait::new(1);
        game.start();
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, true, 0);
        game.perform(Action::Store, true, 0);
        assert(game.stores == 0x34, 'Game: unexpected stores');
    }

    #[test]
    fn test_game_play_rotate() {
        let mut game = GameTrait::new(1);
        game.start();
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, true, 0); // Stone
        game.perform(Action::Store, true, 0); // Stone
        game.perform(Action::Store, true, 0); // Wheat
        assert(game.stores == 0x234, 'Game: unexpected stores');
        game.perform(Action::Rotate, true, 0x3);
        assert(game.stores == 0x34, 'Game: unexpected stores');
    }

    #[test]
    fn test_game_play_flip() {
        let mut game = GameTrait::new(1);
        game.start();
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, true, 0); // Stone
        game.perform(Action::Store, true, 0); // Stone
        game.perform(Action::Store, true, 0); // Wheat
        assert(game.stores == 0x234, 'Game: unexpected stores');
        game.perform(Action::Flip, true, 0x3);
        assert(game.stores == 0x34, 'Game: unexpected stores');
    }

    #[test]
    fn test_game_play_case_01() {
        let mut game = GameTrait::new(1);
        game.start();
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, true, 0); // Stone
        game.perform(Action::Store, true, 0); // Stone
        game.perform(Action::Store, true, 0); // Wheat
        game.perform(Action::Rotate, true, 0x3); // Wheat
        game.perform(Action::Discard, true, 0); // Tavern
        game.perform(Action::Store, true, 0x12); // Citadel
    }

    #[test]
    #[should_panic(expected: ('Game: resources not sorted',))]
    fn test_game_play_case_01_revert_not_sorted() {
        let mut game = GameTrait::new(1);
        game.start();
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, true, 0); // Stone
        game.perform(Action::Store, true, 0); // Stone
        game.perform(Action::Store, true, 0); // Wheat
        game.perform(Action::Rotate, true, 0x3); // Wheat
        game.perform(Action::Discard, true, 0); // Tavern
        game.perform(Action::Store, true, 0x21); // Citadel
    }

    #[test]
    fn test_game_play_store_multi_ressources() {
        let mut game = GameTrait::new(1);
        game.start();
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, true, 0); // Stone
        game.perform(Action::Discard, true, 0); // Stone
        game.perform(Action::Discard, true, 0); // Wheat
        game.perform(Action::Discard, true, 0); // Wheat
        game.perform(Action::Store, true, 0x1); // Tavern
    }

    #[test]
    fn test_game_play_until_over() {
        let mut game = GameTrait::new(1);
        game.start();
        loop {
            if game.over {
                break;
            }
            game.perform(Action::Discard, true, 0);
        };
    }
}
