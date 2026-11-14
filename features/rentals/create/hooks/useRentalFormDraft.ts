import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

type StoredDraft = {
  values?: unknown;
  amenities?: unknown;
  step?: unknown;
};

export function useRentalFormDraft<T extends FieldValues>(
  storageKey: string,
  methods: UseFormReturn<T>,
  defaultValues: T,
  amenities: string[],
  setAmenities: Dispatch<SetStateAction<string[]>>,
  step: number,
  setStep: Dispatch<SetStateAction<number>>,
  stepCount: number,
) {
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(storageKey);

      if (savedDraft) {
        const draft = JSON.parse(savedDraft) as StoredDraft;
        const savedValues =
          draft.values && typeof draft.values === "object"
            ? (draft.values as Partial<T>)
            : {};

        methods.reset({ ...defaultValues, ...savedValues });

        if (
          Array.isArray(draft.amenities) &&
          draft.amenities.every((amenity) => typeof amenity === "string")
        ) {
          setAmenities(draft.amenities);
        }

        if (
          typeof draft.step === "number" &&
          Number.isInteger(draft.step) &&
          draft.step >= 0
        ) {
          setStep(Math.min(draft.step, stepCount - 1));
        }
      }
    } catch {
      setDraftError("Unable to restore the saved draft from this browser.");
    } finally {
      setIsDraftLoaded(true);
    }
  }, [
    defaultValues,
    methods.reset,
    setAmenities,
    setStep,
    stepCount,
    storageKey,
  ]);

  useEffect(() => {
    if (!isDraftLoaded) return;

    const saveDraft = () => {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            values: methods.getValues(),
            amenities,
            step,
          }),
        );
        setDraftError(null);
      } catch {
        setDraftError("Unable to save this draft in your browser.");
      }
    };

    saveDraft();
    const subscription = methods.watch(saveDraft);
    return () => subscription.unsubscribe();
  }, [
    amenities,
    isDraftLoaded,
    methods.getValues,
    methods.watch,
    step,
    storageKey,
  ]);

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
      setDraftError(null);
    } catch {
      setDraftError(
        "Your property was published, but its saved draft could not be cleared.",
      );
    }
  }, [storageKey]);

  return { isDraftLoaded, draftError, clearDraft };
}
