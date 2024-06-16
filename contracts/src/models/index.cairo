#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
struct Player {
    #[key]
    id: felt252,
    game_id: u32,
    achievements: u64,
    name: felt252,
}

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
struct Game {
    #[key]
    id: u32,
    #[key]
    player_id: felt252,
    over: bool,
    card_one: u8,
    card_two: u8,
    card_three: u8,
    deck: u8,
    move_count: u8,
    pointer: u8,
    store_count: u8,
    stores: u16,
    cards: u64,
    sides: u64,
    indexes: u64,
    seed: felt252,
}
