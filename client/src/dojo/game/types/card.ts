import citadel from "/assets/citadel-bg.png";
import farm from "/assets/farm-bg.png";
import forge from "/assets/forge-bg.png";
import mine from "/assets/mine-bg.png";
import monastery from "/assets/monastery-bg.png";
import quarry from "/assets/quarry-bg.png";
import tavern from "/assets/tavern-bg.png";
import tower from "/assets/tower-bg.png";

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
}
