"use client";

import { MouseEvent, ReactNode } from "react";

interface ConfirmSubmitButtonProps {
  message: string;
  className?: string;
  children: ReactNode;
}

export default function ConfirmSubmitButton({ message, className, children }: ConfirmSubmitButtonProps) {
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  };

  return (
    <button type="submit" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
