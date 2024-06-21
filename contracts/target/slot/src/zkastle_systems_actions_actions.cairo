// Starknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::IWorldDispatcher;

// External imports

use stark_vrf::ecvrf::Proof;

// Internal imports

use zkastle::types::action::Action;

// Interfaces

#[starknet::interface]
trait IActions<TContractState> {
    fn create(self: @TContractState, world: IWorldDispatcher, name: felt252);
    fn start(
        self: @TContractState, world: IWorldDispatcher, proof: Proof, seed: felt252, beta: felt252
    ) -> u32;
    fn play(
        self: @TContractState, world: IWorldDispatcher, action: Action, choice: bool, resources: u32
    );
    fn discard(self: @TContractState, world: IWorldDispatcher, slot_index: u8);
    fn surrender(self: @TContractState, world: IWorldDispatcher);
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

    use super::{IActions, Action, Proof};

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

        fn start(
            self: @ContractState,
            world: IWorldDispatcher,
            proof: Proof,
            seed: felt252,
            beta: felt252
        ) -> u32 {
            self.playable._start(world, proof, seed, beta)
        }

        fn play(
            self: @ContractState,
            world: IWorldDispatcher,
            action: Action,
            choice: bool,
            resources: u32
        ) {
            self.playable._play(world, action, choice, resources);
        }

        fn discard(self: @ContractState, world: IWorldDispatcher, slot_index: u8) {
            self.playable._discard(world, slot_index);
        }

        fn surrender(self: @ContractState, world: IWorldDispatcher) {
            self.playable._surrender(world);
        }
    }
}
