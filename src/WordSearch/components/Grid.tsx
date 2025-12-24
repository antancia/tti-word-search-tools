import React from "react";
import {
  forwardsColors,
  backwardsColors,
  secretMessageColor,
  grid,
} from "../constants";
import { blendColors } from "../helpers";
import { useWordSearchControls } from "../WordSearchControlsContext";

export const Grid: React.FC = () => {
  const {
    cellHighlights,
    encodeCryptogram,
    decodeCryptogram,
    cryptogramEncodeMapping,
    cryptogramDecodeMapping,
    selectedLetters,
    excludeLettersInWords,
  } = useWordSearchControls();
  return (
    <div className="grid-container">
      <div className="grid">
        {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.split("").map((letter, colIndex) => {
            const key = `${rowIndex},${colIndex}`;
            const highlight = cellHighlights[key] || {
              wordInstances: [],
            };
            const wordInstances = highlight.wordInstances;

            // Replace letter with cryptogram key mapping if enabled
            let displayLetter = letter;
            if (encodeCryptogram) {
              // Encode: replace original letter with key letter
              displayLetter =
                cryptogramEncodeMapping[letter.toUpperCase()] || letter;
            } else if (decodeCryptogram) {
              // Decode: replace key letter with original letter
              displayLetter =
                cryptogramDecodeMapping[letter.toUpperCase()] || letter;
            }

            let backgroundColor = "";
            if (wordInstances.length > 0) {
              // Get colors for all word instances using this cell
              const colors = wordInstances.map((instance) => {
                // Secret message words use a unique color
                if (instance.isSecretMessage) {
                  return secretMessageColor;
                }
                const colorId =
                  instance.colorId %
                  (instance.isBackwards
                    ? backwardsColors.length
                    : forwardsColors.length);
                return instance.isBackwards
                  ? backwardsColors[colorId]
                  : forwardsColors[colorId];
              });

              // Blend colors if multiple words share this cell
              backgroundColor = blendColors(colors);
            }

            // Check if this letter should be highlighted based on selected letters
            // Exclude if it's part of a highlighted word and the option is enabled
            const isPartOfHighlightedWord = wordInstances.length > 0;
            const shouldExclude =
              excludeLettersInWords && isPartOfHighlightedWord;
            const isLetterHighlighted =
              selectedLetters.has(displayLetter.toUpperCase()) && !shouldExclude;
            const letterHighlightColor = isLetterHighlighted
              ? "rgba(0, 255, 255, 0.6)"
              : ""; // Cyan color to distinguish from word highlights

            // Combine word highlighting with letter highlighting
            let finalBackgroundColor = backgroundColor;
            if (isLetterHighlighted) {
              if (backgroundColor) {
                // Blend letter highlight with word highlight
                finalBackgroundColor = blendColors([
                  backgroundColor,
                  letterHighlightColor,
                ]);
              } else {
                finalBackgroundColor = letterHighlightColor;
              }
            }

            const className = `grid-cell ${
              wordInstances.length > 0 ? "highlighted" : ""
            } ${isLetterHighlighted ? "letter-highlighted" : ""}`;
            const style = finalBackgroundColor
              ? { backgroundColor: finalBackgroundColor }
              : {};

            return (
              <div key={colIndex} className={className} style={style}>
                {displayLetter}
              </div>
            );
          })}
        </div>
      ))}
      </div>
    </div>
  );
};


