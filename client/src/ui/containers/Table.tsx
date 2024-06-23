import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card/Card";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";
import { ShowUprade } from "../containers/ShowUpgrade";
import { CardDetail } from "@/dojo/game/models/game";
import { CARD_WIDTH, CARD_HEIGHT } from "../constants";
import { useMediaQuery } from "react-responsive";

enum PositionType {
  Deck,
  Second,
  First,
}

const getPositionCoordinates = (
  isMdOrLarger: boolean,
  width: number,
  height: number,
) => {
  const widthBetweenCards = Math.max(width / 30, 15) - (isMdOrLarger ? 0 : 20);

  return {
    [PositionType.Deck]: {
      x: -CARD_WIDTH / 2,
      y: height / 8,
    },
    [PositionType.Second]: {
      x: -CARD_WIDTH - widthBetweenCards / 2,
      y: height / 8 + CARD_HEIGHT + widthBetweenCards - (isMdOrLarger ? 0 : 13),
    },
    [PositionType.First]: {
      x: widthBetweenCards,
      y: height / 8 + CARD_HEIGHT + widthBetweenCards - (isMdOrLarger ? 0 : 13),
    },
  };
};

const Table: React.FC = () => {
  const {
    account: { account },
  } = useDojo();

  const isMdOrLarger = useMediaQuery({ query: "(min-width: 768px)" });

  const firstRender = useRef(true);

  const { player } = usePlayer({ playerId: account?.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const [cards, setCards] = useState<
    {
      data: CardDetail;
      zIndex: number;
      position: PositionType;
    }[]
  >([]);
  const [coordinates, setCoordinates] = useState(
    getPositionCoordinates(isMdOrLarger, window.innerWidth, window.innerHeight),
  );

  const [deckCoordinates, setDeckCoordinates] = useState(
    getPositionCoordinates(isMdOrLarger, window.innerWidth, window.innerHeight)[
      PositionType.Deck
    ],
  );

  useEffect(() => {
    const handleResize = () => {
      const newCoordinates = getPositionCoordinates(
        isMdOrLarger,
        window.innerWidth,
        window.innerHeight,
      );
      setCoordinates(newCoordinates);
      setDeckCoordinates(newCoordinates[PositionType.Deck]);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMdOrLarger]);

  const getPositions = (index: number, hand: number): PositionType => {
    if (index === 0) {
      return PositionType.First;
    } else if (index === 1) {
      if (hand === 2) return PositionType.Second;
      else return PositionType.Deck; // hand === 1
    } else {
      return PositionType.Deck;
    }
  };

  useEffect(() => {
    if (firstRender.current && game?.cards && game?.getCardInHand()) {
      const updatedCards = game.cards.map((cardData, index: number) => ({
        zIndex: 1000 + (game.cards.length - index),
        data: {
          card: cardData.card,
          side: cardData.side,
          id: cardData.id,
        },
        position: getPositions(index, game.getCardInHand()),
      }));
      setCards(updatedCards);

      firstRender.current = false;
    }
  }, [game]);

  useEffect(() => {
    if (game?.isOver()) {
      firstRender.current = true; // Reset firstRender if the game is over
    }
  }, [game]);

  useEffect(() => {
    if (!game || firstRender.current) return;

    // Update the positions of the cards based on game state
    setCards((prevCards) => {
      const updatedCards = game.cards.map(
        (cardData: CardDetail, index: number) => ({
          id: cardData.id,
          position: getPositions(index, game.getCardInHand()),
          card: cardData.card,
          side: cardData.side,
        }),
      );

      return prevCards.map((cardData) => {
        const updatedCard = updatedCards.find((c) => c.id === cardData.data.id);

        // if the card is moved from hand to deck, update the zIndex
        // to be the lowest of all cards
        let zIndex = cardData.zIndex;
        if (
          updatedCard?.position === PositionType.Deck &&
          (cardData.position === PositionType.First ||
            cardData.position === PositionType.Second)
        ) {
          zIndex = Math.min(...prevCards.map((card) => card.zIndex)) - 1;
        }

        return updatedCard
          ? {
              data: {
                card: updatedCard.card,
                side: updatedCard.side,
                id: updatedCard.id,
              },
              position: updatedCard.position,
              zIndex,
            }
          : cardData;
      });
    });
  }, [game]);

  const getCardPosition = (position: PositionType) => {
    return coordinates[position];
  };

  const isFirstCardInDeck = (card: {
    data: CardDetail;
    zIndex: number;
    position: PositionType;
  }) => {
    return (
      card.position === PositionType.Deck &&
      card.zIndex ===
        Math.max(
          ...cards
            .filter((c) => c.position === PositionType.Deck)
            .map((c) => c.zIndex),
        )
    );
  };

  if (!player || !game || game.isOver()) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <ShowUprade
          coords={{
            x: deckCoordinates.x,
            y: deckCoordinates.y + CARD_HEIGHT / 2,
          }}
        />
        {cards.map((card, index) => {
          // Get deck cards and sort them by zIndex in descending order
          const deckCards = cards
            .filter((c) => c.position === PositionType.Deck)
            .sort((a, b) => a.zIndex - b.zIndex);

          // Calculate rotation for the deck cards
          let rotation = 0;
          const deckIndex = deckCards.findIndex(
            (c) => c.data.id === card.data.id,
          );
          if (deckIndex !== -1 && deckIndex < deckCards.length) {
            rotation = -(deckCards.length - 1 - deckIndex); // -1 degree for each card in the deck
          }

          return (
            <motion.div
              key={index}
              initial={{ x: 0, y: 0 }}
              animate={{ ...getCardPosition(card.position), rotate: rotation }}
              transition={{ type: "spring", stiffness: 40 }}
              className="absolute"
              style={{
                zIndex: card.zIndex,
              }}
            >
              <Card
                isFlipped={
                  // Show the card flipped if in Deck pile except for the first card
                  // or if there are less than 3 cards in the deck
                  card.position === PositionType.Deck &&
                  (!isFirstCardInDeck(card) || game?.getRemaining() < 3)
                }
                data={{
                  card: card.data.card,
                  side: card.data.side,
                  id: card.data.id,
                }}
                greyed={isFirstCardInDeck(card)}
                first={card.position === PositionType.First}
                actionable={
                  (card.position === PositionType.First &&
                    !game.inStorage(game.card_one.id) &&
                    !game.inStorage(game.card_two.id)) ||
                  (card.position === PositionType.Second &&
                    !game.inStorage(game.card_two.id))
                }
                stored={
                  (card.position === PositionType.First &&
                    game.inStorage(game.card_one.id)) ||
                  (card.position === PositionType.Second &&
                    game.inStorage(game.card_two.id))
                }
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
