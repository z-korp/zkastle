import { ComponentValue } from "@dojoengine/recs";
import { Packer } from "../helpers/packer";
import { Side, SideType } from "../types/side";
import { Card, CardType } from "../types/card";
import { Deck, DeckType } from "../types/deck";
import { Resource } from "../types/resource";
import { Achievement } from "../types/achievement";

export const CARD_BIT_SIZE = 5n;
export const SIDE_BIT_SIZE = 3n;
export const STORE_SLOT_COUNT = 4;

export interface CardDetail {
  id: number;
  card: Card;
  side: Side;
}

export interface AchievementDetail {
  achievement: Achievement;
  has: boolean;
}

export class Game {
  public id: string;
  public over: boolean;
  public card_one: CardDetail;
  public card_two: CardDetail;
  public card_three: CardDetail;
  public deck: Deck;
  public move_count: number;
  public achievements: AchievementDetail[];
  public stores: CardDetail[];
  public sides: Side[];
  public cards: CardDetail[];
  public player_id: string;

  constructor(game: ComponentValue) {
    this.id = game.id;
    this.over = game.over ? true : false;
    this.deck = Deck.from(game.deck);
    this.move_count = game.move_count;
    this.player_id = game.player_id;
    this.sides = Packer.unpack(BigInt(game.sides), SIDE_BIT_SIZE).map(
      (side: number) => Side.from(side),
    );
    this.card_one = {
      card: this.deck.reveal(game.card_one),
      side: this.sides[game.card_one - 1] || new Side(SideType.None),
      id: game.card_one,
    };
    this.card_two = {
      card: this.deck.reveal(game.card_two),
      side: this.sides[game.card_two - 1] || new Side(SideType.None),
      id: game.card_two,
    };
    this.card_three = {
      card: this.deck.reveal(game.card_three),
      side: this.sides[game.card_three - 1] || new Side(SideType.None),
      id: game.card_three,
    };

    this.achievements = Packer.sized_unpack(
      BigInt(game.achievements),
      1n,
      Achievement.getAchievements().length,
    ).map((achievement: number, index: number) => {
      const id = index + 1;
      return {
        achievement: Achievement.from(id),
        has: achievement === 1,
      };
    });

    this.stores = Packer.sized_unpack(
      BigInt(game.stores),
      CARD_BIT_SIZE,
      STORE_SLOT_COUNT,
    ).map((card: number) => {
      if (card == 0)
        return {
          card: new Card(CardType.None),
          side: new Side(SideType.None),
          id: card,
        };
      return {
        card: this.deck.reveal(card),
        side: this.sides[card - 1] || new Side(SideType.None),
        id: card,
      };
    });
    this.cards = Packer.unpack(BigInt(game.cards), CARD_BIT_SIZE).map(
      (card: number) => {
        if (card == 0)
          return {
            card: new Card(CardType.None),
            side: new Side(SideType.None),
            id: card,
          };
        return {
          card: this.deck.reveal(card),
          side: this.sides[card - 1] || new Side(SideType.None),
          id: card,
        };
      },
    );
    this.cards = [
      this.card_one,
      this.card_two,
      this.card_three,
      ...this.cards,
    ].filter((card) => card.id !== 0);
  }

  public static getUniqueCards(): { card: Card; side: Side }[][] {
    const cards = Card.getBaseCards();
    return cards.map((card) => {
      return card.getSides().map((side) => ({ card, side }));
    });
  }

  public static getAchievements(): {
    achievement: Achievement;
    card: Card;
    side: Side;
  }[][] {
    const achievements = Achievement.getAchievements();
    return achievements.map((achievement) => {
      const card = achievement.getCard();
      return card.getSides().map((side) => ({ achievement, card, side }));
    });
  }

  public static getCardId(card: Card): number {
    const deck = new Deck(DeckType.Base);
    const cardIds = deck.ids(card.value);
    return !cardIds.length ? 0 : cardIds[0];
  }

  public isOver(): boolean {
    return this.over;
  }

  public inStorage(card_id: number): boolean {
    return this.stores.some(({ id }) => id === card_id);
  }

  public isStorageFull(): boolean {
    return this.stores.filter(({ id }) => id !== 0).length === STORE_SLOT_COUNT;
  }

  public getScore(): number {
    let score = 0;
    this.sides.forEach((side: Side, index: number) => {
      const id = index + 1;
      const card = this.deck.reveal(id);
      score += card.getScore(side);
    });
    return score;
  }

  public getUpgrade(): number {
    let upgrade = 0;
    this.sides.forEach((side: Side, index: number) => {
      const id = index + 1;
      const card = this.deck.reveal(id);
      upgrade += card.getUpgrade(side);
    });
    return upgrade;
  }

  public getRemaining(): number {
    if (!!this.card_three.id) return this.move_count + 3;
    if (!!this.card_two.id) return this.move_count + 2;
    if (!!this.card_one.id) return this.move_count + 1;
    return this.move_count;
  }

  public isAffordable(resources: bigint, costs: Resource[]): boolean {
    let resource = new Resource(0, 0, 0);
    Packer.unpack(resources, CARD_BIT_SIZE)
      .map((card: number) => {
        return {
          card: this.deck.reveal(card),
          side: this.sides[card - 1],
          id: card,
        };
      })
      .forEach(({ card, side }) => {
        resource = resource.add(card.getResource(side));
      });
    const affordable = costs.filter((cost) => resource.isGe(cost)).length > 0;
    return affordable;
  }

  public getStorageResource(): Resource {
    return this.stores.reduce(
      (resource: Resource, { card, side }) => {
        return resource.add(card.getResource(side));
      },
      new Resource(0, 0, 0),
    );
  }

  public getCardInHand = (): number => {
    return (this.card_one.id === 0 ? 0 : 1) + (this.card_two.id === 0 ? 0 : 1);
  };
}
