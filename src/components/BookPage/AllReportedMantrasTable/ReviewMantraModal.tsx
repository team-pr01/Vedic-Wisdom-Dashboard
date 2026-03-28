/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import {
  useGetMantraToResolveQuery,
  useGetSingleReportedMantraQuery,
  useResolveIssueMutation,
  useUpdateStatusMutation,
} from "../../../redux/Features/Book/reportedMantraApi";
import toast from "react-hot-toast";
import Textarea from "../../Reusable/TextArea/TextArea";
import Loader from "../../Reusable/Loader/Loader";
import { formatDate } from "../../../utils/formatDate";

interface ReviewMantraModalProps {
  selectedMantraId: string;
  setIsReviewMantraModalOpen: (open: boolean) => void;
}

const ReviewMantraModal: React.FC<ReviewMantraModalProps> = ({
  selectedMantraId,
  setIsReviewMantraModalOpen,
}) => {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [locationValues, setLocationValues] = useState<Record<string, string>>(
    {}
  );
  const [isHumanVerified, setIsHumanVerified] = useState<boolean>(false);
  const [translationText, setTranslationText] = useState("");
  const {
    data: reportedMantra,
    isLoading,
    isFetching,
  } = useGetSingleReportedMantraQuery(selectedMantraId);
  const [updateStatus, { isLoading: isUpdateStatus }] =
    useUpdateStatusMutation();
  const [resolveIssue, { isLoading: isSaving }] = useResolveIssueMutation();

  const data = reportedMantra?.data;

  const shouldFetch =
    !!selectedBook?._id &&
    Object.values(locationValues).every((v) => v.trim() !== "");

  const {
    data: singleText,
    isLoading: isSingleTextLoading,
    isFetching: isSingleTextFetching,
  } = useGetMantraToResolveQuery(
    {
      bookId: selectedBook?._id!,
      levels: locationValues,
    },
    {
      skip: !shouldFetch,
    }
  );

  useEffect(() => {
    setSelectedBook(data?.bookId);
    const initialLocation: Record<string, string> = {};
    data?.bookId?.levels?.forEach((lvl: any) => {
      initialLocation[lvl.name] = "";
    });
    setLocationValues(initialLocation);
    setIsHumanVerified(data?.isHumanVerified);
  }, [isLoading, data]);

  const handleDismissReport = async () => {
    try {
      const payload = {
        status: "dismissed",
      };
      const response = await updateStatus({
        id: selectedMantraId,
        data: payload,
      }).unwrap();

      if (response?.success) {
        toast.success("Report dismissed successfully");
        setIsReviewMantraModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleSaveAndResolve = async () => {
    try {
      const payload = {
        langCode: data?.languageCode,
        translation: translationText,
        reportId: selectedMantraId,
        status: "resolved",
      };
      const response = await resolveIssue({
        id: data?.textId?._id,
        data: payload,
      }).unwrap();

      if (response?.success) {
        toast.success("Report resolved successfully");
        setIsReviewMantraModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const isSaveButtonDisabled = !translationText || isSaving;

  const handleLocationChange = (levelName: string, value: string) => {
    setLocationValues((prev) => ({ ...prev, [levelName]: value }));
  };

  const translationForLanguage = singleText?.data?.translations?.find(
    (t: any) => t.langCode === data?.languageCode
  );

  // When the data loads, initialize the state
  useEffect(() => {
    if (translationForLanguage) {
      setTranslationText(translationForLanguage.translation);
    }
  }, [
    translationForLanguage,
    singleText,
    isSingleTextFetching,
    isSingleTextLoading,
  ]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Loader (centered) */}
        {(isLoading || isFetching) && (
          <div className="py-20">
            <Loader />
          </div>
        )}

        {/* Render only when data is available */}
        {!isLoading && !isFetching && data && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Review Mantra Report
              </h2>
              <button
                onClick={() => setIsReviewMantraModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Left - Report Details */}
              <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-3">
                  Report Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Reason</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100">
                      {data.reason}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Feedback</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 italic">
                      “{data.feedback}”
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Reported On</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100">
                      {data?.createdAt
                        ? formatDate(data.createdAt)
                        : "N/A"}
                    </div>
                  </div>

                  {/* Dynamic location fields */}
                  {selectedBook && (
                    <div className="flex flex-col gap-2 font-Inter w-full">
                      <label className="text-neutral-65">
                        Enter Location
                        <span className="text-red-600"> *</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {selectedBook.levels.map((lvl: any) => (
                          <input
                            key={lvl._id}
                            placeholder={lvl.name}
                            value={locationValues[lvl.name] || ""}
                            onChange={(e) =>
                              handleLocationChange(lvl.name, e.target.value)
                            }
                            className="px-[18px] py-2 rounded-lg border focus:outline-none focus:border-primary-500 transition duration-300 bg-neutral-50 w-[130px]"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mantra (view only) */}
              <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-3">
                  Mantra
                </h3>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg w-full flex items-center gap-5">
                    <div>
                      <p className="text-sm text-slate-500">Book Name</p>
                      <p className="text-sm text-slate-800 dark:text-slate-100 mt-1">
                        {data?.bookId?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Mantra Location</p>
                      <p className="text-sm text-slate-800 dark:text-slate-100 mt-1">
                        {data?.textId?.location
                          ?.map(
                            (location: any) =>
                              `${location.levelName}-${location?.value}`
                          )
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Original Text</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 whitespace-pre-line">
                      {data.originalText}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Translation</p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 whitespace-pre-line">
                      {data.translation}
                    </div>
                  </div>

                  {isSingleTextLoading || isSingleTextFetching ? (
                    <Loader />
                  ) : (
                    singleText && (
                      <div className="md:col-span-8 max-h-[calc(65vh-3rem)] overflow-y-auto pr-2">
                        <Textarea
                          label="Translation"
                          name={`translations.${data?.languageCode}.translation`}
                          value={translationText}
                          onChange={(e) => setTranslationText(e.target.value)}
                          isRequired={false}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  id="humanVerifiedCheckbox"
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isHumanVerified}
                  onChange={async (e) => {
                    const newValue = e.target.checked;
                    setIsHumanVerified(newValue);

                    try {
                      const payload = { isHumanVerified: newValue };
                      await toast.promise(
                        updateStatus({
                          id: selectedMantraId,
                          data: payload,
                        }).unwrap(),
                        {
                          loading: "Loading...",
                          success: "Status updated successfully!",
                          error: "Failed to update status. Please try again.",
                        }
                      );
                    } catch (error: any) {
                      toast.error(
                        error?.data?.message || "Something went wrong"
                      );
                    }
                  }}
                />
                <label
                  htmlFor="humanVerifiedCheckbox"
                  className="text-slate-700 dark:text-slate-300 text-sm cursor-pointer"
                >
                  Mark as Human Verified
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDismissReport}
                  type="button"
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500"
                >
                  {isUpdateStatus ? "Please wait..." : "Dismiss Report"}
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndResolve}
                  disabled={isSaveButtonDisabled}
                  className="px-4 py-2 bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg hover:bg-green-700"
                >
                  {isSaving ? "Please wait..." : "Save & Resolve"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewMantraModal;
