import { ComponentValue } from "@dojoengine/recs";
import { Packer } from "../helpers/packer";
import { SIDE_TYPE_COUNT, Side, SideType } from "../types/side";
import { Card, CardType, CARD_TYPE_COUNT } from "../types/card";
import { Deck } from "../types/deck";

export const CARD_BIT_SIZE = 32;
export const SIDE_BIT_SIZE = 8;
export const STORE_SLOT_COUNT = 4;

export class Game {
  public id: string;
  public over: boolean;
  public card_one: { card: Card; side: Side; id: number };
  public card_two: { card: Card; side: Side; id: number };
  public card_three: { card: Card; side: Side; id: number };
  public deck: Deck;
  public move_count: number;
  public stores: { card: Card; side: Side; id: number }[];
  public sides: Side[];
  public cards: Card[];

  constructor(game: ComponentValue) {
    this.id = game.id;
    this.over = game.over ? true : false;
    this.deck = Deck.from(game.deck);
    this.move_count = game.move_count;
    this.cards = Packer.sized_unpack(
      parseInt(`0x${game.cards.toString(16)}`),
      CARD_BIT_SIZE,
      this.deck.count(),
    ).map((card: number) => Card.from(card));
    this.sides = Packer.sized_unpack(
      parseInt(`0x${game.sides.toString(16)}`),
      SIDE_BIT_SIZE,
      this.deck.count(),
    ).map((side: number) => Side.from(side));
    this.card_one = {
      card: this.deck.reveal(game.card_one),
      side: this.sides[game.card_one - 1],
      id: game.card_one,
    };
    this.card_two = {
      card: this.deck.reveal(game.card_two),
      side: this.sides[game.card_two - 1],
      id: game.card_two,
    };
    this.card_three = {
      card: this.deck.reveal(game.card_three),
      side: this.sides[game.card_three - 1],
      id: game.card_three,
    };
    this.stores = Packer.sized_unpack(
      parseInt(`0x${game.stores.toString(16)}`),
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
        side: this.sides[card - 1],
        id: card,
      };
    });
  }

  public static getUniqueCards(): { card: Card; side: Side }[][] {
    return Array.from({ length: CARD_TYPE_COUNT }, (_, card_index) => {
      return Array.from({ length: SIDE_TYPE_COUNT }, (_, side_index) => {
        return {
          card: Card.from(card_index + 1),
          side: Side.from(side_index + 1),
        };
      });
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
      const card = this.deck.reveal(index);
      score += card.getScore(side);
    });
    return score;
  }
}
