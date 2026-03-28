/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Textarea from "../../Reusable/TextArea/TextArea";
import { SparklesIcon } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useTranslateTextMutation,
  useUpdateTranslationMutation,
} from "../../../redux/Features/Book/textsApi";
import toast from "react-hot-toast";
import { LANGUAGES } from "../../../constants/allLanguages";
import Button from "../../Reusable/Button/Button";

interface TranslationFormData {
  translations: {
    [langCode: string]: {
      translation: string;
      wordByWord: string;
      wordMeanings: string;
    };
  };
}

interface SanskritWord {
  sanskritWord: string;
  shortMeaning: string;
  descriptiveMeaning: string;
}

interface Translation {
  langCode: string;
  translation: string;
  sanskritWordBreakdown?: SanskritWord[];
}

interface BookTextData {
  _id: string;
  originalText: string;
  primaryTranslation: string;
  translations?: Translation[];
  location: Array<{ levelName: string; value: string }>;
  tags: string[];
  isVerified: boolean;
  bookId: {
    _id: string;
    name: string;
    type: string;
    structure: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const TranslateBookModal = ({
  data,
  setIsTranslateModalOpen,
}: {
  data: BookTextData;
  setIsTranslateModalOpen: (isOpen: boolean) => void;
}) => {
  const [updateTranslation, { isLoading: isUpdating }] =
    useUpdateTranslationMutation();
  const [translateText, { isLoading: isTranslating }] =
    useTranslateTextMutation();
  const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TranslationFormData>({
    defaultValues: {
      translations: {},
    },
  });

  // Setting default values
  useEffect(() => {
    if (data?.translations) {
      const initialTranslations: TranslationFormData["translations"] = {};

      data.translations.forEach((trans: Translation) => {
        // Combine word-by-word translations
        const wordByWord =
          trans.sanskritWordBreakdown
            ?.map((word) => `${word.sanskritWord} - ${word.shortMeaning}`)
            .join("\n") || "";

        // Combine word meanings
        const wordMeanings =
          trans.sanskritWordBreakdown
            ?.map((word) => `${word.sanskritWord} - ${word.descriptiveMeaning}`)
            .join("\n") || "";

        initialTranslations[trans.langCode] = {
          translation: trans.translation,
          wordByWord,
          wordMeanings,
        };
      });

      reset({ translations: initialTranslations });
    }
  }, [data, reset]);

  const toggleLanguage = (language: any, checked: boolean) => {
    if (checked) {
      setSelectedLanguages((prev) => [...prev, language]);
    } else {
      setSelectedLanguages((prev) =>
        prev.filter((lang) => lang.code !== language.code),
      );
    }
  };

  const handleTranslateLanguage = async () => {
    if (!data?._id || selectedLanguages.length === 0) {
      toast.error("Please select at least one language");
      return;
    }

    const languageCodes = selectedLanguages.map((lang) => lang.code);

    try {
      const payload = {
        textId: data._id,
        languageCodes,
      };
      const response = await translateText(payload).unwrap();

      toast.success("Shloka translated successfully!");
      setSelectedLanguages([]);

      // Update form with new translations
      if (response.translations) {
        const currentTranslations = watch("translations") || {};
        const updatedTranslations = { ...currentTranslations };

        response.translations.forEach((trans: Translation) => {
          const wordByWord =
            trans.sanskritWordBreakdown
              ?.map((word) => `${word.sanskritWord} - ${word.shortMeaning}`)
              .join("\n") || "";

          const wordMeanings =
            trans.sanskritWordBreakdown
              ?.map(
                (word) => `${word.sanskritWord} - ${word.descriptiveMeaning}`,
              )
              .join("\n") || "";

          updatedTranslations[trans.langCode] = {
            translation: trans.translation,
            wordByWord,
            wordMeanings,
          };
        });

        reset({ translations: updatedTranslations });
      }
    } catch (error: any) {
      const errMsg =
        error?.data?.message || "Something went wrong during translation";
      toast.error(errMsg);
    }
  };

  const onSubmit = async (formData: TranslationFormData) => {
    try {
      // Convert translations object to array
      const translationsArray: Translation[] = Object.entries(
        formData.translations,
      ).map(([langCode, trans]) => {
        const sanskritWordBreakdown: SanskritWord[] = [];

        // Split wordByWord and wordMeanings into arrays
        const wordByWordLines = trans.wordByWord.split("\n");
        const wordMeaningLines = trans.wordMeanings.split("\n");

        // Match each Sanskrit word with its shortMeaning and descriptiveMeaning
        wordByWordLines.forEach((line, index) => {
          const [sanskritWord, shortMeaning] = line.split(" - ");
          const [_, descriptiveMeaning] =
            wordMeaningLines[index]?.split(" - ") || [];
          if (sanskritWord && shortMeaning && descriptiveMeaning) {
            sanskritWordBreakdown.push({
              sanskritWord: sanskritWord.trim(),
              shortMeaning: shortMeaning.trim(),
              descriptiveMeaning: descriptiveMeaning.trim(),
            });
          }
        });

        return {
          langCode,
          translation: trans.translation,
          sanskritWordBreakdown,
        };
      });

      // Call API
      const response = await updateTranslation({
        id: data._id,
        data: {
          translations: translationsArray,
        },
      }).unwrap();

      if (response?.success) {
        toast.success("Book text updated successfully");
        setIsTranslateModalOpen(false);
      }
    } catch (error: any) {
      const errMsg = error?.data?.message || "Something went wrong";
      toast.error(errMsg);
    }
  };

  const currentTranslations = watch("translations") || {};

  return (
    <div className="fixed inset-0 bg-neutral-5/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex flex-col max-h-[75vh]">
            <div className="mb-4 flex flex-col justify-end">
              <div className="flex items-center w-full overflow-x-auto gap-4 mt-3">
                {LANGUAGES.map((language) => {
                  return (
                    <div
                      key={language.code}
                      className="flex items-center gap-2"
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedLanguages.some(
                          (lang) => lang.code === language.code,
                        )}
                        onChange={(e) =>
                          toggleLanguage(language, e.target.checked)
                        }
                        className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-300 focus:ring-purple-500"
                      />

                      {/* Button toggles checkbox */}
                      <button
                        type="button"
                        onClick={() => {
                          const isChecked = selectedLanguages.some(
                            (lang) => lang.code === language.code,
                          );
                          toggleLanguage(language, !isChecked);
                        }}
                        className={`flex items-center justify-center px-2 py-1 rounded shadow-sm text-xs font-medium whitespace-nowrap transition duration-300 border border-primary-10
      ${
        selectedLanguages.some((lang) => lang.code === language.code)
          ? "bg-primary-10 text-white"
          : "bg-white text-primary-10 hover:bg-primary-10 hover:text-white"
      }`}
                      >
                        {language.name}
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleTranslateLanguage}
                className="flex items-center text-xs gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed w-fit ml-auto mt-3"
              >
                <SparklesIcon className="w-5 h-5" />
                {isTranslating ? "Translating..." : "Generate by AI"}
              </button>
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto">
              <div className="md:col-span-4 space-y-4">
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg sticky top-0">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    ORIGINAL TEXT (SANSKRIT)
                  </label>
                  <p className="mt-1 text-slate-700 dark:text-slate-200 whitespace-pre-wrap font-serif text-lg">
                    {data?.originalText}
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    PRIMARY TRANSLATION
                  </label>
                  <p className="mt-1 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                    {data?.primaryTranslation}
                  </p>
                </div>
              </div>
              <div className="md:col-span-8 max-h-[calc(65vh-3rem)] overflow-y-auto pr-2 space-y-4">
                {LANGUAGES.map((lang) => {
                  const langData = currentTranslations[lang.code] || {
                    translation: "",
                    wordByWord: "",
                    wordMeanings: "",
                  };

                  return (
                    <div
                      key={lang.code}
                      className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg"
                    >
                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-3">
                        {lang.name}
                      </h4>
                      <div className="space-y-4">
                        <Textarea
                          label="Translation (ভাবার্থ)"
                          name=""
                          value={langData.translation}
                          onChange={(e) =>
                            setValue(
                              `translations.${lang.code}.translation`,
                              e.target.value,
                            )
                          }
                          error={
                            errors.translations?.[lang.code]?.translation as
                              | import("react-hook-form").FieldError
                              | undefined
                          }
                          isRequired={false}
                        />
                        <Textarea
                          label="Word-by-Word (পদ)"
                          name=""
                          value={langData.wordByWord}
                          onChange={(e) =>
                            setValue(
                              `translations.${lang.code}.wordByWord`,
                              e.target.value,
                            )
                          }
                          error={
                            errors.translations?.[lang.code]?.wordByWord as
                              | import("react-hook-form").FieldError
                              | undefined
                          }
                          placeholder="Format: SanskritWord - ShortMeaning&#10;e.g., ॐ - 45"
                          isRequired={false}
                        />
                        <Textarea
                          label="Word Meanings (পদার্থ)"
                          name=""
                          value={langData.wordMeanings}
                          onChange={(e) =>
                            setValue(
                              `translations.${lang.code}.wordMeanings`,
                              e.target.value,
                            )
                          }
                          error={
                            errors.translations?.[lang.code]?.wordMeanings as
                              | import("react-hook-form").FieldError
                              | undefined
                          }
                          placeholder="Format: SanskritWord - DescriptiveMeaning&#10;e.g., ॐ - the periodical sound, the existence"
                          isRequired={false}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <Button
              label={"Cancel"}
              type="button"
              variant="secondary"
              className="py-1.75 w-full md:w-fit"
              onClick={() => setIsTranslateModalOpen(false)}
            />
            <Button
              type="submit"
              label={isUpdating ? "Please wait..." : "Save All Changes"}
              variant="primary"
              className="py-1.75 w-full md:w-fit"
              isLoading={isUpdating || isUpdating}
              isDisabled={isUpdating || isUpdating}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TranslateBookModal;