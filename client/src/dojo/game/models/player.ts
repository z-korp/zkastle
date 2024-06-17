import { ComponentValue } from "@dojoengine/recs";
import { shortenHex } from "@dojoengine/utils";
import { shortString } from "starknet";

export class Player {
  public id: string;
  public game_id: string;
  public achievements: string;
  public name: string;

  constructor(player: ComponentValue) {
    this.id = player.id;
    this.game_id = player.game_id;
    this.achievements = player.achievements;
    this.name = shortString.decodeShortString(player.name);
  }

  getShortAddress(): string {
    return shortenHex(this.id);
  }

  getShortName(): string {
    return this.name.length > 16 ? `${this.name.slice(0, 13)}...` : this.name;
  }
}
