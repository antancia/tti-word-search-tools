import React, { useMemo } from "react";
import { Disclosure, Separator, Button } from "@heroui/react";
import { ControlPanelHeader } from "./ControlPanelHeader";
import { useWordSearchControls } from "../WordSearchControlsContext";

// Manual highlight colors (matching Grid component - dark and saturated for white text contrast)
const manualHighlightColors = [
  "", // 0 = no highlight
  "rgba(200, 40, 40, 0.9)", // 1 = dark red
  "rgba(40, 200, 40, 0.9)", // 2 = dark green
  "rgba(40, 40, 200, 0.9)", // 3 = dark blue
  "rgba(200, 150, 0, 0.9)", // 4 = dark orange
  "rgba(180, 0, 180, 0.9)", // 5 = dark magenta
  "rgba(0, 150, 150, 0.9)", // 6 = dark cyan
];

export const ManualHighlightingControls: React.FC = () => {
  const {
    manualHighlights,
    setManualHighlights,
    colorGroupRotations,
    setColorGroupRotations,
  } = useWordSearchControls();

  // Find which color groups are currently in use
  const activeColorGroups = useMemo(() => {
    const groups = new Set<number>();
    Object.values(manualHighlights).forEach((group) => {
      if (group > 0) {
        groups.add(group);
      }
    });
    return Array.from(groups).sort((a, b) => a - b);
  }, [manualHighlights]);

  // Check if any manual highlights exist or rotations are non-zero
  const isModified = useMemo(() => {
    const hasHighlights = Object.keys(manualHighlights).length > 0;
    const hasRotations = colorGroupRotations.some((r) => r !== 0);
    return hasHighlights || hasRotations;
  }, [manualHighlights, colorGroupRotations]);

  const handleRotation = (colorGroup: number, delta: number) => {
    const newRotations = [...colorGroupRotations];
    const currentRotation = newRotations[colorGroup] || 0;
    const newRotation = currentRotation + delta;
    // Clamp between -25 and 25
    newRotations[colorGroup] = Math.max(-25, Math.min(25, newRotation));
    setColorGroupRotations(newRotations);
  };

  const handleClearGroup = (colorGroup: number) => {
    // Clear all highlights for this color group
    const newHighlights = { ...manualHighlights };
    Object.keys(newHighlights).forEach((key) => {
      if (newHighlights[key] === colorGroup) {
        delete newHighlights[key];
      }
    });
    setManualHighlights(newHighlights);

    // Reset rotation for this color group
    const newRotations = [...colorGroupRotations];
    newRotations[colorGroup] = 0;
    setColorGroupRotations(newRotations);
  };

  const handleClearAll = () => {
    // Clear all manual highlights
    setManualHighlights({});

    // Reset all rotations
    setColorGroupRotations(new Array(6).fill(0));
  };

  return (
    <div className="controls-box">
      <Disclosure id="manual-highlighting-tools" aria-label="Manual Highlighting Tools">
        <Disclosure.Heading>
          <ControlPanelHeader title="Manual Highlighting Tools" isModified={isModified} />
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Separator className="mb-3" />
            <div className="px-5">
              <div className="controls">
                {activeColorGroups.length === 0 ? (
                  <p style={{ color: "#666", fontStyle: "italic" }}>
                    Click on grid cells to create color groups. Each click cycles
                    through 6 different colors.
                  </p>
                ) : (
                  activeColorGroups.map((colorGroup) => (
                    <div
                      key={colorGroup}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor: "#fafafa",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: manualHighlightColors[colorGroup],
                          border: "1px solid #000",
                          borderRadius: "4px",
                        }}
                      />
                      <span style={{ fontWeight: "bold", minWidth: "80px" }}>
                        Group {colorGroup}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          className="rotation-button"
                          onClick={() => handleRotation(colorGroup, -1)}
                          aria-label={`Rotate group ${colorGroup} backward`}
                        >
                          −
                        </button>
                        <span
                          style={{
                            minWidth: "30px",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {colorGroupRotations[colorGroup] ?? 0}
                        </span>
                        <button
                          className="rotation-button"
                          onClick={() => handleRotation(colorGroup, 1)}
                          aria-label={`Rotate group ${colorGroup} forward`}
                        >
                          +
                        </button>
                      </div>
                      <Button
                        size="sm"
                        variant="danger-soft"
                        onPress={() => handleClearGroup(colorGroup)}
                        style={{ marginLeft: "auto" }}
                      >
                        Clear
                      </Button>
                    </div>
                  ))
                )}
              </div>
              {activeColorGroups.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <div className="pb-1">
                    <Button
                      variant="secondary"
                      onPress={handleClearAll}
                      className="w-full"
                    >
                      Clear all
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
};

