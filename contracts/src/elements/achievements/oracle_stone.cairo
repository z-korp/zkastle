// Internal imports

use zkastle::types::deck::Deck;
use zkastle::elements::achievements::interface::AchievementTrait;

impl AchievementImpl of AchievementTrait {
    fn condition(deck: Deck, sides: u128, stores: u32, score: u8) -> bool {
        // [Check] Score must be at least 40
        score >= 40
    }

    #[inline(always)]
    fn sides(deck: Deck, sides: u128) -> u128 {
        sides
    }
}
