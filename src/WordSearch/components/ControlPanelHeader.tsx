import React from "react";
import { Button, Disclosure } from "@heroui/react";

interface ControlPanelHeaderProps {
  title: string;
  isModified?: boolean;
}

export const ControlPanelHeader: React.FC<ControlPanelHeaderProps> = ({
  title,
  isModified = false,
}) => {
  return (
    <Button
      fullWidth
      slot="trigger"
      size="lg"
      variant="ghost"
      className="flex justify-between bg-inherit hover:bg-inherit transition-none transform-none uppercase tracking-wide"
    >
      <span
        style={{
          color: isModified ? "#2563eb" : undefined,
          fontWeight: isModified ? 700 : undefined,
        }}
      >
        {title}
        {isModified && " •"}
      </span>
      <Disclosure.Indicator />
    </Button>
  );
};

