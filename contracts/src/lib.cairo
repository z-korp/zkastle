mod constants;
mod events;
mod store;

mod models {
    mod index;
    mod game;
    mod player;
}
mod types {
    mod action;
    mod card;
    mod deck;
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

mod helpers {
    mod packer;
}

mod components {
    mod initializable;
    mod manageable;
    mod playable;
}

mod systems {
    mod actions;
}
// mod tests {
//     mod test_world;
// }


