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

  public static pack(unpacked: number[], size: number) {
    let packed = 0;
    let modulo = size;
    let index = 0;
    while (index !== unpacked.length) {
      packed += unpacked[index] * Math.pow(modulo, index);
      index += 1;
    }
    return packed;
  }
}
