// Internal imports

use zkastle::types::card::Card;

#[derive(Drop, Copy)]
trait DeckTrait {
    fn count() -> u8;
    fn draw(id: u8) -> Card;
}
