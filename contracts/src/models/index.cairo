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
    over: bool,
    card_one: u8,
    card_two: u8,
    card_three: u8,
    deck: u8,
    move_count: u8,
    stores: u32,
    sides: u64,
    cards: u128,
}
