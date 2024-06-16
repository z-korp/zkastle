#[derive(Copy, Drop)]
struct Resource {
    wheat: u8,
    stone: u8,
    iron: u8,
}

#[generate_trait]
impl ResourceImpl of ResourceTrait {
    fn new(wheat: u8, stone: u8, iron: u8) -> Resource {
        Resource { wheat: wheat, stone: stone, iron: iron }
    }
}

impl ResourceZeroable of core::Zeroable<Resource> {
    #[inline(always)]
    fn zero() -> Resource {
        Resource { wheat: 0, stone: 0, iron: 0 }
    }

    #[inline(always)]
    fn is_zero(self: Resource) -> bool {
        self.wheat == 0 && self.stone == 0 && self.iron == 0
    }

    #[inline(always)]
    fn is_non_zero(self: Resource) -> bool {
        !self.is_zero()
    }
}
