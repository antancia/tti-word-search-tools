import React from "react";
import { useWordSearchControls } from "../WordSearchControlsContext";

export const CryptogramControls: React.FC = () => {
  const {
    encodeCryptogram,
    setEncodeCryptogram,
    decodeCryptogram,
    setDecodeCryptogram,
  } = useWordSearchControls();
  return (
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
  );
};

