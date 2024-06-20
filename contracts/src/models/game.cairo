use core::array::ArrayTrait;
// Core imports

use core::debug::PrintTrait;
use core::poseidon::{PoseidonTrait, HashState};
use core::hash::HashStateTrait;

// External imports

use alexandria_math::bitmap::Bitmap;
use origami::random::deck::{Deck as OrigamiDeck, DeckTrait as OrigamiDeckTrait};

// Inernal imports

use zkastle::constants::{DEFAULT_ROUND_COUNT, DEFAULT_STORE_SIZE, CARD_BIT_SIZE, SIDE_BIT_SIZE};
use zkastle::helpers::packer::{Packer, SizedPacker};
use zkastle::models::index::Game;
use zkastle::types::action::Action;
use zkastle::types::card::{Card, CardTrait};
use zkastle::types::deck::{Deck, DeckTrait};
use zkastle::types::side::{Side, SideTrait};
use zkastle::types::resource::{Resource, ResourceTrait};
use zkastle::types::achievement::{Achievement, AchievementTrait};

mod errors {
    const GAME_INVALID_HOST: felt252 = 'Game: invalid host';
    const GAME_INVALID_ACTION: felt252 = 'Game: invalid action';
    const GAME_NOT_EXISTS: felt252 = 'Game: does not exist';
    const GAME_IS_OVER: felt252 = 'Game: is over';
    const GAME_NOT_OVER: felt252 = 'Game: not over';
    const GAME_NOT_ENOUGH_RESOURCES: felt252 = 'Game: not enough resources';
    const GAME_STORAGE_IS_FULL: felt252 = 'Game: storage is full';
    const GAME_RESOURCE_ALREADY_STORED: felt252 = 'Game: resource already stored';
    const GAME_CONDITION_NOT_FULFILLED: felt252 = 'Game: condition not fulfilled';
}

#[generate_trait]
impl GameImpl of GameTrait {
    #[inline(always)]
    fn new(id: u32, player_id: felt252, first_card_id: u8, achievements: u32) -> Game {
        // [Compute] Seed
        let state = PoseidonTrait::new();
        let state = state.update(id.into());
        let seed = state.finalize();

        // [Effect] Create a new game
        let deck: Deck = Deck::Base;
        let (count, cards) = deck.cards(seed, first_card_id, achievements);
        let sides = deck.sides(achievements);
        let mut game = Game {
            id,
            over: false,
            card_one: 0,
            card_two: 0,
            card_three: 0,
            deck: deck.into(),
            move_count: DEFAULT_ROUND_COUNT * count.into(),
            achievements,
            stores: 0,
            sides,
            cards,
            player_id,
        };
        game
    }

    fn resource(self: Game, resources: u32) -> Resource {
        let mut card_ids: Array<u8> = Packer::unpack(resources, CARD_BIT_SIZE);
        let deck: Deck = self.deck.into();
        let mut resource: Resource = core::Zeroable::zero();
        loop {
            match card_ids.pop_front() {
                Option::Some(card_id) => {
                    let side: Side = self.side(card_id);
                    let card = deck.get(card_id);
                    resource = resource + card.resource(side);
                },
                Option::None => { break resource; },
            }
        }
    }

    fn score(self: Game) -> u8 {
        let deck: Deck = self.deck.into();
        let sides: Array<u8> = SizedPacker::unpack(self.sides, SIDE_BIT_SIZE, deck.count());
        let mut score: u8 = 0;
        let mut id: u8 = deck.count();
        loop {
            if id == 0 {
                break;
            }
            let index = id - 1;
            let side: Side = (*sides.at(index.into())).into();
            let card: Card = deck.get(id);
            score += card.score(side);
            id -= 1;
        };
        score
    }

    #[inline(always)]
    fn start(ref self: Game) {
        // [Effect] Draw 3 cards
        self.card_one = self.draw();
        self.card_two = self.draw();
        self.card_three = self.draw();
    }

    #[inline(always)]
    fn perform(ref self: Game, action: Action, choice: bool, resources: u32) {
        // [Check] Only card one can be discarded
        assert(action != Action::Discard || choice, errors::GAME_INVALID_ACTION);

        // [Check] Card one is stored then unstore, discard and draw again
        if Packer::contains(self.stores, self.card_one, CARD_BIT_SIZE) {
            // [Check] Only acceptable action is to discard the card one
            assert(action == Action::Discard && choice, errors::GAME_INVALID_ACTION);
            // [Effect] Unstore card one
            self.unstore(self.card_one);
        }

        // [Check] Card can be performed
        let card_id: u8 = match choice {
            true => self.card_one,
            false => self.card_two,
        };
        let card: Card = self.discard(card_id);
        let side: Side = self.side(card_id);
        assert(card.can(side, action), errors::GAME_INVALID_ACTION);

        // [Check] Card condition is filled
        let deck: Deck = self.deck.into();
        assert(
            card.condition(side, action, deck, self.sides), errors::GAME_CONDITION_NOT_FULFILLED
        );

        // [Check] Affordable
        self.assert_is_affordable(resources, card.cost(side, action));

        // [Effect] Unstore selected resources
        // [Info] It reverts if resource not previously stored
        self.unstores(resources);

        // [Effect] Store action
        if action == Action::Store {
            self.store(card_id);
        }

        // [Effect] Update card side
        self.update(card_id, action);

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
        self.assess_over();
    }

    #[inline(always)]
    fn draw(ref self: Game) -> u8 {
        if self.move_count == 0 {
            return 0;
        }
        // [Effect] Draw the first card and update the cards map
        let deck: Deck = self.deck.into();
        let (card_id, cards) = deck.draw(self.cards);
        self.cards = cards;
        // [Effect] Decrease move count
        self.move_count -= 1;
        // [Return] Card id
        card_id
    }

    #[inline(always)]
    fn discard(ref self: Game, card_id: u8) -> Card {
        // [Effect] Discard the card
        let deck: Deck = self.deck.into();
        self.cards = deck.discard(self.cards, card_id);
        // [Return] Card
        deck.get(card_id)
    }

    #[inline(always)]
    fn side(self: Game, card_id: u8) -> Side {
        let deck: Deck = self.deck.into();
        let index = card_id - 1;
        let side: u8 = SizedPacker::get(self.sides, index, SIDE_BIT_SIZE, deck.count());
        side.into()
    }

    #[inline(always)]
    fn update(ref self: Game, card_id: u8, action: Action) {
        let deck: Deck = self.deck.into();
        let index = card_id - 1;
        let side: Side = self.side(card_id);
        let card: Card = deck.get(card_id);
        let value: u8 = card.update(side, action).into();
        self.sides = SizedPacker::replace(self.sides, index, SIDE_BIT_SIZE, value, deck.count());
    }

    #[inline(always)]
    fn store(ref self: Game, card_id: u8) {
        // [Check] Enough place to store
        let mut stores: Array<u8> = Packer::unpack(self.stores, CARD_BIT_SIZE);
        self.assert_is_storable(stores.len());
        // [Check] Resource not alredy stored
        let is_stored = Packer::contains(self.stores, card_id, CARD_BIT_SIZE);
        assert(!is_stored, errors::GAME_RESOURCE_ALREADY_STORED);
        // [Effect] Update stores
        stores.append(card_id);
        self.stores = Packer::pack(stores, CARD_BIT_SIZE);
    }

    #[inline(always)]
    fn unstore(ref self: Game, card_id: u8) {
        // [Effect] Remove last stored resource
        self.stores = Packer::remove(self.stores, card_id, CARD_BIT_SIZE);
    }

    fn unstores(ref self: Game, resources: u32) {
        // [Effect] Remove resources from store
        let mut card_ids: Array<u8> = Packer::unpack(resources, CARD_BIT_SIZE);
        loop {
            match card_ids.pop_front() {
                Option::Some(card_id) => { self.unstore(card_id); },
                Option::None => { break; },
            }
        };
    }

    #[inline(always)]
    fn assess_over(ref self: Game) {
        // [Effect] Over if no move left and card one is zero
        self.over = self.move_count == 0 && self.card_one == 0;
    }

    fn assess_achievements(self: Game) -> u32 {
        // [Check] Game is over
        self.assert_is_over();
        // [Compute] Achievements
        let deck: Deck = self.deck.into();
        let score = 0;
        let mut achievements: u32 = 0;
        let mut id = deck.achievement_count();
        loop {
            if id == 0 {
                break;
            }
            // [Check] Achievement already achieved
            let index = id - 1;
            if Bitmap::get_bit_at(achievements, index) {
                continue;
            }
            let achievement: Achievement = id.into();
            if achievement.condition(deck, self.sides, self.stores, score) {
                achievements = Bitmap::set_bit_at(achievements, index, true);
            }
            id = index;
        };
        achievements
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
            achievements: 0,
            stores: 0,
            sides: 0,
            cards: 0,
            player_id: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: Game) -> bool {
        0 == self.player_id
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

    fn assert_is_affordable(self: Game, resources: u32, mut costs: Array<Resource>) {
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
    fn assert_is_storable(self: Game, count: u32) {
        assert(count < DEFAULT_STORE_SIZE.into(), errors::GAME_STORAGE_IS_FULL);
    }
}

#[cfg(test)]
mod tests {
    // Core imports

    use core::debug::PrintTrait;

    // Local imports

    use super::{Game, GameTrait, AssertTrait, Action, Resource, ResourceTrait};

    // Constants

    const GAME_ID: u32 = 1;
    const PLAYER_ID: felt252 = 'PLAYER';
    const FIRST_CARD_ID: u8 = 1;
    const ACHIEVEMENTS: u32 = 0;
    const FULL_ACHIEVEMENTS: u32 = 0x1ff; // b111111111

    #[test]
    fn test_game_new_no_achievements() {
        // Deck: 0xab0598c6fe1234d7
        let game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.assert_exists();
        game.assert_not_over();
        // Expecting 16 cards drawn, each packed on a 5 bit map
        // So cards must be between 17 * 5 = 85 and 15 * 5 = 75
        assert_eq!(game.cards > 0x8000000000000000000, true);
        assert_eq!(game.cards < 0x2000000000000000000000, true);
        // Expecting the 16 cards to be side one at beginning
        assert_eq!(game.sides, 0x9249249249249249);
    }

    #[test]
    fn test_game_new_full_achievements() {
        // Deck: 0xab0598c6fe1234d7
        let game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, FULL_ACHIEVEMENTS);
        game.assert_exists();
        game.assert_not_over();
        // Expecting 22 cards, each packed on a 5 bit map
        // So cards must be between 23 * 5 = 115 and 21 * 5 = 105
        assert_eq!(game.cards > 0x200000000000000000000000000, true);
        assert_eq!(game.cards < 0x80000000000000000000000000000, true);
        // Expecting the 22 cards to be side one at beginning, except
        assert_eq!(game.sides, 0x924924924924944A);
    }

    #[test]
    fn test_game_start() {
        let mut game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.start();
        assert(game.card_one + game.card_two + game.card_three > 0, 'Game: cards are zero');
    }

    #[test]
    fn test_game_play_quarry() {
        let mut game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.start();
        // Card 1: Quarry = 0x6
        // Card 2: Tower = 0xd
        // Card 3: Mine = 0x8
        game.perform(Action::Store, true, 0);
        game.perform(Action::Discard, true, 0);
        assert(game.resource(0x6) == ResourceTrait::new(0, 1, 0), 'Game: unexpected resource');
    }

    #[test]
    fn test_game_play_multiple_store() {
        let mut game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.start();
        // Card 1: Farm = 0x1
        // Card 2: Quarry = 0x6
        // Card 3: Tower = 0xd
        // Card 4: Mine = 0x8
        // Card 5: Farm = 0x2
        // Card 6: Quarry = 0x4
        // Card 7: Monastery = 0xa
        // Card 8: Mine = 0x9
        // Card 9: Farm = 0x3
        // Card 10: Tower = 0xc
        // Card 11: ? = 0xe
        // Card 12: ? = 0x7
        // Card 13: ? = 0xb
        // Card 14: ? = 0x10
        // Card 15: ? = 0xf
        // Card 16: ? = 0x5
        game.perform(Action::Store, true, 0);
        game.perform(Action::Store, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, true, 0);
        game.perform(Action::Store, true, 0);
        game.perform(Action::Discard, true, 0);
        assert_eq!(game.stores, 0b00100_00010_00110_00001);
    }

    #[test]
    fn test_game_play_rotate() {
        let mut game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.start();
        // Card 1: Farm = 0x1
        // Card 2: Quarry = 0x6
        // Card 3: Tower = 0xd
        // Card 4: Mine = 0x8
        // Card 5: Farm = 0x2
        // Card 6: Quarry = 0x4
        // Card 7: Monastery = 0xa
        // Card 8: Mine = 0x9
        // Card 9: Farm = 0x3
        // Card 10: Tower = 0xc
        // Card 11: ? = 0xe
        // Card 12: ? = 0x7
        // Card 13: ? = 0xb
        // Card 14: ? = 0x10
        // Card 15: ? = 0xf
        // Card 16: ? = 0x5
        game.perform(Action::Store, true, 0);
        game.perform(Action::Store, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, false, 0);
        game.perform(Action::Store, false, 0);
        game.perform(Action::Rotate, true, 0b00100_00110);
        assert(game.stores == 0b00010_00001, 'Game: unexpected stores');
    }

    #[test]
    fn test_game_play_flip() {
        let mut game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.start();
        // Card 1: Farm = 0x1
        // Card 2: Quarry = 0x6
        // Card 3: Tower = 0xd
        // Card 4: Mine = 0x8
        // Card 5: Farm = 0x2
        // Card 6: Quarry = 0x4
        // Card 7: Monastery = 0xa
        // Card 8: Mine = 0x9
        // Card 9: Farm = 0x3
        // Card 10: Tower = 0xc
        // Card 11: ? = 0xe
        // Card 12: ? = 0x7
        // Card 13: ? = 0xb
        // Card 14: ? = 0x10
        // Card 15: ? = 0xf
        // Card 16: ? = 0x5
        game.perform(Action::Store, true, 0); // +1 Wheat
        game.perform(Action::Store, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, false, 0); // +1 Wheat
        game.perform(Action::Flip, true, 0b00010_00001);
        assert(game.stores == 0b00110, 'Game: unexpected stores');
    }

    #[test]
    fn test_game_play_store_discard_old_storage() {
        let mut game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.start();
        // Card 1: Farm = 0x1
        game.perform(Action::Store, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
    }

    #[test]
    #[should_panic(expected: ('Game: invalid action',))]
    fn test_game_play_store_discard_old_storage_revert_invalid_action() {
        let mut game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.start();
        // Card 1: Farm = 0x1
        game.perform(Action::Store, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Discard, true, 0);
        game.perform(Action::Store, true, 0);
    }

    #[test]
    fn test_game_play_until_over() {
        let mut game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.start();
        loop {
            if game.card_one == 0 {
                break;
            }
            game.perform(Action::Discard, true, 0);
        };
        assert_eq!(game.over, true);
    }

    #[test]
    fn test_game_assess_achievements() {
        let mut game = GameTrait::new(GAME_ID, PLAYER_ID, FIRST_CARD_ID, ACHIEVEMENTS);
        game.start();
        game.over = true;
        game.assess_achievements();
        assert_eq!(game.over, true);
    }
}
