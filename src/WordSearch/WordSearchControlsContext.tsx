import React, { createContext, useContext } from "react";
import { CellHighlight } from "./types";

interface WordSearchControlsContextValue {
  highlightForwards: boolean;
  setHighlightForwards: (value: boolean) => void;
  highlightForwardsExtra: boolean;
  setHighlightForwardsExtra: (value: boolean) => void;
  highlightBackwards: boolean;
  setHighlightBackwards: (value: boolean) => void;
  highlightBackwardsExtra: boolean;
  setHighlightBackwardsExtra: (value: boolean) => void;
  highlightSecretMessage: boolean;
  setHighlightSecretMessage: (value: boolean) => void;
  highlightUnscrambledSecretMessage: boolean;
  setHighlightUnscrambledSecretMessage: (value: boolean) => void;
  unifyWordHighlightColors: boolean;
  setUnifyWordHighlightColors: (value: boolean) => void;
  encodeCryptogram: boolean;
  setEncodeCryptogram: (value: boolean) => void;
  decodeCryptogram: boolean;
  setDecodeCryptogram: (value: boolean) => void;
  selectedLetters: Set<string>;
  setSelectedLetters: (value: Set<string>) => void;
  excludeLettersInWords: boolean;
  setExcludeLettersInWords: (value: boolean) => void;
  applyHighlightsToOriginalGrid: boolean;
  setApplyHighlightsToOriginalGrid: (value: boolean) => void;
  forwardsWords: string[];
  setForwardsWords: (words: string[]) => void;
  forwardsWordsExtra: string[];
  setForwardsWordsExtra: (words: string[]) => void;
  backwardsWords: string[];
  setBackwardsWords: (words: string[]) => void;
  backwardsWordsExtra: string[];
  setBackwardsWordsExtra: (words: string[]) => void;
  secretMessageWords: string[];
  setSecretMessageWords: (words: string[]) => void;
  unscrambledSecretMessageWords: string[];
  setUnscrambledSecretMessageWords: (words: string[]) => void;
  isCryptogramActive: boolean;
  cellHighlights: Record<string, CellHighlight>;
  cryptogramEncodeMapping: Record<string, string>;
  cryptogramDecodeMapping: Record<string, string>;
  manualHighlights: Record<string, number>; // cell key -> color group (0-5, 0 = no highlight)
  setManualHighlights: (highlights: Record<string, number>) => void;
  colorGroupRotations: number[]; // rotation value for each color group (0-5)
  setColorGroupRotations: (rotations: number[]) => void;
  cryptogramKey: string; // 26-character cryptogram key
  setCryptogramKey: (key: string) => void;
  gridRows: string[];
  shiftRowLeft: (rowIndex: number) => void;
  shiftRowRight: (rowIndex: number) => void;
  shiftColUp: (colIndex: number) => void;
  shiftColDown: (colIndex: number) => void;
  shiftRowsUp: () => void;
  shiftRowsDown: () => void;
  shiftColsLeft: () => void;
  shiftColsRight: () => void;
  resetGrid: () => void;
  showUnscrambledGrid: boolean;
  setShowUnscrambledGrid: (value: boolean) => void;
  showGridAxes: boolean;
  setShowGridAxes: (value: boolean) => void;
}

const WordSearchControlsContext = createContext<
  WordSearchControlsContextValue | undefined
>(undefined);

interface ProviderProps {
  value: WordSearchControlsContextValue;
  children: React.ReactNode;
}

export const WordSearchControlsProvider: React.FC<ProviderProps> = ({
  value,
  children,
}) => {
  return (
    <WordSearchControlsContext.Provider value={value}>
      {children}
    </WordSearchControlsContext.Provider>
  );
};

export const useWordSearchControls = (): WordSearchControlsContextValue => {
  const ctx = useContext(WordSearchControlsContext);
  if (!ctx) {
    throw new Error(
      "useWordSearchControls must be used within a WordSearchControlsProvider"
    );
  }
  return ctx;
};


