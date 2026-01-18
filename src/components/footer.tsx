import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary mt-auto min-h-40 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-primary-foreground flex items-center space-x-2"
            >
              <Sparkles className="h-6 w-6" style={{ color: "#E8A03C" }} />
              <span className="text-xl font-bold">TableTopicker</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm">
              Practice impromptu speaking with confidence
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-primary-foreground text-sm font-semibold tracking-wider uppercase">
              Quick Links
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
              >
                Home
              </Link>
              {/* <Link
                href="/practice"
                className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
              >
                Practice
              </Link> */}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-primary-foreground text-sm font-semibold tracking-wider uppercase">
              More
            </h3>
            <div className="flex flex-col space-y-2">
              {/* <Link
                href="/privacy"
                className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
              >
                Privacy Policy
              </Link> */}
              <Link
                href="https://davidasix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-sm transition-colors"
              >
                Built by davidasix
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <p className="text-primary-foreground/60 text-center text-sm">
            © {new Date().getFullYear()} TableTopicker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
