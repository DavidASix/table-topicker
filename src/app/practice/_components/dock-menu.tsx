"use client";

import { cn } from "~/lib/utils";
// import { screens } from "../page";
// import { buttonVariants } from "~/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DockMenu({ activeScreenId }: { activeScreenId: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2",
        "border-border fixed inset-x-0 bottom-0 left-1/2 z-50 w-min -translate-1/2 rounded-full border px-2.5 py-1.5 backdrop-blur-lg",
      )}
    >
      {/* {screens.map((screen) => {
        const Icon = screen.icon;
        const isActive = activeScreenId === screen.id;

        return (
          <a
            key={screen.id}
            href={`#${screen.id}`}
            className={cn(
              buttonVariants({
                size: "icon-lg",
                variant: isActive ? "default" : "outline",
              }),
              "rounded-full",
            )}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })} */}
    </div>
  );
}
