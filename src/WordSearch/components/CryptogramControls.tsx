import React, { useState, useEffect } from "react";
import { Disclosure, Separator, Button, Input } from "@heroui/react";
import { useWordSearchControls } from "../WordSearchControlsContext";
import { ControlPanelHeader } from "./ControlPanelHeader";
import {
  CRYPTOGRAM_KEY,
  POEM_FIRST_LETTER_KEY,
  POEM_LAST_LETTER_KEY,
} from "../constants";

const KEY_PRESETS = {
  default: { label: "Default", key: CRYPTOGRAM_KEY },
  poemFirst: { label: "Poem (First)", key: POEM_FIRST_LETTER_KEY },
  poemLast: { label: "Poem (Last)", key: POEM_LAST_LETTER_KEY },
  custom: { label: "Custom", key: null },
} as const;

type KeyPresetId = keyof typeof KEY_PRESETS;

export const CryptogramControls: React.FC = () => {
  const {
    encodeCryptogram,
    setEncodeCryptogram,
    decodeCryptogram,
    setDecodeCryptogram,
    applyHighlightsToOriginalGrid,
    setApplyHighlightsToOriginalGrid,
    cryptogramKey,
    setCryptogramKey,
  } = useWordSearchControls();

  const [customKeyValue, setCustomKeyValue] = useState(cryptogramKey);
  const [error, setError] = useState<string>("");

  // Determine which preset is currently active based on the cryptogramKey
  const getCurrentPreset = (): KeyPresetId => {
    if (cryptogramKey === CRYPTOGRAM_KEY) return "default";
    if (cryptogramKey === POEM_FIRST_LETTER_KEY) return "poemFirst";
    if (cryptogramKey === POEM_LAST_LETTER_KEY) return "poemLast";
    return "custom";
  };

  const [selectedPreset, setSelectedPreset] =
    useState<KeyPresetId>(getCurrentPreset);

  // Sync customKeyValue when cryptogramKey changes externally (unless we're in custom mode)
  useEffect(() => {
    if (selectedPreset !== "custom") {
      setCustomKeyValue(cryptogramKey);
    }
  }, [cryptogramKey, selectedPreset]);

  // Sync preset selection when cryptogramKey changes externally
  useEffect(() => {
    setSelectedPreset(getCurrentPreset());
  }, [cryptogramKey]);

  const handlePresetChange = (presetId: KeyPresetId) => {
    setSelectedPreset(presetId);
    const preset = KEY_PRESETS[presetId];
    if (preset.key) {
      setCryptogramKey(preset.key);
      setError("");
    } else if (presetId === "custom") {
      // When switching to custom, start with the current key
      setCustomKeyValue(cryptogramKey);
      setError("");
    }
  };

  const validateAndApplyKey = (key: string): boolean => {
    if (key.length !== 26) {
      setError("Key must be exactly 26 characters");
      return false;
    }
    const validPattern = /^[A-Za-z?]+$/;
    if (!validPattern.test(key)) {
      setError("Only letters (A-Z) or '?' allowed");
      return false;
    }
    setError("");
    setCryptogramKey(key);
    return true;
  };

  const handleCustomKeyChange = (value: string) => {
    // Only allow letters and '?', convert to uppercase
    const filtered = value
      .toUpperCase()
      .split("")
      .filter((char) => /[A-Z?]/.test(char))
      .join("");
    setCustomKeyValue(filtered);
    // Clear error while typing, validate on blur or when 26 chars
    if (filtered.length === 26) {
      validateAndApplyKey(filtered);
    } else {
      setError("");
    }
  };

  // Check if any settings differ from defaults
  const isModified =
    cryptogramKey !== CRYPTOGRAM_KEY ||
    encodeCryptogram ||
    decodeCryptogram ||
    applyHighlightsToOriginalGrid;

  return (
    <div className="controls-box">
      <Disclosure id="cryptogram-tools" aria-label="Cryptogram Tools">
        <Disclosure.Heading>
          <ControlPanelHeader
            title="Cryptogram Tools"
            isModified={isModified}
          />
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Separator className="mb-3" />
            <div className="px-5">
              <div className="controls">
                <div style={{ marginBottom: "8px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    Key Preset:
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      marginBottom: "12px",
                    }}
                  >
                    {(Object.keys(KEY_PRESETS) as KeyPresetId[]).map(
                      (presetId) => (
                        <Button
                          key={presetId}
                          size="sm"
                          variant={
                            selectedPreset === presetId ? "primary" : "tertiary"
                          }
                          onPress={() => handlePresetChange(presetId)}
                          className="flex-1"
                        >
                          {KEY_PRESETS[presetId].label}
                        </Button>
                      )
                    )}
                  </div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {selectedPreset === "custom"
                      ? "Custom Key:"
                      : "Current Key:"}
                  </label>
                  {selectedPreset === "custom" ? (
                    <div>
                      <Input
                        value={customKeyValue}
                        onChange={(e) => handleCustomKeyChange(e.target.value)}
                        placeholder="Enter 26 characters (A-Z or ?)"
                        maxLength={26}
                        className="w-full"
                        style={{
                          fontFamily: "monospace",
                          letterSpacing: "1px",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "12px",
                          color: error ? "#dc2626" : "#666",
                          marginTop: "4px",
                        }}
                      >
                        {error || `${customKeyValue.length}/26 characters`}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                        fontSize: "14px",
                        letterSpacing: "2px",
                        wordBreak: "break-all",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      {cryptogramKey}
                    </div>
                  )}
                </div>
              </div>
              <Separator className="my-3" />
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
              <Separator className="my-3" />
              <div className="controls">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    className="toggle-input"
                    checked={applyHighlightsToOriginalGrid}
                    onChange={(e) =>
                      setApplyHighlightsToOriginalGrid(e.target.checked)
                    }
                  />
                  <span className="toggle-slider"></span>
                  <span>Apply highlights to original grid</span>
                </label>
              </div>
              <Separator className="my-3" />
              <div className="pb-1">
                <Button
                  variant="secondary"
                  onPress={() => {
                    setEncodeCryptogram(false);
                    setDecodeCryptogram(false);
                    setApplyHighlightsToOriginalGrid(false);
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
