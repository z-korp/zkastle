#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
struct Player {
    #[key]
    id: felt252,
    game_id: u32,
    card_id: u8,
    achievements: u32,
    enables: u32,
    name: felt252,
}

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
struct Game {
    #[key]
    id: u32,
    over: bool,
    card_one: u8,
    card_two: u8,
    card_three: u8,
    deck: u8,
    move_count: u16,
    achievements: u32,
    stores: u32,
    sides: u128,
    cards: u128,
    player_id: felt252,
}
