"use client";

import { useState } from "react";
import { Preloader } from "./Preloader";
import { Hero } from "./Hero";

export function HomeExperience() {
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      {showPreloader && (
        <Preloader
          onComplete={() => {
            setReady(true);
            setShowPreloader(false);
          }}
        />
      )}
      <Hero ready={ready} />
    </>
  );
}
