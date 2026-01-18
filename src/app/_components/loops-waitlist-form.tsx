"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const INIT = "INIT";
const SUBMITTING = "SUBMITTING";
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formStates = [INIT, SUBMITTING, ERROR, SUCCESS] as const;
const formStyles = {
  id: "cmka5bpaq4l9n0iyohs0tlush",
  name: "Default",
  formStyle: "inline",
  placeholderText: "you@example.com",
  buttonText: "Join Waitlist",
  successMessage: "Thanks! We'll be in touch!",
  userGroup: "waitlist",
  team: {
    mailingLists: [],
  },
};
const domain = "app.loops.so";

export default function WaitListForm() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<(typeof formStates)[number]>(INIT);
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setEmail("");
    setFormState(INIT);
    setErrorMessage("");
  };

  /**
   * Rate limit the number of submissions allowed
   * @returns {boolean} true if the form has been successfully submitted in the past minute
   */
  const hasRecentSubmission = () => {
    const time = new Date();
    const timestamp = time.valueOf();
    const previousTimestamp = localStorage.getItem("loops-form-timestamp");

    // Indicate if the last sign up was less than a minute ago
    if (
      previousTimestamp &&
      Number(previousTimestamp) + 60 * 1000 > timestamp
    ) {
      setFormState(ERROR);
      setErrorMessage("Too many signups, please try again in a little while");
      return true;
    }

    localStorage.setItem("loops-form-timestamp", timestamp.toString());
    return false;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default form submission
    event.preventDefault();

    // boundary conditions for submission
    if (formState !== INIT) return;
    if (!isValidEmail(email)) {
      setFormState(ERROR);
      setErrorMessage("Please enter a valid email");
      return;
    }
    if (hasRecentSubmission()) return;
    setFormState(SUBMITTING);

    // build body
    const formBody = `userGroup=${encodeURIComponent(
      formStyles.userGroup,
    )}&email=${encodeURIComponent(email)}&mailingLists=`;

    // API request to add user to newsletter
    fetch(`https://${domain}/api/newsletter-form/${formStyles.id}`, {
      method: "POST",
      body: formBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => [res.ok, res.json(), res] as const)
      .then(([ok, dataPromise, res]) => {
        if (ok) {
          resetForm();
          setFormState(SUCCESS);
        } else {
          void dataPromise.then((data: { message?: string }) => {
            setFormState(ERROR);
            setErrorMessage(data.message ?? res.statusText);
            localStorage.setItem("loops-form-timestamp", "");
          });
        }
      })
      .catch((error: Error) => {
        setFormState(ERROR);
        // check for cloudflare error
        if (error.message === "Failed to fetch") {
          setErrorMessage(
            "Too many signups, please try again in a little while",
          );
        } else if (error.message) {
          setErrorMessage(error.message);
        }
        localStorage.setItem("loops-form-timestamp", "");
      });
  };

  switch (formState) {
    case SUCCESS:
      return (
        <div className="flex w-full items-center justify-center">
          <p className="text-accent text-sm font-medium">
            {formStyles.successMessage}
          </p>
        </div>
      );
    case ERROR:
      return (
        <div className="space-y-3">
          <SignUpFormError />
          <BackButton />
        </div>
      );
    default:
      return (
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Input
            type="email"
            name="email"
            placeholder={formStyles.placeholderText}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full max-w-xs"
          />
          <div aria-hidden="true" className="absolute -left-506" />
          <SignUpFormButton />
        </form>
      );
  }

  function SignUpFormError() {
    return (
      <div className="w-full">
        <p className="text-destructive text-sm">
          {errorMessage || "Oops! Something went wrong, please try again"}
        </p>
      </div>
    );
  }

  function BackButton() {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={resetForm}
        className="text-muted-foreground mx-auto"
      >
        &larr; Back
      </Button>
    );
  }

  function SignUpFormButton() {
    return (
      <Button type="submit" disabled={formState === SUBMITTING}>
        {formState === SUBMITTING ? "Please wait..." : formStyles.buttonText}
      </Button>
    );
  }
}

function isValidEmail(email: string) {
  return /.+@.+/.test(email);
}
