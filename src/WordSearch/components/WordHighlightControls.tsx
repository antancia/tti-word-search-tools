import React from "react";
import { Disclosure, Separator } from "@heroui/react";
import { useWordSearchControls } from "../WordSearchControlsContext";
import { ControlPanelHeader } from "./ControlPanelHeader";

export const WordHighlightControls: React.FC = () => {
  const {
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

  return (
    <div className="controls-box">
      <Disclosure id="word-highlighting" aria-label="Word highlighting">
        <Disclosure.Heading>
          <ControlPanelHeader title="Word highlighting" />
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Separator className="mb-3" />
            <div className="px-5">
              <div className="controls">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={highlightForwards}
                    onChange={(e) => setHighlightForwards(e.target.checked)}
                  />
                  <span>highlight forwards words</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={highlightBackwards}
                    onChange={(e) => setHighlightBackwards(e.target.checked)}
                  />
                  <span>highlight backwards words</span>
                </label>
              </div>
              <Separator className="my-3" />
              <div className="controls">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={highlightForwardsExtra}
                    onChange={(e) =>
                      setHighlightForwardsExtra(e.target.checked)
                    }
                  />
                  <span>highlight forwards words extra</span>
                  <span className="tooltip-container">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">
                      These must be excluded to see hidden message, or don't
                      seem relevant
                    </span>
                  </span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={highlightBackwardsExtra}
                    onChange={(e) =>
                      setHighlightBackwardsExtra(e.target.checked)
                    }
                  />
                  <span>highlight backwards words extra</span>
                  <span className="tooltip-container">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">
                      These must be excluded to see hidden message, or don't
                      seem relevant
                    </span>
                  </span>
                </label>
              </div>
              <Separator className="my-3" isOnSurface />
              <div className="controls">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={highlightSecretMessage}
                    onChange={(e) =>
                      setHighlightSecretMessage(e.target.checked)
                    }
                  />
                  <span>highlight secret message letters</span>
                </label>
              </div>
            </div>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
};

