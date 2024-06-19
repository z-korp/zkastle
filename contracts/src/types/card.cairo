use core::clone::Clone;
// Internal imports

use zkastle::elements::cards;
use zkastle::types::side::Side;
use zkastle::types::action::Action;
use zkastle::types::deck::Deck;
use zkastle::types::resource::{Resource, ResourceTrait};

#[derive(Copy, Drop, Serde, Introspect)]
enum Card {
    None,
    Farm,
    Mine,
    Quarry,
    Monastery,
    Tower,
    Forge,
    Tavern,
    Citadel,
    OniFang,
    ShrineOfValor,
    DragonHeart,
    GuardianKami,
    SpiritualForge,
    SamuraiHorn,
    OracleStone,
    MonkStaff,
    ShogunAxe,
}

#[generate_trait]
impl CardImpl of CardTrait {
    #[inline(always)]
    fn resource(self: Card, side: Side) -> Resource {
        match self {
            Card::Farm => cards::farm::CardImpl::resource(side),
            Card::Mine => cards::mine::CardImpl::resource(side),
            Card::Quarry => cards::quarry::CardImpl::resource(side),
            Card::Monastery => cards::monastery::CardImpl::resource(side),
            Card::Tower => cards::tower::CardImpl::resource(side),
            Card::Forge => cards::forge::CardImpl::resource(side),
            Card::Tavern => cards::tavern::CardImpl::resource(side),
            Card::Citadel => cards::citadel::CardImpl::resource(side),
            Card::OniFang => cards::oni_fang::CardImpl::resource(side),
            Card::ShrineOfValor => cards::shrine_of_valor::CardImpl::resource(side),
            Card::DragonHeart => cards::dragon_heart::CardImpl::resource(side),
            Card::GuardianKami => cards::guardian_kami::CardImpl::resource(side),
            Card::SpiritualForge => cards::spiritual_forge::CardImpl::resource(side),
            Card::SamuraiHorn => cards::samurai_horn::CardImpl::resource(side),
            Card::OracleStone => cards::oracle_stone::CardImpl::resource(side),
            Card::MonkStaff => cards::monk_staff::CardImpl::resource(side),
            Card::ShogunAxe => cards::shogun_axe::CardImpl::resource(side),
            _ => ResourceTrait::new(0, 0, 0),
        }
    }

    #[inline(always)]
    fn score(self: Card, side: Side) -> u8 {
        match self {
            Card::Farm => cards::farm::CardImpl::score(side),
            Card::Mine => cards::mine::CardImpl::score(side),
            Card::Quarry => cards::quarry::CardImpl::score(side),
            Card::Monastery => cards::monastery::CardImpl::score(side),
            Card::Tower => cards::tower::CardImpl::score(side),
            Card::Forge => cards::forge::CardImpl::score(side),
            Card::Tavern => cards::tavern::CardImpl::score(side),
            Card::Citadel => cards::citadel::CardImpl::score(side),
            Card::OniFang => cards::oni_fang::CardImpl::score(side),
            Card::ShrineOfValor => cards::shrine_of_valor::CardImpl::score(side),
            Card::DragonHeart => cards::dragon_heart::CardImpl::score(side),
            Card::GuardianKami => cards::guardian_kami::CardImpl::score(side),
            Card::SpiritualForge => cards::spiritual_forge::CardImpl::score(side),
            Card::SamuraiHorn => cards::samurai_horn::CardImpl::score(side),
            Card::OracleStone => cards::oracle_stone::CardImpl::score(side),
            Card::MonkStaff => cards::monk_staff::CardImpl::score(side),
            Card::ShogunAxe => cards::shogun_axe::CardImpl::score(side),
            _ => 0,
        }
    }

    #[inline(always)]
    fn upgrade(self: Card, side: Side) -> u8 {
        match self {
            Card::Farm => cards::farm::CardImpl::upgrade(side),
            Card::Mine => cards::mine::CardImpl::upgrade(side),
            Card::Quarry => cards::quarry::CardImpl::upgrade(side),
            Card::Monastery => cards::monastery::CardImpl::upgrade(side),
            Card::Tower => cards::tower::CardImpl::upgrade(side),
            Card::Forge => cards::forge::CardImpl::upgrade(side),
            Card::Tavern => cards::tavern::CardImpl::upgrade(side),
            Card::Citadel => cards::citadel::CardImpl::upgrade(side),
            Card::OniFang => cards::oni_fang::CardImpl::upgrade(side),
            Card::ShrineOfValor => cards::shrine_of_valor::CardImpl::upgrade(side),
            Card::DragonHeart => cards::dragon_heart::CardImpl::upgrade(side),
            Card::GuardianKami => cards::guardian_kami::CardImpl::upgrade(side),
            Card::SpiritualForge => cards::spiritual_forge::CardImpl::upgrade(side),
            Card::SamuraiHorn => cards::samurai_horn::CardImpl::upgrade(side),
            Card::OracleStone => cards::oracle_stone::CardImpl::upgrade(side),
            Card::MonkStaff => cards::monk_staff::CardImpl::upgrade(side),
            Card::ShogunAxe => cards::shogun_axe::CardImpl::upgrade(side),
            _ => 0,
        }
    }

    #[inline(always)]
    fn can(self: Card, side: Side, action: Action) -> bool {
        match self {
            Card::Farm => cards::farm::CardImpl::can(side, action),
            Card::Mine => cards::mine::CardImpl::can(side, action),
            Card::Quarry => cards::quarry::CardImpl::can(side, action),
            Card::Monastery => cards::monastery::CardImpl::can(side, action),
            Card::Tower => cards::tower::CardImpl::can(side, action),
            Card::Forge => cards::forge::CardImpl::can(side, action),
            Card::Tavern => cards::tavern::CardImpl::can(side, action),
            Card::Citadel => cards::citadel::CardImpl::can(side, action),
            Card::OniFang => cards::oni_fang::CardImpl::can(side, action),
            Card::ShrineOfValor => cards::shrine_of_valor::CardImpl::can(side, action),
            Card::DragonHeart => cards::dragon_heart::CardImpl::can(side, action),
            Card::GuardianKami => cards::guardian_kami::CardImpl::can(side, action),
            Card::SpiritualForge => cards::spiritual_forge::CardImpl::can(side, action),
            Card::SamuraiHorn => cards::samurai_horn::CardImpl::can(side, action),
            Card::OracleStone => cards::oracle_stone::CardImpl::can(side, action),
            Card::MonkStaff => cards::monk_staff::CardImpl::can(side, action),
            Card::ShogunAxe => cards::shogun_axe::CardImpl::can(side, action),
            _ => false,
        }
    }

    #[inline(always)]
    fn cost(self: Card, side: Side, action: Action) -> Array<Resource> {
        match self {
            Card::Farm => cards::farm::CardImpl::cost(side, action),
            Card::Mine => cards::mine::CardImpl::cost(side, action),
            Card::Quarry => cards::quarry::CardImpl::cost(side, action),
            Card::Monastery => cards::monastery::CardImpl::cost(side, action),
            Card::Tower => cards::tower::CardImpl::cost(side, action),
            Card::Forge => cards::forge::CardImpl::cost(side, action),
            Card::Tavern => cards::tavern::CardImpl::cost(side, action),
            Card::Citadel => cards::citadel::CardImpl::cost(side, action),
            Card::OniFang => cards::oni_fang::CardImpl::cost(side, action),
            Card::ShrineOfValor => cards::shrine_of_valor::CardImpl::cost(side, action),
            Card::DragonHeart => cards::dragon_heart::CardImpl::cost(side, action),
            Card::GuardianKami => cards::guardian_kami::CardImpl::cost(side, action),
            Card::SpiritualForge => cards::spiritual_forge::CardImpl::cost(side, action),
            Card::SamuraiHorn => cards::samurai_horn::CardImpl::cost(side, action),
            Card::OracleStone => cards::oracle_stone::CardImpl::cost(side, action),
            Card::MonkStaff => cards::monk_staff::CardImpl::cost(side, action),
            Card::ShogunAxe => cards::shogun_axe::CardImpl::cost(side, action),
            _ => array![],
        }
    }

    #[inline(always)]
    fn condition(self: Card, side: Side, action: Action, deck: Deck, sides: u128) -> bool {
        match self {
            Card::Farm => cards::farm::CardImpl::condition(side, action, deck, sides),
            Card::Mine => cards::mine::CardImpl::condition(side, action, deck, sides),
            Card::Quarry => cards::quarry::CardImpl::condition(side, action, deck, sides),
            Card::Monastery => cards::monastery::CardImpl::condition(side, action, deck, sides),
            Card::Tower => cards::tower::CardImpl::condition(side, action, deck, sides),
            Card::Forge => cards::forge::CardImpl::condition(side, action, deck, sides),
            Card::Tavern => cards::tavern::CardImpl::condition(side, action, deck, sides),
            Card::Citadel => cards::citadel::CardImpl::condition(side, action, deck, sides),
            Card::OniFang => cards::oni_fang::CardImpl::condition(side, action, deck, sides),
            Card::ShrineOfValor => cards::shrine_of_valor::CardImpl::condition(
                side, action, deck, sides
            ),
            Card::DragonHeart => cards::dragon_heart::CardImpl::condition(
                side, action, deck, sides
            ),
            Card::GuardianKami => cards::guardian_kami::CardImpl::condition(
                side, action, deck, sides
            ),
            Card::SpiritualForge => cards::spiritual_forge::CardImpl::condition(
                side, action, deck, sides
            ),
            Card::SamuraiHorn => cards::samurai_horn::CardImpl::condition(
                side, action, deck, sides
            ),
            Card::OracleStone => cards::oracle_stone::CardImpl::condition(
                side, action, deck, sides
            ),
            Card::MonkStaff => cards::monk_staff::CardImpl::condition(side, action, deck, sides),
            Card::ShogunAxe => cards::shogun_axe::CardImpl::condition(side, action, deck, sides),
            _ => false,
        }
    }
}

impl IntoCardFelt252 of core::Into<Card, felt252> {
    #[inline(always)]
    fn into(self: Card) -> felt252 {
        match self {
            Card::None => 'NONE',
            Card::Farm => 'FARM',
            Card::Mine => 'MINE',
            Card::Quarry => 'QUARRY',
            Card::Monastery => 'MONASTERY',
            Card::Tower => 'TOWER',
            Card::Forge => 'FORGE',
            Card::Tavern => 'TAVERN',
            Card::Citadel => 'CITADEL',
            Card::OniFang => 'ONI FANG',
            Card::ShrineOfValor => 'SHRINE OF VALOR',
            Card::DragonHeart => 'DRAGON HEART',
            Card::GuardianKami => 'GUARDIAN KAMI',
            Card::SpiritualForge => 'SPIRITUAL FORGE',
            Card::SamuraiHorn => 'SAMURAI HORN',
            Card::OracleStone => 'ORACLE STONE',
            Card::MonkStaff => 'MONK STAFF',
            Card::ShogunAxe => 'SHOGUN AXE',
        }
    }
}

impl IntoCardU8 of core::Into<Card, u8> {
    #[inline(always)]
    fn into(self: Card) -> u8 {
        match self {
            Card::None => 0,
            Card::Farm => 1,
            Card::Mine => 2,
            Card::Quarry => 3,
            Card::Monastery => 4,
            Card::Tower => 5,
            Card::Forge => 6,
            Card::Tavern => 7,
            Card::Citadel => 8,
            Card::OniFang => 9,
            Card::ShrineOfValor => 10,
            Card::DragonHeart => 11,
            Card::GuardianKami => 12,
            Card::SpiritualForge => 13,
            Card::SamuraiHorn => 14,
            Card::OracleStone => 15,
            Card::MonkStaff => 16,
            Card::ShogunAxe => 17,
        }
    }
}

impl IntoU8Card of core::Into<u8, Card> {
    #[inline(always)]
    fn into(self: u8) -> Card {
        let card: felt252 = self.into();
        match card {
            0 => Card::None,
            1 => Card::Farm,
            2 => Card::Mine,
            3 => Card::Quarry,
            4 => Card::Monastery,
            5 => Card::Tower,
            6 => Card::Forge,
            7 => Card::Tavern,
            8 => Card::Citadel,
            9 => Card::OniFang,
            10 => Card::ShrineOfValor,
            11 => Card::DragonHeart,
            12 => Card::GuardianKami,
            13 => Card::SpiritualForge,
            14 => Card::SamuraiHorn,
            15 => Card::OracleStone,
            16 => Card::MonkStaff,
            17 => Card::ShogunAxe,
            _ => Card::None,
        }
    }
}

impl CardPrint of core::debug::PrintTrait<Card> {
    #[inline(always)]
    fn print(self: Card) {
        let felt: felt252 = self.into();
        felt.print();
    }
}
