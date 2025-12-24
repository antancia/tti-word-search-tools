import {
  forwardsWords,
  forwardsWordsExtra,
  backwardsWords,
  backwardsWordsExtra,
  secretMessageWords,
  grid,
  cryptogramKey,
} from "./constants";
import { useState, useMemo } from "react";
import "../App.css";

interface Position {
  readonly row: number;
  readonly col: number;
}

interface WordInstance {
  word: string;
  positions: Position[];
  isBackwards: boolean;
  colorId: number;
  isSecretMessage?: boolean;
}

interface CellHighlight {
  wordInstances: WordInstance[];
}

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
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i];
      const keyLetter = cryptogramKey[i];
      mapping[letter] = keyLetter === "?" ? "?" : keyLetter;
    }
    return mapping;
  }, []);

  // Create reverse mapping from cryptogram key letter to original letter (decoding)
  const cryptogramDecodeMapping = useMemo(() => {
    const mapping: Record<string, string> = {};
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i];
      const keyLetter = cryptogramKey[i];
      if (keyLetter !== "?") {
        mapping[keyLetter] = letter;
      }
    }
    return mapping;
  }, []);

  const isCryptogramActive = encodeCryptogram || decodeCryptogram;

  // Find secret message words by scanning sequentially (top to bottom, left to right)
  // Each word is matched once in order, continuing from where the previous match ended
  const findSecretMessageWordsSequential = (): WordInstance[] => {
    const instances: WordInstance[] = [];
    const usedPositions = new Set<string>();
    let currentWordIndex = 0;
    let colorId = 0;

    // Scan the grid sequentially from top to bottom, left to right
    for (let row = 0; row < grid.length; row++) {
      const rowText = grid[row];

      // For each starting position in this row
      let startCol = 0;
      while (startCol < rowText.length) {
        // Check if we've found all words
        if (currentWordIndex >= secretMessageWords.length) {
          return instances;
        }

        // Try to match the current word we're looking for
        const currentWord = secretMessageWords[currentWordIndex];
        const wordUpper = currentWord.toUpperCase();
        const wordLength = currentWord.length;

        // Check if the word fits starting at this position
        if (startCol + wordLength <= rowText.length) {
          // Check if this position matches the word
          const matches =
            rowText.substring(startCol, startCol + wordLength) === wordUpper;

          if (matches) {
            // Create positions for this word
            const positions = Array.from({ length: wordLength }, (_, i) => ({
              row,
              col: startCol + i,
            }));

            // Check if any of these positions are already used
            const hasOverlap = positions.some((pos) =>
              usedPositions.has(`${pos.row},${pos.col}`)
            );

            if (!hasOverlap) {
              // Mark these positions as used
              positions.forEach((pos) => {
                usedPositions.add(`${pos.row},${pos.col}`);
              });

              // Add this word instance
              instances.push({
                word: currentWord,
                positions,
                isBackwards: false,
                colorId: colorId++,
                isSecretMessage: true,
              });

              // Move to the next word
              currentWordIndex++;

              // Continue scanning from the position after this word ends
              startCol += wordLength;
              continue; // Skip the increment at the end of the loop
            }
          }
        }

        // Move to the next position
        startCol++;
      }
    }

    return instances;
  };

  // Find positions of words in the grid
  const findWordPositions = (
    word: string,
    isBackwards: boolean = false
  ): Position[][] => {
    const positions: Position[][] = [];
    const wordUpper = word.toUpperCase();

    // Search horizontally
    for (let row = 0; row < grid.length; row++) {
      const rowText = grid[row];
      if (isBackwards) {
        // Search right to left - search for reversed word in original text
        const reversedWord = wordUpper.split("").reverse().join("");
        let index = rowText.indexOf(reversedWord);
        while (index !== -1) {
          const startCol = index + word.length - 1;
          positions.push(
            Array.from({ length: word.length }, (_, i) => ({
              row,
              col: startCol - i,
            }))
          );
          index = rowText.indexOf(reversedWord, index + 1);
        }
      } else {
        // Search left to right
        let index = rowText.indexOf(wordUpper);
        while (index !== -1) {
          positions.push(
            Array.from({ length: word.length }, (_, i) => ({
              row,
              col: index + i,
            }))
          );
          index = rowText.indexOf(wordUpper, index + 1);
        }
      }
    }

    // Search vertically
    for (let col = 0; col < grid[0].length; col++) {
      const colText = grid.map((row) => row[col]).join("");
      if (isBackwards) {
        // Search bottom to top - search for reversed word in original text
        const reversedWord = wordUpper.split("").reverse().join("");
        let index = colText.indexOf(reversedWord);
        while (index !== -1) {
          const startRow = index + word.length - 1;
          positions.push(
            Array.from({ length: word.length }, (_, i) => ({
              row: startRow - i,
              col,
            }))
          );
          index = colText.indexOf(reversedWord, index + 1);
        }
      } else {
        // Search top to bottom
        let index = colText.indexOf(wordUpper);
        while (index !== -1) {
          positions.push(
            Array.from({ length: word.length }, (_, i) => ({
              row: index + i,
              col,
            }))
          );
          index = colText.indexOf(wordUpper, index + 1);
        }
      }
    }

    // Search diagonally
    if (isBackwards) {
      // For backwards: bottom-right to top-left (down and to the left), and top-right to bottom-left (down and to the left)
      const reversedWord = wordUpper.split("").reverse().join("");

      // Diagonal: bottom-right to top-left (row decreases, col decreases)
      for (
        let startRow = grid.length - 1;
        startRow >= word.length - 1;
        startRow--
      ) {
        for (
          let startCol = grid[0].length - 1;
          startCol >= word.length - 1;
          startCol--
        ) {
          let match = true;
          const wordPositions: Position[] = [];
          for (let i = 0; i < word.length; i++) {
            const row = startRow - i;
            const col = startCol - i;
            if (row < 0 || col < 0 || grid[row][col] !== reversedWord[i]) {
              match = false;
              break;
            }
            wordPositions.push({ row, col });
          }
          if (match) {
            positions.push(wordPositions.reverse()); // Reverse to show as going backwards
          }
        }
      }

      // Diagonal: top-right to bottom-left (row increases, col decreases) - read right-to-left going down
      for (
        let startRow = 0;
        startRow <= grid.length - word.length;
        startRow++
      ) {
        for (
          let startCol = word.length - 1;
          startCol < grid[0].length;
          startCol++
        ) {
          let match = true;
          const wordPositions: Position[] = [];
          for (let i = 0; i < word.length; i++) {
            const row = startRow + i;
            const col = startCol - i;
            if (
              row >= grid.length ||
              col < 0 ||
              grid[row][col] !== wordUpper[i]
            ) {
              match = false;
              break;
            }
            wordPositions.push({ row, col });
          }
          if (match) {
            positions.push(wordPositions.reverse()); // Reverse to show as going backwards
          }
        }
      }
    } else {
      // For forwards: top-left to bottom-right (down and to the right), and top-right to bottom-left (down and to the right)

      // Diagonal: top-left to bottom-right (row increases, col increases)
      for (
        let startRow = 0;
        startRow <= grid.length - word.length;
        startRow++
      ) {
        for (
          let startCol = 0;
          startCol <= grid[0].length - word.length;
          startCol++
        ) {
          let match = true;
          const wordPositions: Position[] = [];
          for (let i = 0; i < word.length; i++) {
            const row = startRow + i;
            const col = startCol + i;
            if (
              row >= grid.length ||
              col >= grid[0].length ||
              grid[row][col] !== wordUpper[i]
            ) {
              match = false;
              break;
            }
            wordPositions.push({ row, col });
          }
          if (match) {
            positions.push(wordPositions);
          }
        }
      }

      // Diagonal: bottom-left to top-right (row decreases, col increases) - read top-to-bottom going to the right
      for (
        let startRow = grid.length - 1;
        startRow >= word.length - 1;
        startRow--
      ) {
        for (
          let startCol = 0;
          startCol <= grid[0].length - word.length;
          startCol++
        ) {
          let match = true;
          const wordPositions: Position[] = [];
          for (let i = 0; i < word.length; i++) {
            const row = startRow - i;
            const col = startCol + i;
            if (
              row < 0 ||
              col >= grid[0].length ||
              grid[row][col] !== wordUpper[i]
            ) {
              match = false;
              break;
            }
            wordPositions.push({ row, col });
          }
          if (match) {
            positions.push(wordPositions.reverse()); // Reverse to show as reading top-to-bottom
          }
        }
      }
    }

    return positions;
  };

  // Helper function to check if two positions are adjacent (share an edge)
  const areAdjacent = (pos1: Position, pos2: Position): boolean => {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  // Helper function to check if two word instances share an edge
  const shareEdge = (
    instance1: WordInstance,
    instance2: WordInstance
  ): boolean => {
    for (const pos1 of instance1.positions) {
      for (const pos2 of instance2.positions) {
        if (areAdjacent(pos1, pos2)) {
          return true;
        }
      }
    }
    return false;
  };

  // Helper function to check if two word instances overlap
  const overlap = (
    instance1: WordInstance,
    instance2: WordInstance
  ): boolean => {
    const posSet1 = new Set(
      instance1.positions.map((p) => `${p.row},${p.col}`)
    );
    for (const pos2 of instance2.positions) {
      if (posSet1.has(`${pos2.row},${pos2.col}`)) {
        return true;
      }
    }
    return false;
  };

  // Color palettes
  const forwardsColors = [
    "rgba(255, 255, 0, 0.7)", // Yellow
    "rgba(255, 165, 0, 0.7)", // Orange
    "rgba(255, 0, 0, 0.7)", // Red
    "rgba(255, 192, 203, 0.7)", // Pink
    "rgba(255, 140, 0, 0.7)", // Dark orange
    "rgba(255, 215, 0, 0.7)", // Gold
    "rgba(255, 69, 0, 0.7)", // Red-orange
    "rgba(255, 20, 147, 0.7)", // Deep pink
  ];

  const backwardsColors = [
    "rgba(0, 128, 0, 0.7)", // Green
    "rgba(0, 0, 255, 0.7)", // Blue
    "rgba(128, 0, 128, 0.7)", // Purple
    "rgba(0, 255, 255, 0.7)", // Cyan
    "rgba(0, 191, 255, 0.7)", // Deep sky blue
    "rgba(50, 205, 50, 0.7)", // Lime green
    "rgba(138, 43, 226, 0.7)", // Blue violet
    "rgba(72, 209, 204, 0.7)", // Medium turquoise
  ];

  // Unique color for secret message words
  const secretMessageColor = "rgba(255, 0, 255, 0.7)"; // Magenta

  // Helper function to blend colors
  const blendColors = (colors: string[]): string => {
    if (colors.length === 0) return "";
    if (colors.length === 1) return colors[0];

    // Extract RGBA values and average them
    const rgbaValues = colors
      .map((color) => {
        const match = color.match(
          /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
        );
        if (!match) return null;
        return {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3]),
          a: match[4] ? parseFloat(match[4]) : 1,
        };
      })
      .filter((v) => v !== null) as Array<{
      r: number;
      g: number;
      b: number;
      a: number;
    }>;

    if (rgbaValues.length === 0) return "";

    const avg = rgbaValues.reduce(
      (acc, val) => ({
        r: acc.r + val.r,
        g: acc.g + val.g,
        b: acc.b + val.b,
        a: acc.a + val.a,
      }),
      { r: 0, g: 0, b: 0, a: 0 }
    );

    const count = rgbaValues.length;
    return `rgba(${Math.round(avg.r / count)}, ${Math.round(
      avg.g / count
    )}, ${Math.round(avg.b / count)}, ${Math.min(0.9, avg.a / count + 0.1)})`;
  };

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

  return (
    <div className="app">
      <h1>Past & Future Box Word Search</h1>
      <div className="main-content">
        <div className="controls-column">
          <div
            className={`controls-box ${isCryptogramActive ? "disabled" : ""}`}
          >
            <h2>Word highlighting</h2>
            <div className="controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={highlightForwards}
                  onChange={(e) => setHighlightForwards(e.target.checked)}
                  disabled={isCryptogramActive}
                />
                <span>highlight forwards words</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={highlightBackwards}
                  onChange={(e) => setHighlightBackwards(e.target.checked)}
                  disabled={isCryptogramActive}
                />
                <span>highlight backwards words</span>
              </label>
            </div>
            <div className="letter-controls-divider"></div>
            <div className="controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={highlightForwardsExtra}
                  onChange={(e) => setHighlightForwardsExtra(e.target.checked)}
                  disabled={isCryptogramActive}
                />
                <span>highlight forwards words extra</span>
                <span className="tooltip-container">
                  <span className="tooltip-icon">?</span>
                  <span className="tooltip-text">
                    These words have lower confidence since they must be
                    excluded to see widely accepted hidden message letters
                  </span>
                </span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={highlightBackwardsExtra}
                  onChange={(e) => setHighlightBackwardsExtra(e.target.checked)}
                  disabled={isCryptogramActive}
                />
                <span>highlight backwards words extra</span>
                <span className="tooltip-container">
                  <span className="tooltip-icon">?</span>
                  <span className="tooltip-text">
                    These words have lower confidence since they must be
                    excluded to see widely accepted hidden message letters
                  </span>
                </span>
              </label>
            </div>
            <div className="letter-controls-divider"></div>
            <div className="controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={highlightSecretMessage}
                  onChange={(e) => setHighlightSecretMessage(e.target.checked)}
                  disabled={isCryptogramActive}
                />
                <span>highlight secret message letters</span>
              </label>
            </div>
          </div>
          <div className="controls-box">
            <h2>Letter Highlighting</h2>
            <div className="controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={excludeLettersInWords}
                  onChange={(e) => setExcludeLettersInWords(e.target.checked)}
                />
                <span>Exclude currently highlighted words</span>
              </label>
            </div>
            <div className="letter-controls-divider"></div>
            <div className="letter-controls">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                <label key={letter} className="checkbox-label letter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedLetters.has(letter)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedLetters);
                      if (e.target.checked) {
                        newSelected.add(letter);
                      } else {
                        newSelected.delete(letter);
                      }
                      setSelectedLetters(newSelected);
                    }}
                  />
                  <span>{letter}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="controls-box">
            <h2>Cryptogram Tools</h2>
            <div className="controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={encodeCryptogram}
                  onChange={(e) => {
                    setEncodeCryptogram(e.target.checked);
                    if (e.target.checked) {
                      setDecodeCryptogram(false);
                    }
                  }}
                />
                <span>Encode puzzle using key</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={decodeCryptogram}
                  onChange={(e) => {
                    setDecodeCryptogram(e.target.checked);
                    if (e.target.checked) {
                      setEncodeCryptogram(false);
                    }
                  }}
                />
                <span>Decode puzzle using key</span>
              </label>
            </div>
          </div>
        </div>
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
                    selectedLetters.has(displayLetter.toUpperCase()) &&
                    !shouldExclude;
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
      </div>
    </div>
  );
}

