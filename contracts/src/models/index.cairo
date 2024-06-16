#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Game {
    #[key]
    id: u32,
    cards: u128,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Player {
    #[key]
    id: felt252,
    name: felt252,
}
