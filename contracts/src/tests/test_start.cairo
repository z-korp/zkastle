// Core imports

use core::debug::PrintTrait;

// Starknet imports

use starknet::testing::{set_contract_address, set_transaction_hash};

// Dojo imports

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// Internal imports

use zkastle::constants;
use zkastle::store::{Store, StoreTrait};
use zkastle::models::game::{Game, GameTrait};
use zkastle::models::player::{Player, PlayerTrait};
use zkastle::systems::actions::IActionsDispatcherTrait;

// Test imports

use zkastle::tests::setup::{setup, setup::{Systems, PLAYER}};

#[test]
fn test_actions_spawn() {
    // [Setup]
    let (world, _, context) = setup::spawn_game();
    let store = StoreTrait::new(world);

    // [Assert]
    let game = store.game(context.game_id);
    assert(game.id == context.game_id, 'Game: id');
}
