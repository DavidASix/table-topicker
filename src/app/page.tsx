import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp, Sparkles, Star } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { HydrateClient } from "~/trpc/server";
import WaitListForm from "~/app/_components/loops-waitlist-form";
import { cn } from "~/lib/utils";

export default async function Home() {
  return (
    <HydrateClient>
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <h1 className="text-5xl leading-tight font-extrabold tracking-tight md:text-7xl">
                Practice <span className="text-primary">Impromptu</span>{" "}
                <span className="text-accent">Speaking</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl">
                Practice table-topics and hone your skills. Track your progress
                and build confidence with timed speaking sessions.
              </p>
              <div className="hidden justify-start md:flex">
                <Link
                  href="#waitlist"
                  className={cn(buttonVariants({ size: "lg" }), "hover-wobble")}
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="bg-primary/5 border-primary/20 relative hidden rounded-2xl border-2 p-8 md:block">
              <div className="relative flex h-100 items-center justify-center">
                <Image
                  src="/mikey.webp"
                  alt="Mikey the microphone mascot with encouraging expression"
                  width={300}
                  height={400}
                  className="-scale-x-100 object-contain"
                  priority
                />
              </div>
              <Star className="text-accent absolute top-8 right-8 h-6 w-6 animate-pulse" />
              <Star className="text-accent absolute bottom-12 left-8 h-4 w-4 animate-pulse delay-75" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 md:py-24" id="waitlist">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Join the <span className="text-primary">Waitlist</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Be the first to know when we launch TableTopicker
          </p>
          <div className="mx-auto max-w-md">
            <WaitListForm />
          </div>
        </div>
      </section>

      <section className="bg-muted/30 overflow-x-hidden px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-8">
            {/* Left Mikey - visible on large screens */}
            <div className="relative hidden h-48 w-48 shrink-0 sm:block lg:hidden">
              <Image
                src="/mikey-watch-tall.webp"
                alt="Mikey holding a stopwatch for timed practice"
                fill
                className="object-contain"
              />
            </div>

            <div className="mb-12 flex-1 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Everything You Need to{" "}
                <span className="text-primary">Level</span>{" "}
                <span className="text-accent">Up</span>
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Whether you&apos;re preparing for a contest or just practicing
                to stay sharp, TableTopicker can help!
              </p>
            </div>

            {/* Right Mikey - visible on large screens */}
            <div className="relative hidden h-48 w-48 shrink-0 sm:block lg:hidden">
              <Image
                src="/mikey-idea.webp"
                alt="Mikey with a lightbulb idea for AI-generated topics"
                fill
                className="-scale-x-100 object-contain"
              />
            </div>
          </div>

          <div className="grid gap-6 overflow-visible lg:grid-cols-3">
            <Card className="group border-primary/20 relative overflow-visible transition-all hover:scale-[1.0025] hover:shadow-lg">
              <CardHeader className="relative z-10">
                <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <Clock className="text-primary h-8 w-8" />
                </div>
                <CardTitle>Timed Practice</CardTitle>
                <CardDescription>
                  1-2 minute rounds with built-in timer and stop-light color
                  notifiers. Speak concisely and confidently.
                </CardDescription>
              </CardHeader>
              <div className="absolute bottom-0 left-0 hidden h-72 w-72 -translate-x-[70%] lg:block">
                <Image
                  src="/mikey-watch-tall.webp"
                  alt="Mikey holding a stopwatch for timed practice"
                  fill
                  className="object-contain"
                />
              </div>
            </Card>

            <Card className="group border-primary/20 transition-all hover:scale-[1.0025] hover:shadow-lg">
              <CardHeader>
                <div className="bg-accent/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <TrendingUp className="text-accent h-8 w-8" />
                </div>
                <CardTitle>Track Your Progress</CardTitle>
                <CardDescription>
                  Rate your performance. Watch your skills grow over time
                  through self analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-primary/20 relative overflow-visible transition-all hover:scale-[1.0025] hover:shadow-lg">
              <CardHeader className="relative z-10">
                <div className="bg-accent/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                  <Sparkles className="text-accent h-8 w-8" />
                </div>
                <CardTitle className="flex items-center gap-2">
                  AI-Generated Topics
                  <Badge variant="secondary" className="bg-accent/20">
                    Premium
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Unlimited questions for any theme you can imagine.
                </CardDescription>
              </CardHeader>
              <div className="absolute right-0 -bottom-10 hidden h-72 w-72 translate-x-[70%] lg:block">
                <Image
                  src="/mikey-idea.webp"
                  alt="Mikey with a lightbulb idea for AI-generated topics"
                  fill
                  className="-scale-x-100 object-contain"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="bg-primary/5 absolute inset-0" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-16 text-3xl font-bold md:text-5xl">
            <i>All</i> your conversations are{" "}
            <span className="text-primary">impromptu</span> so it&apos;s
            something you should <span className="text-accent">practice</span>.
          </h2>

          <Link
            href="#waitlist"
            className={cn(buttonVariants({ size: "lg" }), "hover-wobble")}
          >
            Get Started
          </Link>
        </div>
      </section>
    </HydrateClient>
  );
}
