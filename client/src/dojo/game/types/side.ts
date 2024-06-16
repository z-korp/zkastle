export enum SideType {
  None = "None",
  One = "One",
  Two = "Two",
  Three = "Three",
  Four = "Four",
}

export class Side {
  value: SideType;

  constructor(value: SideType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(SideType).indexOf(this.value);
  }

  public static from(index: number): Side {
    const item = Object.values(SideType)[index];
    return new Side(item);
  }
}
