import React from "react";
import { Disclosure, Separator, Button } from "@heroui/react";
import { ALPHABET } from "../constants";
import { useWordSearchControls } from "../WordSearchControlsContext";
import { ControlPanelHeader } from "./ControlPanelHeader";

export const LetterHighlightControls: React.FC = () => {
  const {
    selectedLetters,
    setSelectedLetters,
    excludeLettersInWords,
    setExcludeLettersInWords,
  } = useWordSearchControls();

  // Check if any letters are selected or exclude option is on
  const isModified = selectedLetters.size > 0 || excludeLettersInWords;

  return (
    <div className="controls-box">
      <Disclosure id="letter-highlighting" aria-label="Letter Highlighting">
        <Disclosure.Heading>
          <ControlPanelHeader title="Letter Highlighting" isModified={isModified} />
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Separator className="mb-3" />
            <div className="px-5">
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
              <Separator className="my-3" />
              <div className="letter-controls">
                {ALPHABET.split("").map((letter) => (
                  <label
                    key={letter}
                    className="checkbox-label letter-checkbox"
                  >
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
              <Separator className="my-3" />
              <div className="pb-1">
                <Button
                  variant="secondary"
                  onPress={() => {
                    setSelectedLetters(new Set());
                    setExcludeLettersInWords(false);
                  }}
                  className="w-full"
                >
                  Clear all
                </Button>
              </div>
            </div>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
};

