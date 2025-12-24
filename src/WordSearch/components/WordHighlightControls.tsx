import React from "react";
import { useWordSearchControls } from "../WordSearchControlsContext";

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
    isCryptogramActive,
  } = useWordSearchControls();

  return (
    <div className={`controls-box ${isCryptogramActive ? "disabled" : ""}`}>
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
              These must be excluded to see hidden message, or don't seem
              relevant
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
              These must be excluded to see hidden message, or don't seem
              relevant
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
  );
};

