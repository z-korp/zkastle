// External imports

use alexandria_math::bitmap::Bitmap;

// Inernal imports

use zkastle::constants;
use zkastle::models::index::Player;
use zkastle::types::card::{Card, CardTrait};
use zkastle::types::deck::{Deck, DeckTrait};
use zkastle::types::achievement::{Achievement, AchievementTrait};

mod errors {
    const PLAYER_NOT_EXIST: felt252 = 'Player: Does not exist';
    const PLAYER_ALREADY_EXIST: felt252 = 'Player: Already exist';
    const PLAYER_INVALID_CARD: felt252 = 'Player: Invalid card';
    const PLAYER_ACHIEVEMENT_LOCKED: felt252 = 'Player: Achievement locked';
    const INVALID_NAME: felt252 = 'Player: Invalid name';
    const INVALID_MASTER: felt252 = 'Player: Invalid master';
    const INVALID_ORDER: felt252 = 'Player: Invalid order';
    const NO_TILES_LEFT: felt252 = 'Player: No tiles left';
    const TOO_MUCH_TILES: felt252 = 'Player: Too much tiles';
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    #[inline(always)]
    fn new(id: felt252, name: felt252) -> Player {
        // [Check] Name is valid
        assert(name != 0, errors::INVALID_NAME);
        // [Return] Player
        Player {
            id, game_id: 0, card_id: 0, achievements: 0, enables: constants::DEFAULT_ENABLES, name,
        }
    }

    #[inline(always)]
    fn rename(ref self: Player, name: felt252) {
        // [Check] Name is valid
        assert(name != 0, errors::INVALID_NAME);
        // [Effect] Change the name
        self.name = name;
    }

    #[inline(always)]
    fn select(ref self: Player, card_id: u8) {
        // [Check] Card is selectable
        self.assert_is_selectable(card_id);
        // [Effect] Change the card
        self.card_id = card_id;
    }

    #[inline(always)]
    fn enable(ref self: Player, achivement_id: u8, enable: bool) {
        // [Check] Achievement is enableable
        self.assert_is_enableable(achivement_id);
        // [Effect] Change the card
        let index = achivement_id - 1;
        self.enables = Bitmap::set_bit_at(self.enables, index, enable);
    }
}

#[generate_trait]
impl PlayerAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Player) {
        assert(self.is_non_zero(), errors::PLAYER_NOT_EXIST);
    }

    #[inline(always)]
    fn assert_not_exists(self: Player) {
        assert(self.is_zero(), errors::PLAYER_ALREADY_EXIST);
    }

    #[inline(always)]
    fn assert_is_selectable(self: Player, card_id: u8) {
        // [Check] Card is a valid one
        let deck: Deck = Deck::Base;
        let card: u8 = deck.get(card_id).into();
        assert(card != Card::None.into(), errors::PLAYER_INVALID_CARD);
        // [Check] Oracle Stone is unlocked
        let index = Achievement::OracleStone.index();
        assert(Bitmap::get_bit_at(self.achievements, index), errors::PLAYER_ACHIEVEMENT_LOCKED);
        // [Check] The selected card got its achievement unlocked if it exists
        let card: Card = card.into();
        let achievement: Achievement = card.achievement();
        let achievement_id: u8 = achievement.into();
        if (achievement_id == 0) {
            return;
        }
        let index = achievement.index();
        assert(Bitmap::get_bit_at(self.achievements, index), errors::PLAYER_ACHIEVEMENT_LOCKED);
    }

    #[inline(always)]
    fn assert_is_enableable(self: Player, achivement_id: u8) {
        let index = achivement_id - 1;
        assert(Bitmap::get_bit_at(self.achievements, index), errors::PLAYER_ACHIEVEMENT_LOCKED);
    }
}

impl ZeroablePlayerImpl of core::Zeroable<Player> {
    #[inline(always)]
    fn zero() -> Player {
        Player { id: 0, game_id: 0, card_id: 0, achievements: 0, enables: 0, name: 0 }
    }

    #[inline(always)]
    fn is_zero(self: Player) -> bool {
        0 == self.name
    }

    #[inline(always)]
    fn is_non_zero(self: Player) -> bool {
        !self.is_zero()
    }
}

