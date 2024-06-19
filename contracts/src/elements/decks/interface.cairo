// Internal imports

use zkastle::types::card::Card;

#[derive(Drop, Copy)]
trait DeckTrait {
    fn count() -> u8;
    fn base_count() -> u8;
    fn achievement_count() -> u8;
    fn cards() -> u128;
    fn sides() -> u128;
    fn draw(id: u8) -> Card;
    fn ids(card: Card) -> Array<u8>;
}
