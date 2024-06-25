import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card/Card";
import { Game } from "@/dojo/game/models/game";
import { PositionType } from "@/helpers/screen";
import { BoardCard } from "@/ui/containers/Board";

interface DeckCardProps {
  game: Game;
  card: BoardCard;
  index: number;
  cards: BoardCard[];
  coordinates: Record<PositionType, { x: number; y: number }>;
}

export const DeckCard = (props: DeckCardProps) => {
  const { game, card, index, cards, coordinates } = props;

  const getCardPosition = (position: PositionType) => {
    return coordinates[position];
  };

  // Get deck cards and sort them by zIndex in descending order
  const deckCards = useMemo(() => {
    return cards
      .filter((c) => c.position === PositionType.Deck)
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [cards]);

  // Calculate rotation for the deck cards
  const rotation = useMemo(() => {
    const deckIndex = deckCards.findIndex((c) => c.data.id === card.data.id);
    if (deckIndex !== -1 && deckIndex < deckCards.length) {
      return -(deckCards.length - 1 - deckIndex); // -1 degree for each card in the deck
    }
    return 0;
  }, [deckCards, card]);

  const isFirst = useCallback(
    (card: BoardCard) => {
      return (
        card.position === PositionType.Deck &&
        card.zIndex ===
          Math.max(
            ...cards
              .filter((c) => c.position === PositionType.Deck)
              .map((c) => c.zIndex),
          )
      );
    },
    [cards],
  );

  const isFlipped = useMemo(() => {
    // Show the card flipped if in Deck pile except for the first card
    // or if there are less than 3 cards in the deck
    if (!game) return false;
    return (
      card.position === PositionType.Deck &&
      (!isFirst(card) || game.getRemaining() < 3)
    );
  }, [card, game, isFirst]);

  const stored = useMemo(() => {
    return game.inStorage(card.data.id);
  }, [card, game]);

  const actionable = useMemo(() => {
    return (
      card.position !== PositionType.Deck &&
      !stored &&
      !game.inStorage(game.card_one.id)
    );
  }, [card, game, stored]);

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
        isFlipped={isFlipped}
        data={{
          card: card.data.card,
          side: card.data.side,
          id: card.data.id,
        }}
        greyed={isFirst(card)}
        first={card.position === PositionType.First}
        actionable={actionable}
        stored={stored}
      />
    </motion.div>
  );
};
