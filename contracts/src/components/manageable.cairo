//! Manageable component

#[starknet::component]
mod ManageableComponent {
    // Starknet imports

    use starknet::ContractAddress;
    use starknet::info::get_caller_address;

    // Dojo imports

    use dojo::world::IWorldDispatcher;

    // Internal imports

    use zkastle::store::{Store, StoreImpl};
    use zkastle::models::player::{Player, PlayerTrait, PlayerAssert};

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
        fn _create(self: @ComponentState<TContractState>, world: IWorldDispatcher, name: felt252,) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Player not already exists
            let caller = get_caller_address();
            let player = store.player(caller.into());
            player.assert_not_exists();

            // [Effect] Create a new player
            let player = PlayerTrait::new(caller.into(), name);
            store.set_player(player);
        }

        fn _rename(self: @ComponentState<TContractState>, world: IWorldDispatcher, name: felt252,) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Player exists
            let caller = get_caller_address();
            let mut player = store.player(caller.into());
            player.assert_exists();

            // [Effect] Create a new player
            player.rename(name);
            store.set_player(player);
        }

        fn _select(self: @ComponentState<TContractState>, world: IWorldDispatcher, card_id: u8,) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Player exists
            let caller = get_caller_address();
            let mut player = store.player(caller.into());
            player.assert_exists();

            // [Effect] Select the card
            player.select(card_id);
            store.set_player(player);
        }

        fn _enable(
            self: @ComponentState<TContractState>,
            world: IWorldDispatcher,
            achivement_id: u8,
            enabled: bool,
        ) {
            // [Setup] Datastore
            let store: Store = StoreImpl::new(world);

            // [Check] Player exists
            let caller = get_caller_address();
            let mut player = store.player(caller.into());
            player.assert_exists();

            // [Effect] Update the achievement enable status
            player.enable(achivement_id, enabled);
            store.set_player(player);
        }
    }
}
