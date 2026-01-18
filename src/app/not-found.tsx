import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="relative mb-8 flex justify-center">
          <div className="relative h-64 w-64 md:h-80 md:w-80">
            <Image
              src="/mikey-idea.webp"
              alt="Mikey the microphone mascot looking confused"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <h1 className="mb-4 text-6xl font-extrabold tracking-tight md:text-7xl">
          <span className="text-primary">404</span>
        </h1>

        <h2 className="mb-4 text-2xl font-bold md:text-3xl">
          Oops! Page Not Found
        </h2>

        <p className="text-muted-foreground mb-8 text-lg md:text-xl">
          Looks like this page took an impromptu detour. Let&apos;s get you back
          on track!
        </p>

        <Link
          href="/"
          className={cn(buttonVariants({ size: "lg" }), "hover-wobble")}
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
