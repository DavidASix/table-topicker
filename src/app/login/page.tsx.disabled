"use client";

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { CheckCircle, XCircle, Mail } from "lucide-react";

import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";

type FormState = null | "loading" | "success" | "error";
const helpEmail = "tabletopicker@redoxfordonline.com";

export default function Home() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [formState, setFormState] = useState<FormState>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const handleSignIn = async (formData: FormData) => {
    setFormState("loading");
    setErrorMessage("");

    try {
      const email = z.string().parse(formData.get("email"));
      if (!email) {
        throw new Error("Email is required");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      setSubmittedEmail(email);

      const method =
        process.env.NODE_ENV === "development" ? "email" : "resend";
      const signInAttempt = await signIn(method, {
        email,
        redirect: false,
        redirectTo: "/",
      });

      if (!signInAttempt?.ok || !signInAttempt || signInAttempt.error) {
        throw new Error(signInAttempt?.error ?? "Failed to sign in");
      }

      setFormState("success");
      setFailedAttempts(0);
    } catch (error) {
      console.error("Sign-in error:", error);
      setErrorMessage("Sign-in failed. Please try again.");
      setFormState("error");
      setFailedAttempts((prev) => prev + 1);
    }
  };

  if (user) {
    redirect("/");
  }

  // Login Card - reused in both mobile and desktop layouts
  const loginCard =
    status === "loading" ? (
      <div className="flex justify-center">
        <Spinner />
      </div>
    ) : (
      <Card className="border-border shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold md:text-3xl">
            Get Started
          </CardTitle>
          <CardDescription className="text-base">
            {formState === "success"
              ? "Check your inbox"
              : "Enter your email to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formState === "success" ? (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <p className="mb-1 font-semibold">Magic link sent!</p>
                  <p className="text-sm">
                    We&apos;ve sent a secure sign-in link to{" "}
                    <span className="font-medium">{submittedEmail}</span>. Click
                    the link in your email to access your account.
                  </p>
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground text-center text-xs">
                Didn&apos;t receive it? Check your spam folder or try again in a
                few minutes.
              </p>
            </div>
          ) : (
            <form
              action={(e) => handleSignIn(e)}
              className="flex flex-col gap-4"
            >
              {formState === "error" && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <p className="mb-1 font-semibold">Sign-in failed</p>
                    <p className="text-sm">{errorMessage}</p>
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="h-11"
                  required
                  disabled={formState === "loading"}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={formState === "loading"}
              >
                {formState === "loading" ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Sending magic link...
                  </span>
                ) : (
                  "Continue with Email"
                )}
              </Button>
              {failedAttempts >= 2 && (
                <a
                  href={`mailto:${helpEmail}?subject=${encodeURIComponent("Bug Report: Login Issue")}&body=${encodeURIComponent(`I am experiencing issues logging in.\n\nEmail attempted: ${submittedEmail}\nError message: ${errorMessage}\n\nPlease help!`)}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Report Login Issue
                </a>
              )}
              <p className="text-muted-foreground text-center text-xs">
                We&apos;ll send you a secure link to access your account
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    );

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      {/* Left Side - Brand Section */}
      <div className="from-primary via-primary/90 to-secondary relative flex flex-1 flex-col overflow-hidden bg-linear-to-br">
        <div className="text-primary-foreground relative z-10 flex flex-1 flex-col justify-between border p-8 md:p-12 lg:p-16">
          {/* Center Section */}
          <div className="flex flex-1 flex-col justify-center py-8 md:py-12">
            <h2 className="mb-4 text-3xl leading-tight font-bold md:mb-6 md:text-5xl">
              Welcome to App
            </h2>
            <p className="text-primary-foreground/90 mb-8 max-w-md text-lg leading-relaxed md:mb-12 md:text-xl">
              Some Text
            </p>

            {/* Mobile: Show Login Card */}
            <div className="w-full max-w-md md:hidden">{loginCard}</div>

            {/* Desktop: Show Dummy Image Placeholder */}
            {/* <div className="hidden md:flex relative w-full max-w-md aspect-video bg-primary-foreground/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20 items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-sm text-primary-foreground/70">
                  Dashboard preview showing Google Reviews integration with
                  static site generators
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form Section (Desktop Only) */}
      <div className="bg-background hidden flex-1 items-center justify-center p-8 md:flex md:p-12">
        <div className="w-full max-w-md">{loginCard}</div>
      </div>
    </div>
  );
}
