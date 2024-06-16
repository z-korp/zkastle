// Starknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::IWorldDispatcher;

// Internal imports

use zkastle::types::action::Action;

// Interfaces

#[starknet::interface]
trait IActions<TContractState> {
    fn create(self: @TContractState, world: IWorldDispatcher, name: felt252);
    fn start(self: @TContractState, world: IWorldDispatcher) -> u32;
    fn play(
        self: @TContractState, world: IWorldDispatcher, action: Action, choice: bool, resources: u16
    );
}

// Contracts

#[starknet::contract]
mod actions {
    // Dojo imports

    use zkastle::components::manageable::ManageableComponent::InternalTrait;
    use dojo::world;
    use dojo::world::IWorldDispatcher;
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::IDojoResourceProvider;

    // Component imports

    use zkastle::components::initializable::InitializableComponent;
    use zkastle::components::manageable::ManageableComponent;
    use zkastle::components::playable::PlayableComponent;

    // Local imports

    use super::{IActions, Action};

    // Components

    component!(path: InitializableComponent, storage: initializable, event: InitializableEvent);
    #[abi(embed_v0)]
    impl WorldProviderImpl =
        InitializableComponent::WorldProviderImpl<ContractState>;
    #[abi(embed_v0)]
    impl DojoInitImpl = InitializableComponent::DojoInitImpl<ContractState>;
    component!(path: ManageableComponent, storage: manageable, event: ManageableEvent);
    impl ManageableInternalImpl = ManageableComponent::InternalImpl<ContractState>;
    component!(path: PlayableComponent, storage: playable, event: PlayableEvent);
    impl PlayableInternalImpl = PlayableComponent::InternalImpl<ContractState>;

    // Storage

    #[storage]
    struct Storage {
        #[substorage(v0)]
        initializable: InitializableComponent::Storage,
        #[substorage(v0)]
        manageable: ManageableComponent::Storage,
        #[substorage(v0)]
        playable: PlayableComponent::Storage,
    }

    // Events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        InitializableEvent: InitializableComponent::Event,
        #[flat]
        ManageableEvent: ManageableComponent::Event,
        #[flat]
        PlayableEvent: PlayableComponent::Event,
    }

    // Implementations

    #[abi(embed_v0)]
    impl DojoResourceProviderImpl of IDojoResourceProvider<ContractState> {
        fn dojo_resource(self: @ContractState) -> felt252 {
            'actions'
        }
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn create(self: @ContractState, world: IWorldDispatcher, name: felt252) {
            self.manageable._create(world, name);
        }

        fn start(self: @ContractState, world: IWorldDispatcher) -> u32 {
            self.playable._start(world)
        }

        fn play(
            self: @ContractState,
            world: IWorldDispatcher,
            action: Action,
            choice: bool,
            resources: u16
        ) {
            self.playable._play(world, action, choice, resources);
        }
    }
}
