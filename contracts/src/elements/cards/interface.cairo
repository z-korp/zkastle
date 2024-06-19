// Internal imports

use zkastle::types::action::Action;
use zkastle::types::side::{Side, SideTrait};
use zkastle::types::resource::{Resource, ResourceTrait};
use zkastle::types::deck::{Deck, DeckTrait};

#[derive(Drop, Copy)]
trait CardTrait {
    fn resource(side: Side) -> Resource;
    fn score(side: Side) -> u8;
    fn upgrade(side: Side) -> u8;
    fn update(side: Side, action: Action) -> Side;
    fn can(side: Side, action: Action) -> bool;
    fn cost(side: Side, action: Action) -> Array<Resource>;
    fn condition(side: Side, action: Action, deck: Deck, sides: u128) -> bool;
}
