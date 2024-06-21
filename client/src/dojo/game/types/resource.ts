export class Resource {
  public wheat: number;
  public stone: number;
  public iron: number;
  public message: string;

  constructor(wheat: number, stone: number, iron: number, message = "") {
    this.wheat = wheat;
    this.stone = stone;
    this.iron = iron;
    this.message = message;
  }

  public add(resource: Resource): Resource {
    return new Resource(
      this.wheat + resource.wheat,
      this.stone + resource.stone,
      this.iron + resource.iron,
    );
  }

  public isEqual(resource: Resource): boolean {
    return (
      this.wheat === resource.wheat &&
      this.stone === resource.stone &&
      this.iron === resource.iron
    );
  }

  public isGe(resource: Resource): boolean {
    return (
      this.wheat >= resource.wheat &&
      this.stone >= resource.stone &&
      this.iron >= resource.iron
    );
  }

  public isNull(): boolean {
    return this.isEqual(new Resource(0, 0, 0));
  }
}
