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
    // Special case for when storage is by default 0
    if (index == 0) {
      return new Side(SideType.One);
    }
    const item = Object.values(SideType)[index];
    return new Side(item);
  }
}
