// // Internal imports

// use zkastle::elements::cards::interface::{CardTrait, Action, Side, Resource, ResourceTrait};

// impl CardImpl of CardTrait {
//     #[inline(always)]
//     fn resource(side: Side) -> Resource {
//         ResourceTrait::new(0, 0, 0)
//     }

//     #[inline(always)]
//     fn score(side: Side) -> u8 {
//         match side {
//             Side::Two => 1,
//             Side::Three => 6,
//             Side::Four => 3,
//             _ => 0,
//         }
//     }

//     #[inline(always)]
//     fn upgrade(side: Side) -> u8 {
//         0
//     }

//     #[inline(always)]
//     fn can(side: Side, action: Action) -> bool {
//         match action {
//             Action::Rotate => match side {
//                 Side::One => true,
//                 Side::Four => true,
//                 _ => false,
//             },
//             Action::Flip => match side {
//                 Side::Two => true,
//                 _ => false,
//             },
//             Action::Discard => true,
//             _ => false,
//         }
//     }

//     #[inline(always)]
//     fn cost(side: Side, action: Action) -> Array<Resource> {
//         match action {
//             Action::Rotate => match side {
//                 Side::One => array![ResourceTrait::new(1, 1, 0)],
//                 Side::Four => array![ResourceTrait::new(2, 2, 2)],
//                 _ => array![],
//             },
//             Action::Flip => match side {
//                 Side::Two => array![ResourceTrait::new(1, 1, 1)],
//                 _ => array![],
//             },
//             _ => array![],
//         }
//     }
// }

import { Action, ActionType } from "../../types/action";
import { Resource } from "../../types/resource";
import { Side, SideType } from "../../types/side";

export class Tower {
  public static resource(side: Side): Resource {
    return new Resource(0, 0, 0);
  }

  public static score(side: Side): number {
    switch (side.value) {
      case SideType.Two:
        return 1;
      case SideType.Three:
        return 6;
      case SideType.Four:
        return 3;
      default:
        return 0;
    }
  }

  public static upgrade(side: Side): number {
    return 0;
  }

  public static can(side: Side, action: Action): boolean {
    switch (action.value) {
      case ActionType.Rotate:
        switch (side.value) {
          case SideType.One:
            return true;
          case SideType.Four:
            return true;
          default:
            return false;
        }
      case ActionType.Flip:
        switch (side.value) {
          case SideType.Two:
            return true;
          default:
            return false;
        }
      case ActionType.Discard:
        return true;
      default:
        return false;
    }
  }

  public static cost(side: Side, action: Action): Resource[] {
    switch (action.value) {
      case ActionType.Rotate:
        switch (side.value) {
          case SideType.One:
            return [new Resource(1, 1, 0)];
          case SideType.Four:
            return [new Resource(2, 2, 2)];
          default:
            return [];
        }
      case ActionType.Flip:
        switch (side.value) {
          case SideType.Two:
            return [new Resource(1, 1, 1)];
          default:
            return [];
        }
      default:
        return [];
    }
  }
}
