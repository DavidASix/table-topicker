"use client";

import { BookOpen, History } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DockMenu } from "./_components/dock-menu";
import { HistoryScreen } from "./_components/history-screen";
import { PracticeScreen } from "./_components/practice-screen";
import type { NonEmptyArray } from "~/lib/types";
import { cn } from "~/lib/utils";

type ScreenConfig = {
  id: string;
  title: string;
  icon: LucideIcon;
  component: React.ComponentType;
};

export const screens: NonEmptyArray<ScreenConfig> = [
  {
    id: "practice",
    title: "Practice",
    icon: BookOpen,
    component: PracticeScreen,
  },
  {
    id: "history",
    title: "History",
    icon: History,
    component: HistoryScreen,
  },
];

export default function PracticePage() {
  const [activeScreenId, setActiveScreenId] = useState<string>(screens[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up Intersection Observer to track active screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const screenId = entry.target.id;
            setActiveScreenId(screenId);
          }
        });
      },
      {
        threshold: 0.5,
        root: null,
      },
    );

    // Observe all screen elements
    screens.forEach((screen) => {
      const element = document.getElementById(screen.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        ref={containerRef}
        className="hide-scrollbar flex h-full snap-x snap-mandatory overflow-x-scroll scroll-smooth"
      >
        {screens.map((screen) => {
          const ScreenComponent = screen.component;
          return (
            <div
              key={screen.id}
              id={screen.id}
              className={cn(
                "flex flex-col items-center justify-start",
                "min-h-screen w-screen shrink-0 snap-start overflow-x-clip overflow-y-auto",
                "py-4",
              )}
            >
              <ScreenComponent />
            </div>
          );
        })}
      </div>

      <DockMenu activeScreenId={activeScreenId} />
    </div>
  );
}
