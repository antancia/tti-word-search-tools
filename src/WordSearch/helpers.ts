import {
  CRYPTOGRAM_KEY,
  secretMessageWords,
  grid,
} from "./constants";
import { Position, WordInstance} from "./types"

const cryptogramEncodeMapping = () => {
  const mapping: Record<string, string> = {};
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < alphabet.length; i++) {
    const keyLetter = CRYPTOGRAM_KEY[i];
    const letter = alphabet[i];
    mapping[letter] = keyLetter === "?" ? "?" : keyLetter;
  }
  return mapping;
};

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
      // For backwards: top-right to bottom-left (read right-to-left going down)
      const reversedWord = wordUpper.split("").reverse().join("");

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
              grid[row][col] !== reversedWord[i]
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

export {
  blendColors,
  cryptogramEncodeMapping,
  findSecretMessageWordsSequential,
  findWordPositions,
  overlap,
  shareEdge,
};
