import { ComponentValue } from "@dojoengine/recs";
import { shortenHex } from "@dojoengine/utils";
import { shortString } from "starknet";
import { Packer } from "../helpers/packer";
import { Achievement } from "../types/achievement";

export class Player {
  public id: string;
  public game_id: string;
  public achievements: Achievement[];
  public name: string;

  constructor(player: ComponentValue) {
    this.id = player.id;
    this.game_id = player.game_id;
    this.achievements = Packer.unpack(player.achievements, 2).map((index) => {
      let id = index + 1;
      return Achievement.from(id);
    });
    // this.name = shortString.decodeShortString(player.name);
    this.name = shortString.decodeShortString(`0x${player.name.toString(16)}`);
  }

  getShortAddress(): string {
    return shortenHex(this.id);
  }

  getShortName(): string {
    return this.name.length > 16 ? `${this.name.slice(0, 13)}...` : this.name;
  }
}
