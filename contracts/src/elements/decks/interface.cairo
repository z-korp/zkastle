// Internal imports

use zkastle::types::card::Card;

#[derive(Drop, Copy)]
trait DeckTrait {
    fn count() -> u8;
    fn draw(index: u8) -> Card;
}
