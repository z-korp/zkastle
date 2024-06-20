import { Base } from "@/dojo/game/elements/decks/base";
import { Card, CardType } from "@/dojo/game/types/card";

export enum DeckType {
  None = "None",
  Base = "Base",
}

export class Deck {
  value: DeckType;

  constructor(value: DeckType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(DeckType).indexOf(this.value);
  }

  public static from(index: number): Deck {
    const item = Object.values(DeckType)[index];
    return new Deck(item);
  }

  public count(): number {
    switch (this.value) {
      case DeckType.Base:
        return Base.count();
      default:
        return 0;
    }
  }

  public baseCount(): number {
    switch (this.value) {
      case DeckType.Base:
        return Base.count();
      default:
        return 0;
    }
  }

  public achievementCount(): number {
    switch (this.value) {
      case DeckType.Base:
        return Base.achievementCount();
      default:
        return 0;
    }
  }

  public reveal(id: number): Card {
    switch (this.value) {
      case DeckType.Base:
        return new Card(Base.reveal(id));
      default:
        return new Card(CardType.None);
    }
  }

  public ids(card: CardType): number[] {
    switch (this.value) {
      case DeckType.Base:
        return Base.ids(card);
      default:
        return [];
    }
  }
}
