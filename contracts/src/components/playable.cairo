// Component

#[starknet::component]
mod PlayableComponent {
    // Starknet imports

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
            let player = store.player(caller.into());
            player.assert_exists();

            // [Effect] Create game
            let game_id = world.uuid() + 1;
            let mut game = GameTrait::new(game_id, player.id);

            // [Effect] Start game
            game.start();

            // [Effect] Update game
            store.set_game(game);

            // [Return] Game id
            game_id
        }

        fn _play(
            self: @ComponentState<TContractState>,
            world: IWorldDispatcher,
            game_id: u32,
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
            let mut game = store.game(game_id);
            game.assert_exists();

            // [Check] Player is host
            game.assert_is_host(player.id);

            // [Effect] Perform action
            game.perform(action, choice, resources);

            // [Effect] Update game
            store.set_game(game);
        }
    }
}
