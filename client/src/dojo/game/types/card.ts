import { Resource } from "./resource";
import { Side } from "./side";
import { Farm } from "../elements/cards/farm";
import { Mine } from "../elements/cards/mine";
import { Quarry } from "../elements/cards/quarry";
import { Monastery } from "../elements/cards/monastery";
import { Tower } from "../elements/cards/tower";
import { Forge } from "../elements/cards/forge";
import { Tavern } from "../elements/cards/tavern";
import { Citadel } from "../elements/cards/citadel";

import citadel from "/assets/citadel-bg.png";
import farm from "/assets/farm-bg.png";
import forge from "/assets/forge-bg.png";
import mine from "/assets/mine-bg.png";
import monastery from "/assets/monastery-bg.png";
import quarry from "/assets/quarry-bg.png";
import tavern from "/assets/tavern-bg.png";
import tower from "/assets/tower-bg.png";
import { Action } from "./action";

export const CARD_TYPE_COUNT = 8;

export enum CardType {
  None = "None",
  Farm = "Farm",
  Mine = "Mine",
  Quarry = "Quarry",
  Monastery = "Monastery",
  Tower = "Tower",
  Forge = "Forge",
  Tavern = "Tavern",
  Citadel = "Citadel",
}

export class Card {
  value: CardType;

  constructor(value: CardType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(CardType).indexOf(this.value);
  }

  public static from(index: number): Card {
    const item = Object.values(CardType)[index];
    return new Card(item);
  }

  public getImage(): string {
    switch (this.value) {
      case CardType.Farm:
        return farm;
      case CardType.Mine:
        return mine;
      case CardType.Quarry:
        return quarry;
      case CardType.Monastery:
        return monastery;
      case CardType.Tower:
        return tower;
      case CardType.Forge:
        return forge;
      case CardType.Tavern:
        return tavern;
      case CardType.Citadel:
        return citadel;
      default:
        return "";
    }
  }

  public getResource(side: Side): Resource {
    switch (this.value) {
      case CardType.Farm:
        return Farm.resource(side);
      case CardType.Mine:
        return Mine.resource(side);
      case CardType.Quarry:
        return Quarry.resource(side);
      case CardType.Monastery:
        return Monastery.resource(side);
      case CardType.Tower:
        return Tower.resource(side);
      case CardType.Forge:
        return Forge.resource(side);
      case CardType.Tavern:
        return Tavern.resource(side);
      case CardType.Citadel:
        return Citadel.resource(side);
      default:
        return new Resource(0, 0, 0);
    }
  }

  public getScore(side: Side): number {
    switch (this.value) {
      case CardType.Farm:
        return Farm.score(side);
      case CardType.Mine:
        return Mine.score(side);
      case CardType.Quarry:
        return Quarry.score(side);
      case CardType.Monastery:
        return Monastery.score(side);
      case CardType.Tower:
        return Tower.score(side);
      case CardType.Forge:
        return Forge.score(side);
      case CardType.Tavern:
        return Tavern.score(side);
      case CardType.Citadel:
        return Citadel.score(side);
      default:
        return 0;
    }
  }

  public getUpgrade(side: Side): number {
    switch (this.value) {
      case CardType.Farm:
        return Farm.upgrade(side);
      case CardType.Mine:
        return Mine.upgrade(side);
      case CardType.Quarry:
        return Quarry.upgrade(side);
      case CardType.Monastery:
        return Monastery.upgrade(side);
      case CardType.Tower:
        return Tower.upgrade(side);
      case CardType.Forge:
        return Forge.upgrade(side);
      case CardType.Tavern:
        return Tavern.upgrade(side);
      case CardType.Citadel:
        return Citadel.upgrade(side);
      default:
        return 0;
    }
  }

  public isAllowed(side: Side, action: Action): boolean {
    switch (this.value) {
      case CardType.Farm:
        return Farm.can(side, action);
      case CardType.Mine:
        return Mine.can(side, action);
      case CardType.Quarry:
        return Quarry.can(side, action);
      case CardType.Monastery:
        return Monastery.can(side, action);
      case CardType.Tower:
        return Tower.can(side, action);
      case CardType.Forge:
        return Forge.can(side, action);
      case CardType.Tavern:
        return Tavern.can(side, action);
      case CardType.Citadel:
        return Citadel.can(side, action);
      default:
        return false;
    }
  }

  public getCost(side: Side, action: Action): Resource[] {
    switch (this.value) {
      case CardType.Farm:
        return Farm.cost(side, action);
      case CardType.Mine:
        return Mine.cost(side, action);
      case CardType.Quarry:
        return Quarry.cost(side, action);
      case CardType.Monastery:
        return Monastery.cost(side, action);
      case CardType.Tower:
        return Tower.cost(side, action);
      case CardType.Forge:
        return Forge.cost(side, action);
      case CardType.Tavern:
        return Tavern.cost(side, action);
      case CardType.Citadel:
        return Citadel.cost(side, action);
      default:
        return [];
    }
  }
}
