export class Resource {
  public wheat: number;
  public stone: number;
  public iron: number;

  constructor(wheat: number, stone: number, iron: number) {
    this.wheat = wheat;
    this.stone = stone;
    this.iron = iron;
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
}
