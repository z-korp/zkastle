// Internal imports

use zkastle::types::action::Action;

#[derive(Copy, Drop, Serde, Introspect)]
enum Side {
    None,
    One,
    Two,
    Three,
    Four,
}

#[generate_trait]
impl SideImpl of SideTrait {
    #[inline(always)]
    fn update(self: Side, action: Action) -> Side {
        match action {
            Action::Rotate => match self {
                Side::One => Side::Two,
                Side::Two => Side::One,
                Side::Three => Side::Four,
                Side::Four => Side::Three,
                _ => Side::None,
            },
            Action::Flip => match self {
                Side::One => Side::Three,
                Side::Two => Side::Four,
                Side::Three => Side::One,
                Side::Four => Side::Two,
                _ => Side::None,
            },
            _ => self,
        }
    }
}

impl IntoSideFelt252 of core::Into<Side, felt252> {
    #[inline(always)]
    fn into(self: Side) -> felt252 {
        match self {
            Side::None => 'NONE',
            Side::One => 'ONE',
            Side::Two => 'TWO',
            Side::Three => 'THREE',
            Side::Four => 'FOUR',
        }
    }
}

impl IntoSideU8 of core::Into<Side, u8> {
    #[inline(always)]
    fn into(self: Side) -> u8 {
        match self {
            Side::None => 0,
            Side::One => 1,
            Side::Two => 2,
            Side::Three => 3,
            Side::Four => 4,
        }
    }
}

impl IntoU8Side of core::Into<u8, Side> {
    #[inline(always)]
    fn into(self: u8) -> Side {
        let action: felt252 = self.into();
        match action {
            0 => Side::One, // Hack to have by default Side One set for cards
            1 => Side::One,
            2 => Side::Two,
            3 => Side::Three,
            4 => Side::Four,
            _ => Side::None,
        }
    }
}

impl SidePrint of core::debug::PrintTrait<Side> {
    #[inline(always)]
    fn print(self: Side) {
        let felt: felt252 = self.into();
        felt.print();
    }
}
