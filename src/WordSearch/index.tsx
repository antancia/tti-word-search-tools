import {
  ALPHABET,
  CRYPTOGRAM_KEY,
  forwardsWords,
  forwardsWordsExtra,
  backwardsWords,
  backwardsWordsExtra,
  secretMessageWords,
} from "./constants";
import { useState, useMemo } from "react";
import "../App.css";
import { CellHighlight, WordInstance } from "./types";
import {
  findSecretMessageWordsSequential,
  findWordPositions,
  overlap,
  shareEdge,
} from "./helpers";
import { WordHighlightControls } from "./components/WordHighlightControls";
import { LetterHighlightControls } from "./components/LetterHighlightControls";
import { CryptogramControls } from "./components/CryptogramControls";
import { WordSearchControlsProvider } from "./WordSearchControlsContext";
import { Grid } from "./components/Grid";

export default function WordSearch() {
  const [highlightForwards, setHighlightForwards] = useState<boolean>(false);
  const [highlightForwardsExtra, setHighlightForwardsExtra] =
    useState<boolean>(false);
  const [highlightBackwards, setHighlightBackwards] = useState<boolean>(false);
  const [highlightBackwardsExtra, setHighlightBackwardsExtra] =
    useState<boolean>(false);
  const [highlightSecretMessage, setHighlightSecretMessage] =
    useState<boolean>(false);
  const [encodeCryptogram, setEncodeCryptogram] = useState<boolean>(false);
  const [decodeCryptogram, setDecodeCryptogram] = useState<boolean>(false);
  const [selectedLetters, setSelectedLetters] = useState<Set<string>>(
    new Set()
  );
  const [excludeLettersInWords, setExcludeLettersInWords] =
    useState<boolean>(false);

  // Create mapping from letter (A-Z) to cryptogram key letter (encoding)
  const cryptogramEncodeMapping = useMemo(() => {
    const mapping: Record<string, string> = {};
    for (let i = 0; i < ALPHABET.length; i++) {
      const keyLetter = CRYPTOGRAM_KEY[i];
      const letter = ALPHABET[i];
      mapping[letter] = keyLetter === "?" ? "?" : keyLetter;
    }
    return mapping;
  }, []);

  // Create reverse mapping from cryptogram key letter to original letter (decoding)
  const cryptogramDecodeMapping = useMemo(() => {
    const mapping: Record<string, string> = {};
    for (let i = 0; i < ALPHABET.length; i++) {
      const keyLetter = CRYPTOGRAM_KEY[i];
      const letter = ALPHABET[i];
      if (keyLetter !== "?") {
        mapping[keyLetter] = letter;
      }
    }
    return mapping;
  }, []);

  const isCryptogramActive = encodeCryptogram || decodeCryptogram;

  // Calculate which cells are highlighted
  const cellHighlights = useMemo(() => {
    // Don't calculate highlights if cryptogram tool is active
    if (isCryptogramActive) {
      return {};
    }

    const highlights: Record<string, CellHighlight> = {};
    const allWordInstances: WordInstance[] = [];
    let forwardsColorIndex = 0;
    let backwardsColorIndex = 0;

    // Collect all word instances
    if (highlightForwards) {
      forwardsWords.forEach((word) => {
        const positions = findWordPositions(word, false);
        positions.forEach((wordPositions) => {
          allWordInstances.push({
            word,
            positions: wordPositions,
            isBackwards: false,
            colorId: forwardsColorIndex++,
          });
        });
      });
    }

    if (highlightForwardsExtra) {
      forwardsWordsExtra.forEach((word) => {
        const positions = findWordPositions(word, false);
        positions.forEach((wordPositions) => {
          allWordInstances.push({
            word,
            positions: wordPositions,
            isBackwards: false,
            colorId: forwardsColorIndex++,
          });
        });
      });
    }

    if (highlightBackwards) {
      backwardsWords.forEach((word) => {
        const positions = findWordPositions(word, true);
        positions.forEach((wordPositions) => {
          allWordInstances.push({
            word,
            positions: wordPositions,
            isBackwards: true,
            colorId: backwardsColorIndex++,
          });
        });
      });
    }

    if (highlightBackwardsExtra) {
      backwardsWordsExtra.forEach((word) => {
        const positions = findWordPositions(word, true);
        positions.forEach((wordPositions) => {
          allWordInstances.push({
            word,
            positions: wordPositions,
            isBackwards: true,
            colorId: backwardsColorIndex++,
          });
        });
      });
    }

    if (highlightSecretMessage) {
      // Find secret message words by sequential scanning
      const secretMessageInstances = findSecretMessageWordsSequential();
      secretMessageInstances.forEach((instance) => {
        allWordInstances.push({
          ...instance,
          colorId: forwardsColorIndex++,
        });
      });
    }

    // Build graph of word relationships (overlap or share edge)
    const relationships: Map<number, Set<number>> = new Map();
    for (let i = 0; i < allWordInstances.length; i++) {
      const instance1 = allWordInstances[i];
      if (!relationships.has(i)) {
        relationships.set(i, new Set());
      }

      for (let j = i + 1; j < allWordInstances.length; j++) {
        const instance2 = allWordInstances[j];

        // Only check instances of the same type
        if (instance1.isBackwards !== instance2.isBackwards) continue;

        const hasOverlap = overlap(instance1, instance2);
        const hasEdgeShare = !hasOverlap && shareEdge(instance1, instance2);

        if (hasOverlap || hasEdgeShare) {
          relationships.get(i)!.add(j);
          if (!relationships.has(j)) {
            relationships.set(j, new Set());
          }
          relationships.get(j)!.add(i);
        }
      }
    }

    // Assign colors based on relationships - words that overlap/share edges get different colors
    const assignedColors = new Map<number, number>();

    // Assign colors using a greedy approach
    for (let i = 0; i < allWordInstances.length; i++) {
      if (assignedColors.has(i)) continue;

      // Find a color not used by any related word
      const related = relationships.get(i) || new Set();
      let colorId = 0;
      while (true) {
        const isColorUsed = Array.from(related).some(
          (j) => assignedColors.get(j) === colorId
        );
        if (!isColorUsed) {
          break;
        }
        colorId++;
      }

      assignedColors.set(i, colorId);
      allWordInstances[i].colorId = colorId;
    }

    // Build cell highlights - track which word instances use each cell
    allWordInstances.forEach((instance) => {
      instance.positions.forEach(({ row, col }) => {
        const key = `${row},${col}`;
        if (!highlights[key]) {
          highlights[key] = { wordInstances: [] };
        }
        highlights[key].wordInstances.push(instance);
      });
    });

    return highlights;
  }, [
    highlightForwards,
    highlightForwardsExtra,
    highlightBackwards,
    highlightBackwardsExtra,
    highlightSecretMessage,
    forwardsWords,
    forwardsWordsExtra,
    backwardsWords,
    backwardsWordsExtra,
    secretMessageWords,
    isCryptogramActive,
  ]);

  const controlsContextValue = {
    highlightForwards,
    setHighlightForwards,
    highlightForwardsExtra,
    setHighlightForwardsExtra,
    highlightBackwards,
    setHighlightBackwards,
    highlightBackwardsExtra,
    setHighlightBackwardsExtra,
    highlightSecretMessage,
    setHighlightSecretMessage,
    encodeCryptogram,
    setEncodeCryptogram,
    decodeCryptogram,
    setDecodeCryptogram,
    selectedLetters,
    setSelectedLetters,
    excludeLettersInWords,
    setExcludeLettersInWords,
    isCryptogramActive,
    cellHighlights,
    cryptogramEncodeMapping,
    cryptogramDecodeMapping,
  };

  return (
    <WordSearchControlsProvider value={controlsContextValue}>
      <div className="app">
        <h1>Past & Future Box Word Search</h1>
        <div className="main-content">
          <div className="controls-column">
            <WordHighlightControls />
            <LetterHighlightControls />
            <CryptogramControls />
          </div>
          <Grid />
        </div>
      </div>
    </WordSearchControlsProvider>
  );
}

