import { ComponentValue } from "@dojoengine/recs";
import { Packer } from "../helpers/packer";
import { Side, SideType } from "../types/side";
import { Card, CardType } from "../types/card";
import { Deck } from "../types/deck";

export class Game {
  public id: string;
  public over: boolean;
  public card_one: { card: Card; side: Side; id: number };
  public card_two: { card: Card; side: Side; id: number };
  public card_three: { card: Card; side: Side; id: number };
  public deck: Deck;
  public move_count: number;
  public pointer: number;
  public store_count: number;
  public stores: { card: Card; side: Side; id: number }[];
  public cards: Card[];
  public sides: Side[];
  public indexes: number[];
  public seed: bigint;

  constructor(game: ComponentValue) {
    this.id = game.id;
    this.over = game.over ? true : false;
    this.deck = Deck.from(game.deck);
    this.move_count = game.move_count;
    this.pointer = game.pointer;
    this.cards = Packer.unpack(
      parseInt(`0x${game.cards.toString(16)}`),
      16,
      16,
    ).map((card: number) => Card.from(card));
    this.sides = Packer.unpack(
      parseInt(`0x${game.sides.toString(16)}`),
      8,
      16,
    ).map((side: number) => Side.from(side));
    this.card_one = {
      card: this.deck.reveal(game.card_one),
      side: this.sides[game.card_one],
      id: game.card_one,
    };
    this.card_two = {
      card: this.deck.reveal(game.card_two),
      side: this.sides[game.card_two],
      id: game.card_two,
    };
    this.card_three = {
      card: this.deck.reveal(game.card_three),
      side: this.sides[game.card_three],
      id: game.card_three,
    };
    this.store_count = game.store_count;
    this.stores = Packer.unpack(
      parseInt(`0x${game.stores.toString(16)}`),
      16,
      4,
    ).map((card: number, index: number) => {
      if (index >= game.store_count)
        return {
          card: new Card(CardType.None),
          side: new Side(SideType.None),
          id: -1,
        };
      return { card: this.deck.reveal(card), side: this.sides[card], id: card };
    });
    this.indexes = Packer.unpack(
      parseInt(`0x${game.indexes.toString(16)}`),
      16,
      16,
    );
    this.seed = game.seed;
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
