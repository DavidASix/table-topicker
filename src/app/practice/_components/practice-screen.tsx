"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
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

type PracticeFormValues = z.infer<typeof practiceFormSchema>;

export function PracticeScreen() {
  const themes = api.themes.selectSystemThemes.useQuery({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceFormSchema),
  });

  const questionMutation = api.questions.selectRandomByTheme.useMutation();

  const onSubmit = (data: PracticeFormValues) => {
    questionMutation.mutate({ themeId: data.themeId });
  };

  return (
    <div className="container flex-1">
      <h1 className="mb-8 text-3xl font-bold">Practice Questions</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
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
                    <SelectValue placeholder="Select a theme" />
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

      {questionMutation.data && (
        <div className="mt-8 rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Your Question:</h2>
          <p className="text-lg">{questionMutation.data.question}</p>
        </div>
      )}
    </div>
  );
}
