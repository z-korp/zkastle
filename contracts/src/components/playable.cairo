// Component

#[starknet::component]
mod PlayableComponent {
    // Starknet imports

    use zkastle::models::game::AssertTrait;
    use zkastle::store::StoreTrait;
    use starknet::ContractAddress;
    use starknet::info::{get_contract_address, get_caller_address, get_block_timestamp};

    // Dojo imports

    use dojo::world::IWorldDispatcher;
    use dojo::world::IWorldDispatcherTrait;

    // Internal imports

    use zkastle::constants;
    use zkastle::store::{Store, StoreImpl};
    use zkastle::models::game::{Game, GameTrait, GameAssert};
    use zkastle::models::player::{Player, PlayerTrait, PlayerAssert};
    use zkastle::types::action::Action;

    // Storage

    #[storage]
    struct Storage {}

    // Events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {}

    #[generate_trait]
    impl InternalImpl<
        TContractState, +HasComponent<TContractState>
    > of InternalTrait<TContractState> {
        fn _start(self: @ComponentState<TContractState>, world: IWorldDispatcher) -> u32 {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Player exists
            let caller = get_caller_address();
            let mut player = store.player(caller.into());
            player.assert_exists();

            // [Check] Game is over
            let game = store.game(player.game_id);
            game.assert_is_over();

            // [Effect] Create game
            let game_id: u32 = world.uuid() + 1;
            let mut game = GameTrait::new(game_id);
            game.start();
            store.set_game(game);

            // [Effect] Update player
            player.game_id = game_id;
            store.set_player(player);

            // [Return] Game id
            game_id
        }

        fn _play(
            self: @ComponentState<TContractState>,
            world: IWorldDispatcher,
            action: Action,
            choice: bool,
            resources: u16
        ) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Player exists
            let caller = get_caller_address();
            let player = store.player(caller.into());
            player.assert_exists();

            // [Check] Game exists
            let mut game = store.game(player.game_id);
            game.assert_exists();

            // [Effect] Perform action
            game.perform(action, choice, resources);

            // [Effect] Update game
            store.set_game(game);
        }
    }
}
