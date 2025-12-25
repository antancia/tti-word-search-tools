import React, { useState } from "react";
import {
  Disclosure,
  DisclosureGroup,
  Separator,
  Button,
  Input,
  TagGroup,
  Tag,
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

interface WordListSectionProps {
  title: string;
  words: string[];
  onAddWord: (word: string) => void;
  onRemoveWord: (word: string) => void;
  onClearAll: () => void;
  onResetToDefault: () => void;
}

const WordListSection: React.FC<WordListSectionProps> = ({
  title,
  words,
  onAddWord,
  onRemoveWord,
  onClearAll,
  onResetToDefault,
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
        <Button
          slot="trigger"
          fullWidth
          size="sm"
          variant="ghost"
          className="flex justify-between bg-inherit hover:bg-inherit transition-none font-semibold text-sm uppercase tracking-wide"
        >
          {title}
          <Disclosure.Indicator />
        </Button>
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

  return (
    <div className="controls-box">
      <Disclosure id="words" aria-label="Words">
        <Disclosure.Heading>
          <ControlPanelHeader title="Words" />
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Separator className="mb-3" />
            <div className="px-5">
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

