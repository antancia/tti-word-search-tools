import React, { useState, useMemo } from "react";
import {
  Disclosure,
  DisclosureGroup,
  Separator,
  Button,
  Input,
  TagGroup,
  Tag,
  Tooltip,
} from "@heroui/react";
import { useWordSearchControls } from "../WordSearchControlsContext";
import { ControlPanelHeader } from "./ControlPanelHeader";
import {
  forwardsWords as defaultForwardsWords,
  forwardsWordsExtra as defaultForwardsWordsExtra,
  backwardsWords as defaultBackwardsWords,
  backwardsWordsExtra as defaultBackwardsWordsExtra,
  secretMessageWords as defaultSecretMessageWords,
} from "../constants";

// Helper to compare arrays regardless of order
const arraysEqual = (a: string[], b: readonly string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
};

interface WordListSectionProps {
  title: string;
  words: string[];
  onAddWord: (word: string) => void;
  onRemoveWord: (word: string) => void;
  onClearAll: () => void;
  onResetToDefault: () => void;
  isHighlighted: boolean;
  onHighlightChange: (value: boolean) => void;
  tooltip?: string;
}

const WordListSection: React.FC<WordListSectionProps> = ({
  title,
  words,
  onAddWord,
  onRemoveWord,
  onClearAll,
  onResetToDefault,
  isHighlighted,
  onHighlightChange,
  tooltip,
}) => {
  const [newWord, setNewWord] = useState("");

  const handleAdd = () => {
    const trimmed = newWord.trim().toLowerCase();
    if (trimmed && !words.includes(trimmed)) {
      onAddWord(trimmed);
      setNewWord("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <Disclosure id={`word-section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <Disclosure.Heading>
        <div className="flex items-center w-full gap-2">
          <label
            className="flex items-center cursor-pointer px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isHighlighted}
              onChange={(e) => onHighlightChange(e.target.checked)}
              className="w-4 h-4"
            />
          </label>
          <Button
            slot="trigger"
            fullWidth
            size="sm"
            variant="ghost"
            className="flex justify-between bg-inherit hover:bg-inherit transition-none font-semibold text-sm uppercase tracking-wide"
          >
            <span className="flex items-center gap-2">
              {title}
              {tooltip && (
                // <span className="tooltip-container">
                <Tooltip>
                  <Tooltip.Trigger>
                    {/* Hero icon: question-mark-circle */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                      />
                    </svg>
                  </Tooltip.Trigger>
                  <Tooltip.Content showArrow>
                    <Tooltip.Arrow />
                    <span>{tooltip}</span>
                  </Tooltip.Content>
                  {/* </span> */}
                </Tooltip>
              )}
            </span>
            <Disclosure.Indicator />
          </Button>
        </div>
      </Disclosure.Heading>
      <Disclosure.Content>
        <Disclosure.Body>
          <div className="flex gap-2 mb-3">
            <Input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add word"
              className="flex-1"
            />
            <Button size="sm" variant="secondary" onPress={handleAdd}>
              Add
            </Button>
          </div>
          <div className="mb-3 min-h-[40px]">
            {words.length === 0 ? (
              <span className="text-gray-500 text-sm italic">No words</span>
            ) : (
              <TagGroup
                variant="surface"
                selectionMode="none"
                onRemove={(keys) => {
                  const keysArray = Array.from(keys);
                  keysArray.forEach((key) => {
                    onRemoveWord(key.toString());
                  });
                }}
                size="sm"
              >
                <TagGroup.List>
                  {words.map((word) => (
                    <Tag key={word} id={word} textValue={word}>
                      {word}
                    </Tag>
                  ))}
                </TagGroup.List>
              </TagGroup>
            )}
          </div>
          <div className="mb-4 flex gap-2">
            {words.length > 0 && (
              <Button size="sm" variant="danger-soft" onPress={onClearAll}>
                Clear All
              </Button>
            )}
            <Button size="sm" variant="tertiary" onPress={onResetToDefault}>
              Reset to Default
            </Button>
          </div>
        </Disclosure.Body>
      </Disclosure.Content>
      <Separator className="my-4" />
    </Disclosure>
  );
};

export const WordsControls: React.FC = () => {
  const {
    forwardsWords,
    setForwardsWords,
    forwardsWordsExtra,
    setForwardsWordsExtra,
    backwardsWords,
    setBackwardsWords,
    backwardsWordsExtra,
    setBackwardsWordsExtra,
    secretMessageWords,
    setSecretMessageWords,
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
  } = useWordSearchControls();

  const [expandedSubSections, setExpandedSubSections] = useState<
    Set<string | number>
  >(new Set());

  const addWord = (
    word: string,
    currentList: string[],
    setter: (words: string[]) => void
  ) => {
    if (!currentList.includes(word)) {
      setter([...currentList, word]);
    }
  };

  const removeWord = (
    word: string,
    currentList: string[],
    setter: (words: string[]) => void
  ) => {
    setter(currentList.filter((w) => w !== word));
  };

  const handleResetAllToDefault = () => {
    setForwardsWords([...defaultForwardsWords]);
    setForwardsWordsExtra([...defaultForwardsWordsExtra]);
    setBackwardsWords([...defaultBackwardsWords]);
    setBackwardsWordsExtra([...defaultBackwardsWordsExtra]);
    setSecretMessageWords([...defaultSecretMessageWords]);
  };

  // Compute highlight all state
  const allHighlights = [
    highlightForwards,
    highlightForwardsExtra,
    highlightBackwards,
    highlightBackwardsExtra,
    highlightSecretMessage,
  ];
  const allHighlightsOn = allHighlights.every(Boolean);
  const someHighlightsOn = allHighlights.some(Boolean);

  const handleToggleAllHighlights = (checked: boolean) => {
    setHighlightForwards(checked);
    setHighlightForwardsExtra(checked);
    setHighlightBackwards(checked);
    setHighlightBackwardsExtra(checked);
    setHighlightSecretMessage(checked);
  };

  // Check if any word lists differ from defaults or any highlights are on
  const isModified = useMemo(() => {
    const wordsModified =
      !arraysEqual(forwardsWords, defaultForwardsWords) ||
      !arraysEqual(forwardsWordsExtra, defaultForwardsWordsExtra) ||
      !arraysEqual(backwardsWords, defaultBackwardsWords) ||
      !arraysEqual(backwardsWordsExtra, defaultBackwardsWordsExtra) ||
      !arraysEqual(secretMessageWords, defaultSecretMessageWords);
    const highlightsOn =
      highlightForwards ||
      highlightForwardsExtra ||
      highlightBackwards ||
      highlightBackwardsExtra ||
      highlightSecretMessage;
    return wordsModified || highlightsOn;
  }, [
    forwardsWords,
    forwardsWordsExtra,
    backwardsWords,
    backwardsWordsExtra,
    secretMessageWords,
    highlightForwards,
    highlightForwardsExtra,
    highlightBackwards,
    highlightBackwardsExtra,
    highlightSecretMessage,
  ]);

  return (
    <div className="controls-box">
      <Disclosure id="words" aria-label="Words">
        <Disclosure.Heading>
          <ControlPanelHeader title="Words" isModified={isModified} />
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Separator className="mb-3" />
            <div className="px-5">
              <div className="flex items-center gap-2 mb-1 pb-3 border-b-1 border-neutral-300">
                <label className="flex items-center cursor-pointer px-2 my-3">
                  <input
                    type="checkbox"
                    checked={allHighlightsOn}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = someHighlightsOn && !allHighlightsOn;
                      }
                    }}
                    onChange={(e) =>
                      handleToggleAllHighlights(e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                </label>
                <span className="ml-3 text-sm tracking-wide">All</span>
              </div>
              <DisclosureGroup
                expandedKeys={expandedSubSections}
                onExpandedChange={setExpandedSubSections}
              >
                <WordListSection
                  title="Forwards words"
                  words={forwardsWords}
                  onAddWord={(word) =>
                    addWord(word, forwardsWords, setForwardsWords)
                  }
                  onRemoveWord={(word) =>
                    removeWord(word, forwardsWords, setForwardsWords)
                  }
                  onClearAll={() => setForwardsWords([])}
                  onResetToDefault={() =>
                    setForwardsWords([...defaultForwardsWords])
                  }
                  isHighlighted={highlightForwards}
                  onHighlightChange={setHighlightForwards}
                />
                <WordListSection
                  title="Forwards words extra"
                  words={forwardsWordsExtra}
                  onAddWord={(word) =>
                    addWord(word, forwardsWordsExtra, setForwardsWordsExtra)
                  }
                  onRemoveWord={(word) =>
                    removeWord(word, forwardsWordsExtra, setForwardsWordsExtra)
                  }
                  onClearAll={() => setForwardsWordsExtra([])}
                  onResetToDefault={() =>
                    setForwardsWordsExtra([...defaultForwardsWordsExtra])
                  }
                  isHighlighted={highlightForwardsExtra}
                  onHighlightChange={setHighlightForwardsExtra}
                  tooltip="These must be excluded to see hidden message, or don't seem relevant"
                />
                <WordListSection
                  title="Backwards words"
                  words={backwardsWords}
                  onAddWord={(word) =>
                    addWord(word, backwardsWords, setBackwardsWords)
                  }
                  onRemoveWord={(word) =>
                    removeWord(word, backwardsWords, setBackwardsWords)
                  }
                  onClearAll={() => setBackwardsWords([])}
                  onResetToDefault={() =>
                    setBackwardsWords([...defaultBackwardsWords])
                  }
                  isHighlighted={highlightBackwards}
                  onHighlightChange={setHighlightBackwards}
                />
                <WordListSection
                  title="Backwards words extra"
                  words={backwardsWordsExtra}
                  onAddWord={(word) =>
                    addWord(word, backwardsWordsExtra, setBackwardsWordsExtra)
                  }
                  onRemoveWord={(word) =>
                    removeWord(
                      word,
                      backwardsWordsExtra,
                      setBackwardsWordsExtra
                    )
                  }
                  onClearAll={() => setBackwardsWordsExtra([])}
                  onResetToDefault={() =>
                    setBackwardsWordsExtra([...defaultBackwardsWordsExtra])
                  }
                  isHighlighted={highlightBackwardsExtra}
                  onHighlightChange={setHighlightBackwardsExtra}
                  tooltip="These must be excluded to see hidden message, or don't seem relevant"
                />
                <WordListSection
                  title="Secret message words"
                  words={secretMessageWords}
                  onAddWord={(word) =>
                    addWord(word, secretMessageWords, setSecretMessageWords)
                  }
                  onRemoveWord={(word) =>
                    removeWord(word, secretMessageWords, setSecretMessageWords)
                  }
                  onClearAll={() => setSecretMessageWords([])}
                  onResetToDefault={() =>
                    setSecretMessageWords([...defaultSecretMessageWords])
                  }
                  isHighlighted={highlightSecretMessage}
                  onHighlightChange={setHighlightSecretMessage}
                />
              </DisclosureGroup>
            </div>
            <div className="px-5 py-1 border-t">
              <Button
                size="sm"
                variant="tertiary"
                onPress={handleResetAllToDefault}
                className="w-full"
              >
                Reset all words to default
              </Button>
            </div>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
};
