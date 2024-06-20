import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FlipCard, { CARD_HEIGHT, CARD_WIDTH } from "./FlipCard/FlipCard";
import { Card } from "@/dojo/game/types/card";
import { Side } from "@/dojo/game/types/side";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";
import { useGameStore } from "@/stores/game";
import { ShowUprade } from "../containers/ShowUpgrade";

enum PositionType {
  Deck,
  Discard,
  Second,
  First,
}

const getPositionCoordinates = (width: number, height: number) => {
  const widthBetweenCards = Math.max(width / 30, 15);
  return {
    [PositionType.Deck]: {
      x: -CARD_WIDTH - widthBetweenCards / 2,
      y: height / 8,
    },
    [PositionType.Discard]: {
      x: widthBetweenCards,
      y: height / 8,
    },
    [PositionType.Second]: {
      x: -CARD_WIDTH - widthBetweenCards / 2,
      y: height / 8 + CARD_HEIGHT + widthBetweenCards,
    },
    [PositionType.First]: {
      x: widthBetweenCards,
      y: height / 8 + CARD_HEIGHT + widthBetweenCards,
    },
  };
};

const Table: React.FC = () => {
  const {
    account: { account },
  } = useDojo();

  const firstRender = useRef(true);

  const { upgradeToShow } = useGameStore();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const [firstDeckHover, setFirstDeckHover] = useState(true);

  const [cards, setCards] = useState<
    {
      data: { card: Card; side: Side; id: number };
      zIndex: number;
      position: PositionType;
    }[]
  >([]);
  const [coordinates, setCoordinates] = useState(
    getPositionCoordinates(window.innerWidth, window.innerHeight),
  );

  const [discardCoordinates, setDiscardCoordinates] = useState(
    getPositionCoordinates(window.innerWidth, window.innerHeight)[
      PositionType.Discard
    ],
  );

  useEffect(() => {
    const handleResize = () => {
      const newCoordinates = getPositionCoordinates(
        window.innerWidth,
        window.innerHeight,
      );
      setCoordinates(newCoordinates);
      setDiscardCoordinates(newCoordinates[PositionType.Discard]);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (firstRender.current && game?.cardsFull && game?.getCardInHand()) {
      const updatedCards = game.cardsFull.map((cardData, index: number) => ({
        zIndex: game.cardsFull.length - index,
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
    if (!game || firstRender.current) return;

    // Update the positions of the cards based on game state
    setCards((prevCards) => {
      const updatedCards = game.cardsFull.map((cardData, index: number) => ({
        id: cardData.id,
        position: getPositions(index, game.getCardInHand()),
      }));

      return prevCards.map((card) => {
        const updatedCard = updatedCards.find((c) => c.id === card.data.id);

        // if the card is moved from hand to deck, update the zIndex
        // to be the lowest of all cards
        let zIndex = card.zIndex;
        if (
          updatedCard?.position === PositionType.Deck &&
          (card.position === PositionType.First ||
            card.position === PositionType.Second)
        ) {
          zIndex = Math.min(...prevCards.map((card) => card.zIndex)) - 1;
        }

        return updatedCard
          ? {
              ...card,
              position: updatedCard.position,
              zIndex: zIndex,
            }
          : card;
      });
    });
  }, [game]);

  const getCardPosition = (position: PositionType) => {
    return coordinates[position];
  };

  const isFirstCardInDeck = (card: {
    data: { card: Card; side: Side; id: number };
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
    <div className="flex flex-col items-center h-screen">
      <div className="relative">
        <ShowUprade coords={discardCoordinates} />
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
              onMouseEnter={() => {
                if (isFirstCardInDeck(card)) setFirstDeckHover(true);
              }}
              onMouseLeave={() => {
                if (isFirstCardInDeck(card)) setFirstDeckHover(false);
              }}
            >
              <FlipCard
                zIndex={card.zIndex}
                index={index}
                isFlipped={
                  // Show the card flipped if in Deck pile
                  // If it's the first card in the deck, show it flipped only if hovering
                  card.position === PositionType.Deck &&
                  (!isFirstCardInDeck(card) ||
                    (isFirstCardInDeck(card) && !firstDeckHover))
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
                    !game.inStorage(game.card_one.id)) ||
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
