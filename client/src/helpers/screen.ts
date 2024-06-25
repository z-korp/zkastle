export enum PositionType {
  Deck,
  Second,
  First,
}

export const getPositionCoordinates = (
  isMdOrLarger: boolean,
  width: number,
  height: number,
  cardWidth: number,
  cardHeight: number,
) => {
  const widthBetweenCards = Math.max(width / 30, 15) - (isMdOrLarger ? 0 : 20);

  return {
    [PositionType.Deck]: {
      x: -cardWidth / 2,
      y: height / 8,
    },
    [PositionType.Second]: {
      x: -cardWidth - widthBetweenCards / 2,
      y: height / 8 + cardHeight + widthBetweenCards - (isMdOrLarger ? 0 : 13),
    },
    [PositionType.First]: {
      x: widthBetweenCards,
      y: height / 8 + cardHeight + widthBetweenCards - (isMdOrLarger ? 0 : 13),
    },
  };
};

export const getPositions = (index: number, hand: number): PositionType => {
  if (index === 0) {
    return PositionType.First;
  } else if (index === 1) {
    if (hand === 2) return PositionType.Second;
    else return PositionType.Deck;
  } else {
    return PositionType.Deck;
  }
};
