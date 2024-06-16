import { ComponentValue } from "@dojoengine/recs";
import { Packer } from "../helpers/packer";
import { Action, ActionType } from "../types/action";
import { Side, SideType } from "../types/side";
import { Card, CardType } from "../types/card";
import { Deck, DeckType } from "../types/deck";
import { Resource } from "../types/resource";

export class Game {
  public id: number;
  public player_id: string;
  public over: boolean;
  public card_one: Card;
  public card_two: Card;
  public card_three: Card;
  public deck: Deck;
  public move_count: number;
  public pointer: number;
  public store_count: number;
  public stores: Card[];
  public cards: Card[];
  public sides: Side[];
  public indexes: number[];
  public seed: bigint;

  constructor(game: ComponentValue) {
    this.id = game.id;
    this.player_id = `0x${game.player_id.toString(16)}`;
    this.over = game.over;
    this.deck = Deck.from(game.deck);
    this.card_one = this.deck.reveal(game.card_one);
    this.card_two = this.deck.reveal(game.card_two);
    this.card_three = this.deck.reveal(game.card_three);
    this.move_count = game.move_count;
    this.pointer = game.pointer;
    this.store_count = game.store_count;
    this.stores = Packer.unpack(game.stores, 16, game.store_count).map(
      (card: number) => Card.from(card),
    );
    this.cards = Packer.unpack(game.cards, 16, 16).map((card: number) =>
      Card.from(card),
    );
    this.sides = Packer.unpack(game.sides, 8, 16).map((side: number) =>
      Side.from(side),
    );
    this.indexes = Packer.unpack(game.indexes, 16, 16);
    this.seed = game.seed;
  }

  public isOver(): boolean {
    return this.over;
  }
}
