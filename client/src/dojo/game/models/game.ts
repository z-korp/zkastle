import { ComponentValue } from "@dojoengine/recs";
import { Packer } from "../helpers/packer";
import { Side } from "../types/side";
import { Card } from "../types/card";
import { Deck } from "../types/deck";

export class Game {
  public id: number;
  public player_id: string;
  public over: boolean;
  public card_one: { card: Card; side: Side };
  public card_two: { card: Card; side: Side };
  public card_three: { card: Card; side: Side };
  public deck: Deck;
  public move_count: number;
  public pointer: number;
  public store_count: number;
  public stores: { card: Card; side: Side }[];
  public cards: Card[];
  public sides: Side[];
  public indexes: number[];
  public seed: bigint;

  constructor(game: ComponentValue) {
    this.id = game.id;
    this.player_id = `0x${game.player_id.toString(16)}`;
    this.over = game.over;
    this.deck = Deck.from(game.deck);
    this.move_count = game.move_count;
    this.pointer = game.pointer;
    this.cards = Packer.unpack(game.cards, 16, 16).map((card: number) =>
      Card.from(card),
    );
    this.sides = Packer.unpack(game.sides, 8, 16).map((side: number) =>
      Side.from(side),
    );
    this.card_one = {
      card: this.deck.reveal(game.card_one),
      side: this.sides[game.card_one],
    };
    this.card_two = {
      card: this.deck.reveal(game.card_two),
      side: this.sides[game.card_two],
    };
    this.card_three = {
      card: this.deck.reveal(game.card_three),
      side: this.sides[game.card_three],
    };
    this.store_count = game.store_count;
    this.stores = Packer.unpack(game.stores, 16, game.store_count).map(
      (card: number) => {
        return { card: this.deck.reveal(card), side: this.sides[card] };
      },
    );
    this.indexes = Packer.unpack(game.indexes, 16, 16);
    this.seed = game.seed;
  }

  public isOver(): boolean {
    return this.over;
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
