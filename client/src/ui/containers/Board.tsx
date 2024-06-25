import React, { useState, useEffect, useRef } from "react";
import { DeckCard } from "./Deck";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";
import { Upgrade } from "../components/Upgrade";
import { CardDetail } from "@/dojo/game/models/game";
import { CARD_WIDTH, CARD_HEIGHT } from "../constants";
import { useMediaQuery } from "react-responsive";
import {
  PositionType,
  getPositionCoordinates,
  getPositions,
} from "@/helpers/screen";

export interface BoardCard {
  data: CardDetail;
  zIndex: number;
  position: PositionType;
}

export const Board: React.FC = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({ gameId: player?.game_id });

  const isMdOrLarger = useMediaQuery({ query: "(min-width: 768px)" });
  const firstRender = useRef(true);

  const [cards, setCards] = useState<BoardCard[]>([]);
  const [coordinates, setCoordinates] = useState(
    getPositionCoordinates(
      isMdOrLarger,
      window.innerWidth,
      window.innerHeight,
      CARD_WIDTH,
      CARD_HEIGHT,
    ),
  );
  const [deckCoordinates, setDeckCoordinates] = useState(
    getPositionCoordinates(
      isMdOrLarger,
      window.innerWidth,
      window.innerHeight,
      CARD_WIDTH,
      CARD_HEIGHT,
    )[PositionType.Deck],
  );

  // Update the coordinates when the screen size changes
  useEffect(() => {
    const handleResize = () => {
      const newCoordinates = getPositionCoordinates(
        isMdOrLarger,
        window.innerWidth,
        window.innerHeight,
        CARD_WIDTH,
        CARD_HEIGHT,
      );
      setCoordinates(newCoordinates);
      setDeckCoordinates(newCoordinates[PositionType.Deck]);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMdOrLarger]);

  // Update the cards when the game state changes
  useEffect(() => {
    if (!firstRender.current || !game || !game.cards || !game.getCardInHand())
      return;
    const updatedCards = game.cards.map(
      (detail: CardDetail, index: number) => ({
        zIndex: 1000 + (game.cards.length - index),
        data: {
          card: detail.card,
          side: detail.side,
          id: detail.id,
        },
        position: getPositions(index, game.getCardInHand()),
      }),
    );
    setCards(updatedCards);
    firstRender.current = false;
  }, [game]);

  useEffect(() => {
    if (!game || !game.isOver()) return;
    // Reset firstRender if the game is over
    firstRender.current = true;
  }, [game]);

  useEffect(() => {
    if (!game || firstRender.current) return;

    // Update the positions of the cards based on game state
    setCards((prevCards) => {
      const updatedCards = game.cards.map(
        (detail: CardDetail, index: number) => ({
          id: detail.id,
          position: getPositions(index, game.getCardInHand()),
          card: detail.card,
          side: detail.side,
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

  if (!player || !game || game.isOver()) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Upgrade
          coords={{
            x: deckCoordinates.x,
            y: deckCoordinates.y + CARD_HEIGHT / 2,
          }}
        />
        {cards.map((card, index) => (
          <DeckCard
            key={index}
            game={game}
            card={card}
            index={index}
            cards={cards}
            coordinates={coordinates}
          />
        ))}
      </div>
    </div>
  );
};
