import { ComponentValue } from "@dojoengine/recs";
import { shortenHex } from "@dojoengine/utils";
import { shortString } from "starknet";
import { Packer } from "../helpers/packer";
import { Achievement } from "../types/achievement";

export interface AchivementDetail {
  id: number;
  achievement: Achievement;
}

export class Player {
  public id: string;
  public game_id: string;
  public achievements: AchivementDetail[];
  public name: string;

  constructor(player: ComponentValue) {
    this.id = player.id;
    this.game_id = player.game_id;
    this.achievements = Packer.unpack(player.achievements, 2n)
      .map((value, index) => {
        if (value === 0) return null;
        let id = index + 1;
        return { id, achievement: Achievement.from(id) };
      })
      .filter((detail) => detail !== null) as AchivementDetail[];
    this.name = shortString.decodeShortString(player.name);
  }

  getShortAddress(): string {
    return shortenHex(this.id);
  }

  getShortName(): string {
    return this.name.length > 16 ? `${this.name.slice(0, 13)}...` : this.name;
  }

  has(achivement: Achievement): boolean {
    return this.achievements.some(
      (detail) => detail.achievement.value === achivement.value,
    );
  }
}
