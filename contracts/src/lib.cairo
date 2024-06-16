mod systems {
    mod actions;
}

mod models {
    mod index;
    mod game;
    mod player;
}

mod types {
    mod action;
    mod card;
    mod resource;
    mod side;
}

mod elements {
    mod cards {
        mod interface;
        mod farm;
        mod mine;
        mod quarry;
        mod monastery;
        mod tower;
        mod forge;
        mod tavern;
        mod citadel;
    }
    mod decks {
        mod interface;
        mod base;
    }
}

mod tests {
    mod test_world;
}
