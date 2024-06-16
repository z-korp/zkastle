#[derive(Copy, Drop)]
struct Price {
    wheat: u8,
    stone: u8,
    iron: u8,
}

#[generate_trait]
impl PriceImpl of PriceTrait {
    fn new(wheat: u8, stone: u8, iron: u8) -> Price {
        Price { wheat: wheat, stone: stone, iron: iron }
    }
}

impl PriceZeroable of core::Zeroable<Price> {
    #[inline(always)]
    fn zero() -> Price {
        Price { wheat: 0, stone: 0, iron: 0 }
    }

    #[inline(always)]
    fn is_zero(self: Price) -> bool {
        self.wheat == 0 && self.stone == 0 && self.iron == 0
    }

    #[inline(always)]
    fn is_non_zero(self: Price) -> bool {
        !self.is_zero()
    }
}