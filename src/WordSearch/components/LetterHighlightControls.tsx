import React from "react";
import { ALPHABET } from "../constants";
import { useWordSearchControls } from "../WordSearchControlsContext";

export const LetterHighlightControls: React.FC = () => {
  const {
    selectedLetters,
    setSelectedLetters,
    excludeLettersInWords,
    setExcludeLettersInWords,
  } = useWordSearchControls();
  return (
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
        {ALPHABET.split("").map((letter) => (
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
  );
};

