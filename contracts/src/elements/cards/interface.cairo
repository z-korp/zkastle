// Internal imports

use zkastle::types::action::Action;
use zkastle::types::side::Side;
use zkastle::types::resource::{Resource, ResourceTrait};

#[derive(Drop, Copy)]
trait CardTrait {
    fn resource(side: Side) -> Resource;
    fn score(side: Side) -> u8;
    fn upgrade(side: Side) -> u8;
    fn can(side: Side, action: Action) -> bool;
    fn cost(side: Side, action: Action) -> Array<Resource>;
}
