// Internal imports

use zkastle::types::deck::Deck;

#[derive(Drop, Copy)]
trait AchievementTrait {
    fn condition(deck: Deck, sides: u128, stores: u32, score: u8) -> bool;
    fn sides(deck: Deck, sides: u128) -> u128;
}
