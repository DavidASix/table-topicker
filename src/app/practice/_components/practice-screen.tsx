"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

const practiceFormSchema = z.object({
  themeId: z.string().uuid({ message: "Please select a theme" }),
});

const aiFormSchema = z.object({
  theme: z.string().min(1, { message: "Please enter a theme" }),
});

type PracticeFormValues = z.infer<typeof practiceFormSchema>;
type AIFormValues = z.infer<typeof aiFormSchema>;

export function PracticeScreen() {
  const themes = api.themes.selectSystemThemes.useQuery({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceFormSchema),
    defaultValues: {
      themeId: "",
    },
  });

  const {
    control: aiControl,
    handleSubmit: handleAISubmit,
    formState: { errors: aiErrors },
  } = useForm<AIFormValues>({
    resolver: zodResolver(aiFormSchema),
    defaultValues: {
      theme: "",
    },
  });

  const questionMutation = api.questions.selectRandomByTheme.useMutation();
  const aiQuestionMutation = api.questions.generateAiQuestion.useMutation();

  const onSubmit = (data: PracticeFormValues) => {
    questionMutation.mutate({ themeId: data.themeId });
  };

  const onAISubmit = (data: AIFormValues) => {
    aiQuestionMutation.mutate({ theme: data.theme, difficulty: "easy" });
  };

  return (
    <div className="container flex flex-1 flex-col items-center justify-start">
      <div>
        <h1 className="mb-4 text-3xl font-bold">Practice Screen</h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Card>
          <CardContent>
            {questionMutation.data ? (
              <>
                <h2 className="text-xl font-semibold">Your Question:</h2>
                <p className="text-lg">{questionMutation.data.question}</p>
              </>
            ) : aiQuestionMutation.data ? (
              <>
                <h2 className="text-xl font-semibold">
                  AI Generated Question:
                </h2>
                <p className="text-lg">{aiQuestionMutation.data.question}</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Theme: {aiQuestionMutation.data.theme} | Difficulty:{" "}
                  {aiQuestionMutation.data.difficulty}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Select a topic or generate an AI question to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl space-y-4"
      >
        <Controller
          name="themeId"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Theme</FieldLabel>
              <FieldContent>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={themes.isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes?.data?.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={errors.themeId ? [errors.themeId] : []} />
              </FieldContent>
            </Field>
          )}
        />

        <Button type="submit" disabled={questionMutation.isPending}>
          Get Question
        </Button>
      </form>

      <div className="my-8 w-full max-w-4xl text-center">
        <p className="text-muted-foreground text-sm">or</p>
      </div>

      <form
        onSubmit={handleAISubmit(onAISubmit)}
        className="w-full max-w-4xl space-y-4"
      >
        <Controller
          name="theme"
          control={aiControl}
          render={({ field }) => (
            <Field>
              <FieldLabel>AI Theme</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  placeholder="Enter a custom theme (e.g., space exploration, cooking)"
                />
                <FieldError errors={aiErrors.theme ? [aiErrors.theme] : []} />
              </FieldContent>
            </Field>
          )}
        />

        <Button type="submit" disabled={aiQuestionMutation.isPending}>
          {aiQuestionMutation.isPending ? "Generating..." : "AI Generate"}
        </Button>
      </form>
    </div>
  );
}
