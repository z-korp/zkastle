export class Packer {
  public static unpack(packed: number, size: number, len: number) {
    let result = [];
    let modulo = size;
    let index = 0;
    while (index !== len) {
      const value = packed % modulo;
      result.push(value);
      packed = Math.floor(packed / modulo);
      index += 1;
    }
    return result;
  }
}
