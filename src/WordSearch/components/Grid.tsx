import React from "react";
import {
  forwardsColors,
  backwardsColors,
  secretMessageColor,
  unifiedWordHighlightColor,
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
    setColorGroupRotations,
    colorGroupRotations,
    gridRows,
    shiftRowLeft,
    shiftRowRight,
    shiftColUp,
    shiftColDown,
    shiftRowsUp,
    shiftRowsDown,
    shiftColsLeft,
    shiftColsRight,
    resetGrid,
    showGridAxes,
    setShowGridAxes,
    unifyWordHighlightColors,
  } = useWordSearchControls();

  const numCols = gridRows[0]?.length ?? 0;

  const getRowLabel = (rowIndex: number): string => {
    let n = rowIndex + 1;
    let s = "";
    while (n > 0) {
      n -= 1;
      s = String.fromCharCode(65 + (n % 26)) + s;
      n = Math.floor(n / 26);
    }
    return s;
  };

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
      <div className="grid-layout-with-sidebar">
        {/* Sidebar: entire-puzzle shift buttons (keeps main grid alignment clean) */}
        <div className="grid-sidebar">
          <div className="grid-shift-all-group">
            <span className="grid-shift-all-label">All rows</span>
            <button
              type="button"
              className="grid-shift-btn"
              onClick={shiftRowsUp}
              title="Shift all rows up"
              aria-label="Shift all rows up"
            >
              ↑
            </button>
            <button
              type="button"
              className="grid-shift-btn"
              onClick={shiftRowsDown}
              title="Shift all rows down"
              aria-label="Shift all rows down"
            >
              ↓
            </button>
          </div>
          <div className="grid-shift-all-group">
            <span className="grid-shift-all-label">All cols</span>
            <button
              type="button"
              className="grid-shift-btn"
              onClick={shiftColsLeft}
              title="Shift all columns left"
              aria-label="Shift all columns left"
            >
              ←
            </button>
            <button
              type="button"
              className="grid-shift-btn"
              onClick={shiftColsRight}
              title="Shift all columns right"
              aria-label="Shift all columns right"
            >
              →
            </button>
          </div>
          <label className="grid-axes-toggle">
            <input
              type="checkbox"
              checked={showGridAxes}
              onChange={(e) => setShowGridAxes(e.target.checked)}
              aria-label="Show row and column axes (numbers and letters)"
            />
            <span>Show axes</span>
          </label>
          <button
            type="button"
            className="grid-clear-highlights-btn"
            onClick={() => {
              setManualHighlights({});
              setColorGroupRotations(new Array(6).fill(0));
            }}
            title="Clear all manual highlights"
            aria-label="Clear all manual highlights"
          >
            Clear highlights
          </button>
        </div>
        <div className="grid-layout">
          {showGridAxes && (
            <div className="grid-axis-top-row">
              <div className="grid-axis-corner" aria-hidden="true" />
              <div className="grid-axis-reset-spacer" aria-hidden="true" />
              {Array.from({ length: numCols }, (_, colIndex) => (
                <div
                  key={colIndex}
                  className="grid-axis-col-label"
                  aria-hidden="true"
                >
                  {colIndex + 1}
                </div>
              ))}
            </div>
          )}
          {/* Top row: Reset + per-column ↑ ↓ only */}
          <div className="grid-top-row">
            {showGridAxes && (
              <div className="grid-axis-row-label grid-axis-corner" aria-hidden="true" />
            )}
            <button
              type="button"
              className="grid-reset-btn"
              onClick={resetGrid}
              title="Reset grid to original"
              aria-label="Reset grid to original"
            >
              Reset
            </button>
            <div className="grid-col-buttons">
            {Array.from({ length: numCols }, (_, colIndex) => (
              <div key={colIndex} className="grid-col-button-group">
                <button
                  type="button"
                  className="grid-shift-btn"
                  onClick={() => shiftColUp(colIndex)}
                  title="Shift column up"
                  aria-label={`Shift column ${colIndex + 1} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="grid-shift-btn"
                  onClick={() => shiftColDown(colIndex)}
                  title="Shift column down"
                  aria-label={`Shift column ${colIndex + 1} down`}
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Grid rows: optional row label + row shift buttons (← →) + cells */}
      <div className="grid">
        {gridRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row-wrapper">
            {showGridAxes && (
              <div className="grid-axis-row-label" aria-hidden="true">
                {getRowLabel(rowIndex)}
              </div>
            )}
            <div className="grid-row-buttons">
              <button
                type="button"
                className="grid-shift-btn"
                onClick={() => shiftRowLeft(rowIndex)}
                title="Shift row left"
                aria-label={`Shift row ${rowIndex + 1} left`}
              >
                ←
              </button>
              <button
                type="button"
                className="grid-shift-btn"
                onClick={() => shiftRowRight(rowIndex)}
                title="Shift row right"
                aria-label={`Shift row ${rowIndex + 1} right`}
              >
                →
              </button>
            </div>
            <div className="grid-row">
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
                  // When unified: all words (forwards, backwards, secret) use one darker color
                  if (unifyWordHighlightColors) {
                    return unifiedWordHighlightColor;
                  }
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
          </div>
        ))}
        </div>
      </div>
    </div>
  </div>
  );
};


