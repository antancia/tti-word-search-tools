import React from "react";
import { Disclosure, Separator } from "@heroui/react";
import { useWordSearchControls } from "../WordSearchControlsContext";
import { ControlPanelHeader } from "./ControlPanelHeader";

export const CryptogramControls: React.FC = () => {
  const {
    encodeCryptogram,
    setEncodeCryptogram,
    decodeCryptogram,
    setDecodeCryptogram,
    applyHighlightsToOriginalGrid,
    setApplyHighlightsToOriginalGrid,
  } = useWordSearchControls();
  return (
    <div className="controls-box">
      <Disclosure id="cryptogram-tools" aria-label="Cryptogram Tools">
        <Disclosure.Heading>
          <ControlPanelHeader title="Cryptogram Tools" />
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Separator className="mb-3" />
            <div className="px-5">
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
            </div>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
};

