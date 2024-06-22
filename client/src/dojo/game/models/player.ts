import { ComponentValue } from "@dojoengine/recs";
import { shortenHex } from "@dojoengine/utils";
import { shortString } from "starknet";
import { Packer } from "../helpers/packer";
import { Achievement } from "../types/achievement";

export interface AchivementDetail {
  id: number;
  achievement: Achievement;
}
export interface EnabledDetail {
  id: number;
  achievement: Achievement;
  status: boolean;
}

export class Player {
  public id: string;
  public game_id: string;
  public card_id: number;
  public achievements: AchivementDetail[];
  public enables: EnabledDetail[];
  public name: string;

  constructor(player: ComponentValue) {
    this.id = player.id;
    this.game_id = player.game_id;
    this.card_id = player.card_id;
    this.achievements = Packer.unpack(BigInt(player.achievements), 1n)
      .map((value, index) => {
        if (value === 0) return null;
        let id = index + 1;
        return { id, achievement: Achievement.from(id) };
      })
      .filter((detail) => detail !== null) as AchivementDetail[];
    this.enables = Packer.unpack(BigInt(player.enables), 1n).map(
      (value, index) => {
        let id = index + 1;
        return { id, achievement: Achievement.from(id), status: value === 1 };
      },
    ) as EnabledDetail[];
    this.name = shortString.decodeShortString(player.name);
  }

  public getShortAddress(): string {
    return shortenHex(this.id);
  }

  public getShortName(): string {
    return this.name.length > 16 ? `${this.name.slice(0, 13)}...` : this.name;
  }

  public has(achivement: Achievement): boolean {
    return this.achievements.some(
      (detail) => detail.achievement.value === achivement.value,
    );
  }

  public isEnabled(achievement: Achievement): boolean {
    return this.enables.some(
      (detail) =>
        detail.achievement.value === achievement.value && detail.status,
    );
  }
}
