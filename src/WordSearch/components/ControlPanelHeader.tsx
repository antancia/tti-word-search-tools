import React from "react";
import { Button, Disclosure } from "@heroui/react";

interface ControlPanelHeaderProps {
  title: string;
}

export const ControlPanelHeader: React.FC<
  ControlPanelHeaderProps
> = ({ title }) => {
  return (
    <Button
      fullWidth
      slot="trigger"
      size="lg"
      variant="ghost"
      className="flex justify-between bg-inherit hover:bg-inherit transition-none transform-none uppercase tracking-wide "
    >
      {title}
      <Disclosure.Indicator />
    </Button>
  );
};

