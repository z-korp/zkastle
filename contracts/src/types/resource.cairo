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

impl ResourceAdd of core::Add<Resource> {
    #[inline(always)]
    fn add(lhs: Resource, rhs: Resource) -> Resource {
        Resource {
            wheat: lhs.wheat + rhs.wheat, stone: lhs.stone + rhs.stone, iron: lhs.iron + rhs.iron,
        }
    }
}

impl ResourcePartialOrd of core::PartialOrd<Resource> {
    #[inline(always)]
    fn lt(lhs: Resource, rhs: Resource) -> bool {
        lhs.wheat < rhs.wheat && lhs.stone < rhs.stone && lhs.iron < rhs.iron
    }

    #[inline(always)]
    fn le(lhs: Resource, rhs: Resource) -> bool {
        lhs.wheat <= rhs.wheat && lhs.stone <= rhs.stone && lhs.iron <= rhs.iron
    }

    #[inline(always)]
    fn gt(lhs: Resource, rhs: Resource) -> bool {
        lhs.wheat > rhs.wheat && lhs.stone > rhs.stone && lhs.iron > rhs.iron
    }

    #[inline(always)]
    fn ge(lhs: Resource, rhs: Resource) -> bool {
        lhs.wheat >= rhs.wheat && lhs.stone >= rhs.stone && lhs.iron >= rhs.iron
    }
}

impl ResourcePartialEq of core::PartialEq<Resource> {
    #[inline(always)]
    fn eq(lhs: @Resource, rhs: @Resource) -> bool {
        lhs.wheat == rhs.wheat && lhs.stone == rhs.stone && lhs.iron == rhs.iron
    }

    #[inline(always)]
    fn ne(lhs: @Resource, rhs: @Resource) -> bool {
        lhs.wheat != rhs.wheat || lhs.stone != rhs.stone || lhs.iron != rhs.iron
    }
}
