#[derive(Copy, Drop, Serde, Introspect)]
enum Action {
    None,
    Store,
    Rotate,
    Flip,
    Discard,
}

impl ActionPartialEq of core::PartialEq<Action> {
    #[inline(always)]
    fn eq(lhs: @Action, rhs: @Action) -> bool {
        let a: u8 = (*lhs).into();
        let b: u8 = (*rhs).into();
        a == b
    }
}

impl IntoActionFelt252 of core::Into<Action, felt252> {
    #[inline(always)]
    fn into(self: Action) -> felt252 {
        match self {
            Action::None => 'NONE',
            Action::Store => 'STORE',
            Action::Rotate => 'ROTATE',
            Action::Flip => 'FLIP',
            Action::Discard => 'DISCARD',
        }
    }
}

impl IntoActionU8 of core::Into<Action, u8> {
    #[inline(always)]
    fn into(self: Action) -> u8 {
        match self {
            Action::None => 0,
            Action::Store => 1,
            Action::Rotate => 2,
            Action::Flip => 3,
            Action::Discard => 4,
        }
    }
}

impl IntoU8Action of core::Into<u8, Action> {
    #[inline(always)]
    fn into(self: u8) -> Action {
        let action: felt252 = self.into();
        match action {
            0 => Action::None,
            1 => Action::Store,
            2 => Action::Rotate,
            3 => Action::Flip,
            4 => Action::Discard,
            _ => Action::None,
        }
    }
}

impl ActionPrint of core::debug::PrintTrait<Action> {
    #[inline(always)]
    fn print(self: Action) {
        let felt: felt252 = self.into();
        felt.print();
    }
}
