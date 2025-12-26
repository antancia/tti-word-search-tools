import React from "react";
import {
  forwardsColors,
  backwardsColors,
  secretMessageColor,
  grid,
} from "../constants";
import { blendColors, rotateLetter } from "../helpers";
import { useWordSearchControls } from "../WordSearchControlsContext";

// Manual highlight colors (6 different colors - dark and saturated for white text contrast)
const manualHighlightColors = [
  "", // 0 = no highlight
  "rgba(200, 40, 40, 0.9)", // 1 = dark red
  "rgba(40, 200, 40, 0.9)", // 2 = dark green
  "rgba(40, 40, 200, 0.9)", // 3 = dark blue
  "rgba(200, 150, 0, 0.9)", // 4 = dark orange
  "rgba(180, 0, 180, 0.9)", // 5 = dark magenta
  "rgba(0, 150, 150, 0.9)", // 6 = dark cyan
];

export const Grid: React.FC = () => {
  const {
    cellHighlights,
    encodeCryptogram,
    decodeCryptogram,
    cryptogramEncodeMapping,
    cryptogramDecodeMapping,
    selectedLetters,
    excludeLettersInWords,
    manualHighlights,
    setManualHighlights,
    colorGroupRotations,
  } = useWordSearchControls();

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const key = `${rowIndex},${colIndex}`;
    const currentGroup = manualHighlights[key] || 0;
    // Cycle through: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 0
    const nextGroup = (currentGroup + 1) % 7;
    const newHighlights = { ...manualHighlights };
    if (nextGroup === 0) {
      // Remove highlight if cycling back to 0
      delete newHighlights[key];
    } else {
      newHighlights[key] = nextGroup;
    }
    setManualHighlights(newHighlights);
  };
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

              // Apply manual highlight rotation if this cell is in a color group
              let displayLetter = letter;
              const colorGroup = manualHighlights[key] || 0;
              if (
                colorGroup > 0 &&
                colorGroupRotations[colorGroup] !== undefined &&
                colorGroupRotations[colorGroup] !== 0
              ) {
                const rotation = colorGroupRotations[colorGroup];
                displayLetter = rotateLetter(displayLetter, rotation);
              }

              // Replace letter with cryptogram key mapping if enabled
              if (encodeCryptogram) {
                // Encode: replace original letter with key letter
                displayLetter =
                  cryptogramEncodeMapping[displayLetter.toUpperCase()] ||
                  displayLetter;
              } else if (decodeCryptogram) {
                // Decode: replace key letter with original letter
                displayLetter =
                  cryptogramDecodeMapping[displayLetter.toUpperCase()] ||
                  displayLetter;
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
                selectedLetters.has(displayLetter.toUpperCase()) &&
                !shouldExclude;
              const letterHighlightColor = isLetterHighlighted
                ? "rgba(0, 255, 255, 0.6)"
                : ""; // Cyan color to distinguish from word highlights

              // Get manual highlight color
              const manualHighlightColor =
                colorGroup > 0 ? manualHighlightColors[colorGroup] : "";

              // Combine all highlighting: word highlights, letter highlights, and manual highlights
              let finalBackgroundColor = backgroundColor;
              const colorsToBlend: string[] = [];
              if (backgroundColor) colorsToBlend.push(backgroundColor);
              if (isLetterHighlighted) colorsToBlend.push(letterHighlightColor);
              if (manualHighlightColor)
                colorsToBlend.push(manualHighlightColor);

              if (colorsToBlend.length > 0) {
                finalBackgroundColor = blendColors(colorsToBlend);
              }

              const className = `grid-cell ${
                wordInstances.length > 0 ? "highlighted" : ""
              } ${isLetterHighlighted ? "letter-highlighted" : ""} ${
                colorGroup > 0 ? "manually-highlighted" : ""
              }`;
              const style: React.CSSProperties = {
                backgroundColor: finalBackgroundColor || undefined,
                cursor: "pointer",
                color: colorGroup > 0 ? "#fff" : "#000", // White text when manually highlighted
              };

              return (
                <div
                  key={colIndex}
                  className={className}
                  style={style}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
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


