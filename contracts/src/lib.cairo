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
    mod achievement;
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
        mod oni_fang;
        mod shrine_of_valor;
        mod dragon_heart;
        mod guardian_kami;
        mod spiritual_forge;
        mod samurai_horn;
        mod oracle_stone;
        mod monk_staff;
        mod shogun_axe;
    }
    mod decks {
        mod interface;
        mod base;
    }
    mod achievements {
        mod interface;
        mod oni_fang;
        mod shrine_of_valor;
        mod dragon_heart;
        mod guardian_kami;
        mod spiritual_forge;
        mod samurai_horn;
        mod oracle_stone;
        mod monk_staff;
        mod shogun_axe;
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

#[cfg(test)]
mod tests {
    mod setup;
    mod test_start;
}

