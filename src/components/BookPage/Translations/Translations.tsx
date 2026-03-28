/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGetAllBooksQuery } from "../../../redux/Features/Book/bookApi";
import TranslateBookModal from "./TranslateBookModal";
import { useGetTextByDetailsQuery } from "../../../redux/Features/Book/textsApi";
import Loader from "../../Reusable/Loader/Loader";
import Button from "../../Reusable/Button/Button";

type TSelectedBook = {
  _id: string;
  name: string;
  levels: { _id: string; name: string }[];
} | null;

const Translations = () => {
  const { data } = useGetAllBooksQuery({});
  const books = data?.data?.data || [];
  const [isTranslateModalOpen, setIsTranslateModalOpen] =
    useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<TSelectedBook>(null);
  const [locationValues, setLocationValues] = useState<Record<string, string>>(
    {},
  );

  const shouldFetch =
    !!selectedBook?._id &&
    Object.values(locationValues).every((v) => v.trim() !== "");

  const {
    data: singleText,
    isLoading: isSingleTextLoading,
    isFetching: isSingleTextFetching,
  } = useGetTextByDetailsQuery(
    {
      bookId: selectedBook?._id!,
      levels: locationValues,
    },
    {
      skip: !shouldFetch,
    },
  );

  const allBookNames = books?.map((item: any) => ({
    _id: item?._id,
    name: item?.name,
    levels: item.levels || [],
  }));

  if (!allBookNames) return <Loader />;

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = allBookNames.find((b: any) => b._id === selectedId);
    if (selected) {
      setSelectedBook(selected);
      // Reset location values for the new book
      const initialLocation: Record<string, string> = {};
      selected.levels.forEach((lvl: any) => {
        initialLocation[lvl.name] = "";
      });
      setLocationValues(initialLocation);
    }
  };

  const handleLocationChange = (levelName: string, value: string) => {
    setLocationValues((prev) => ({ ...prev, [levelName]: value }));
  };

  return (
    <div className="bg-gray-100 p-4 rounded-2xl mt-8 font-Inter">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
        Find Text by Location
      </h3>

      <div className="flex justify-between items-center gap-4 mt-3">
        <div className="flex items-center gap-4">
          {/* Books dropdown */}
          <div className="flex flex-col gap-2 font-Inter w-150">
            <label className="flex flex-row items-center w-full justify-between text-neutral-65">
              <span className="text-neutral-20 leading-4.5 text-[15px] font-medium tracking-[-0.16]">
                Book
              </span>
            </label>
            <select
              value={selectedBook?._id || ""}
              onChange={handleBookChange}
              className="relative block w-full px-4 py-3 border text-neutral-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200 cursor-pointer bg-white border-neutral-50"
            >
              <option value="" disabled>
                Select Book
              </option>
              {allBookNames.map((option: any) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic location fields */}
          {selectedBook && (
            <div className="flex flex-col gap-2 font-Inter w-full">
              <label className="flex flex-row items-center w-full justify-between text-neutral-65">
                <span className="text-neutral-20 leading-4.5 text-[15px] font-medium tracking-[-0.16]">
                  Enter Location <span className="text-primary-10">*</span>
                </span>
              </label>

              <div className="flex items-center gap-2">
                {selectedBook?.levels?.map((lvl) => (
                  <input
                    key={lvl._id}
                    placeholder={lvl.name}
                    value={locationValues[lvl.name] || ""}
                    onChange={(e) =>
                      handleLocationChange(lvl.name, e.target.value)
                    }
                    className="relative block w-full px-4 py-3 border text-neutral-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200 border-neutral-50"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          type="button"
          label={
            isSingleTextFetching || isSingleTextLoading
              ? "Finding Text..."
              : "Translate"
          }
          onClick={() => setIsTranslateModalOpen(true)}
          disabled={!shouldFetch || isSingleTextFetching}
        />
        {/* 
        <button
          onClick={() => setIsTranslateModalOpen(true)}
          disabled={!shouldFetch || isSingleTextFetching}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed mt-8"
        >
          {isSingleTextFetching || isSingleTextLoading ? (
            "Finding Text..."
          ) : (
            <p className="flex">
              <Book className="w-5 h-5 mr-2 text-white" />
              Translate
            </p>
          )}
        </button> */}
      </div>

      {isTranslateModalOpen && (
        <TranslateBookModal
          data={singleText?.data}
          setIsTranslateModalOpen={setIsTranslateModalOpen}
        />
      )}

      {Object.values(locationValues).some((v) => v) && !singleText?.data && (
        <p className="mt-3 text-red-500">
          No text found. Try to search by another location
        </p>
      )}
    </div>
  );
};

export default Translations;
