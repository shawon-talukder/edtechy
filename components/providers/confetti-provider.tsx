"use client";

import ReactConfetti from "react-confetti";

import useConfettiStore from "@/hooks/useConfettiStore";

const ConfettiProvider = () => {
  const confetti = useConfettiStore();

  if (!confetti.isOpen) {
    return null;
  }
  return (
    <ReactConfetti
      numberOfPieces={500}
      className="pointer-events-none z-[100]"
    />
  );
};

export default ConfettiProvider;
