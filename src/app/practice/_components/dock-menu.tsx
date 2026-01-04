"use client";

import { cn } from "~/lib/utils";
import { screens } from "../page";
import { Button } from "~/components/ui/button";

export function DockMenu({ activeScreenId }: { activeScreenId: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2",
        "border-border fixed inset-x-0 bottom-0 left-1/2 z-50 w-min -translate-1/2 rounded-full border px-2.5 py-1.5 backdrop-blur-lg",
      )}
    >
      {screens.map((screen) => {
        const Icon = screen.icon;
        const isActive = activeScreenId === screen.id;

        return (
          <Button
            asChild
            size="icon-lg"
            key={screen.id}
            className="rounded-full"
            variant={isActive ? "default" : "outline"}
          >
            <a href={`#${screen.id}`}>
              <Icon className="h-5 w-5" />
            </a>
          </Button>
        );
      })}
    </div>
  );
}
