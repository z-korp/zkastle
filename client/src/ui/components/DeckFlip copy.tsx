import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FlipCard, { CARD_HEIGHT, CARD_WIDTH } from "./FlipCard/FlipCard";
import { Card, CardType } from "@/dojo/game/types/card";
import { Button } from "../elements/button";
import { Side, SideType } from "@/dojo/game/types/side";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";

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

const Deck: React.FC = () => {
  const {
    account: { account },
  } = useDojo();

  const firstRender = useRef(true);

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({
    gameId: player?.game_id || "0x0",
  });

  const [cards, setCards] = useState<
    {
      data: { card: Card; side: Side; id: number };
      zIndex: number;
      position: PositionType;
    }[]
  >([]); // Initial state is an empty array
  const [cards2, setCards2] = useState<
    {
      data: { card: Card; side: Side; id: number };
      zIndex: number;
      position: PositionType;
    }[]
  >([]); // Initial state is an empty array
  const [coordinates, setCoordinates] = useState(
    getPositionCoordinates(window.innerWidth, window.innerHeight),
  );

  useEffect(() => {
    const handleResize = () => {
      setCoordinates(
        getPositionCoordinates(window.innerWidth, window.innerHeight),
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPositions = (
    index: number,
    deck: number,
    discard: number,
    hand: number,
  ): PositionType => {
    if (index === 0) {
      return PositionType.First;
    } else if (index === 1) {
      if (hand === 2) return PositionType.Second;
      else return PositionType.Discard; // hand === 1
    } else {
      if (index - 2 < deck) return PositionType.Deck;
      else return PositionType.Discard;
    }
  };

  useEffect(() => {
    if (game) console.log("---->", game.move_count, game.getDeckHandDiscard());
  }, [game]);

  useEffect(() => {
    if (firstRender.current && game?.cardsFull && game?.getDeckHandDiscard()) {
      //console.log("aaaaaa", game.cardsFull);
      const card_in_deck = game.getDeckHandDiscard().deck;
      const card_in_discard = game.getDeckHandDiscard().discard;
      const card_in_hand = game.getDeckHandDiscard().hand;
      console.log(
        game.move_count,
        "card_in_deck",
        card_in_deck,
        "card_in_discard",
        card_in_discard,
        "card_in_hand",
        card_in_hand,
      );

      const updatedCards = game.cardsFull.map((cardData, index: number) => ({
        zIndex: game.cardsFull.length - index,
        data: {
          card: cardData.card,
          side: cardData.side,
          id: cardData.id,
        },
        position: getPositions(
          index,
          card_in_deck,
          card_in_discard,
          card_in_hand,
        ),
      }));
      setCards(updatedCards);

      firstRender.current = false;
    }
  }, [game]);

  useEffect(() => {
    if (!game || firstRender.current) return;

    // Update the positions of the cards based on game state
    setCards((prevCards) => {
      const card_in_deck = game.getDeckHandDiscard().deck;
      const card_in_discard = game.getDeckHandDiscard().discard;
      const card_in_hand = game.getDeckHandDiscard().hand;

      const updatedCards = game.cardsFull.map((cardData, index: number) => ({
        id: cardData.id,
        position: getPositions(
          index,
          card_in_deck,
          card_in_discard,
          card_in_hand,
        ),
      }));

      return prevCards.map((card) => {
        const updatedCard = updatedCards.find((c) => c.id === card.data.id);

        let zIndex = card.zIndex;
        if (
          card.position === PositionType.First ||
          card.position === PositionType.Second
        )
          zIndex = Math.max(...prevCards.map((card) => card.zIndex)) + 1;

        return updatedCard
          ? {
              ...card,
              position: updatedCard.position,
              zIndex,
            }
          : card;
      });
    });
  }, [game]);

  //console.log(cards.map((card) => ({ id: card.data.id, position: card.position })),);

  const discardCard = (positionToDiscard: PositionType) => {
    setCards((prevCards) => {
      const newCards = prevCards.map((card) => ({ ...card })); // Clone the array to avoid direct mutations
      const discardIndex = newCards.findIndex(
        (card) => card.position === positionToDiscard,
      );
      const secondIndex = newCards.findIndex(
        (card) => card.position === PositionType.Second,
      );
      const topDeckIndex = newCards.findIndex(
        (card) => card.position === PositionType.Deck,
      );

      if (discardIndex !== -1) {
        newCards[discardIndex].position = PositionType.Discard;
        newCards[discardIndex].zIndex =
          Math.max(...newCards.map((card) => card.zIndex)) + 1; // Increment zIndex
      }

      if (positionToDiscard === PositionType.First) {
        // Move the second card to the first position
        if (secondIndex !== -1)
          newCards[secondIndex].position = PositionType.First;
        // Move the top deck card to the second position
        if (topDeckIndex !== -1)
          newCards[topDeckIndex].position = PositionType.Second;
      } else if (positionToDiscard === PositionType.Second) {
        // Move the top deck card to the second position
        if (topDeckIndex !== -1)
          newCards[topDeckIndex].position = PositionType.Second;
      }

      return newCards;
    });
  };

  const getCardPosition = (position: PositionType) => {
    return coordinates[position];
  };

  const countCardsInPosition = (position: PositionType) => {
    return cards.filter((card) => card.position === position).length;
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="relative mb-4 w-full">
        <div className="absolute top-16 left-[40%] transform -translate-x-1/2 flex flex-col items-center">
          <span>Deck</span>
          <span>{countCardsInPosition(PositionType.Deck)}</span>
        </div>
        <div className="absolute top-16 right-[38%] transform translate-x-1/2 flex flex-col items-center">
          <span>Discard</span>
          <span>{countCardsInPosition(PositionType.Discard)}</span>
        </div>
      </div>
      <div className="relative">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ x: 0, y: 0 }}
            animate={getCardPosition(card.position)}
            transition={{ type: "spring", stiffness: 40 }}
            className="absolute"
            style={{
              zIndex: card.zIndex,
            }}
          >
            <FlipCard
              index={index}
              isFlipped={card.position === PositionType.Discard}
              data={{
                card: card.data.card,
                side: card.data.side,
                id: card.data.id,
              }}
              first={card.position === PositionType.First}
            />
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-0 mt-4 flex justify-center">
        <Button
          onClick={() => discardCard(PositionType.First)}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Discard First Card
        </Button>
        <Button
          onClick={() => discardCard(PositionType.Second)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Discard Second Card
        </Button>
      </div>
    </div>
  );
};

export default Deck;
