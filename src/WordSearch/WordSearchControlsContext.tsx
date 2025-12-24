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
  encodeCryptogram: boolean;
  setEncodeCryptogram: (value: boolean) => void;
  decodeCryptogram: boolean;
  setDecodeCryptogram: (value: boolean) => void;
  selectedLetters: Set<string>;
  setSelectedLetters: (value: Set<string>) => void;
  excludeLettersInWords: boolean;
  setExcludeLettersInWords: (value: boolean) => void;
  isCryptogramActive: boolean;
  cellHighlights: Record<string, CellHighlight>;
  cryptogramEncodeMapping: Record<string, string>;
  cryptogramDecodeMapping: Record<string, string>;
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


