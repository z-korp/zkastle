import { ComponentValue } from "@dojoengine/recs";
import { Packer } from "../helpers/packer";
import { Side, SideType } from "../types/side";
import { Card, CardType } from "../types/card";
import { Deck } from "../types/deck";
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

export class Game {
  public id: string;
  public over: boolean;
  public card_one: CardDetail;
  public card_two: CardDetail;
  public card_three: CardDetail;
  public deck: Deck;
  public move_count: number;
  public stores: CardDetail[];
  public sides: Side[];
  public cards: Card[];
  public cardsFull: { card: Card; side: Side; id: number }[];
  public player_id: string;

  constructor(game: ComponentValue) {
    this.id = game.id;
    this.over = game.over ? true : false;
    this.deck = Deck.from(game.deck);
    this.move_count = game.move_count;
    this.player_id = game.player_id;
    this.cards = Packer.unpack(BigInt(game.cards), CARD_BIT_SIZE).map(
      (card: number) => Card.from(card),
    );
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
    this.cardsFull = Packer.unpack(BigInt(game.cards), CARD_BIT_SIZE).map(
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
    this.cardsFull = [
      this.card_one,
      this.card_two,
      this.card_three,
      ...this.cardsFull,
    ];
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

  public isOver(): boolean {
    return this.over;
  }

  public inStorage(card_id: number): boolean {
    return this.stores.some(({ id }) => id === card_id);
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

  /*public getDeckHandDiscard = (): {
    deck: number;
    hand: number;
    discard: number;
  } => {
    // start 128 - 3 = 125
    // 125 % 16 = 13
    const CARD_IN_ROUND = 16;
    const MODULO = 14;
    const card_in_hand =
      (this.card_one.id === 0 ? 0 : 1) + (this.card_two.id === 0 ? 0 : 1);

    const isThirdCard = this.card_three.id !== 0;
    const number_in_deck = ((this.move_count + 0) % (MODULO - 0)) + 1;
 
    return {
      deck: number_in_deck,
      hand: card_in_hand,
      discard: CARD_IN_ROUND - number_in_deck - card_in_hand,
    };
  };*/
}

// 63 % 16 = 15 -> 13 in deck, 2 in hand
// 125 % 16 = 13 -> 7 in deck, 2 in hand, 7 in discard

// 125 % 16 = 13 -> 14 in deck, 2 in hand
// 124 % 16 = 12 -> 13 in deck, 2 in hand
// 123 % 16 = 11 -> 12 in deck, 2 in hand, 2 in discard
// 122 % 16 = 10 -> 11 in deck, 2 in hand, 3 in discard
// 121 % 16 = 9 -> 10 in deck, 2 in hand, 4 in discard
// 120 % 16 = 8 -> 9 in deck, 2 in hand, 5 in discard
// 119 % 16 = 7 -> 8 in deck, 2 in hand, 6 in discard
// 118 % 16 = 6 -> 7 in deck, 2 in hand, 7 in discard
// 117 % 16 = 5 -> 6 in deck, 2 in hand, 8 in discard
// 116 % 16 = 4 -> 5 in deck, 2 in hand, 9 in discard
// 115 % 16 = 3 -> 4 in deck, 2 in hand, 10 in discard
// 114 % 16 = 2 -> 3 in deck, 2 in hand, 11 in discard
// 113 % 16 = 1 -> 2 in deck, 2 in hand, 12 in discard
// 112 % 16 = 0 -> 1 in deck, 2 in hand, 13 in discard
// 111 % 16 = 15 -> 0 in deck, 2 in hand, 13 in discard
