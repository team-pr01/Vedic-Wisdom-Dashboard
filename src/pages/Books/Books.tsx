/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import AllBooksTable from "../../components/BookPage/AllBooksTable/AllBooksTable";
import AllTextsTable from "../../components/BookPage/AllTextsTable/AllTextsTable";
import Translations from "../../components/BookPage/Translations/Translations";
import { useGetAllReportedMantrasQuery } from "../../redux/Features/Book/reportedMantraApi";
import AllReportedMantrasTable from "../../components/BookPage/AllReportedMantrasTable/AllReportedMantrasTable";

export type TBook = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  chapters: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const Books = () => {
  const [isReviewMantraModalOpen, setIsReviewMantraModalOpen] =
    useState<boolean>(false);
  const [reportedMantraStatus, setReportedMantraStatus] = useState("");

  const {
    data: reportedMantras,
    isLoading: isReportedMantrasLoading,
    isFetching: isReportedMantrasFetching,
  } = useGetAllReportedMantrasQuery({ status: reportedMantraStatus });

  const [activeTab, setActiveTab] = useState("Manage Books");

  const tabButtons: string[] = [
    "Manage Books",
    "Manage Texts",
    "Translations",
    "Mantra Reports",
  ];

  return (
    <div className="flex flex-col bg-white rounded-2xl p-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Book & Text Management
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 my-6">
        {tabButtons.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 font-medium transition-colors 
              ${
                activeTab === tab
                  ? "border-b-2 border-primary-10 text-primary-10"
                  : "text-gray-500 hover:text-primaryborder-primary-10"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Manage Books" && <AllBooksTable />}

      {activeTab === "Manage Texts" && <AllTextsTable />}

      {activeTab === "Translations" && <Translations />}

      {activeTab === "Mantra Reports" && (
        <div className="flex flex-col gap-4 mt-8">
          {/* Status */}
          <div className="flex justify-end">
            <select
              value={reportedMantraStatus}
              onChange={(e) => setReportedMantraStatus(e.target.value)}
              className="px-4.5 py-2 rounded-lg bg-neutral-70 border text-neutral-65 focus:outline-none focus:border-primary-10 transition duration-300"
            >
              <option value="">All Reports</option>
              {["pending", "resolved", "dismissed"].map(
                (option: any, index: number) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ),
              )}
            </select>
          </div>
          <AllReportedMantrasTable
            reportedMantras={reportedMantras?.data}
            isLoading={isReportedMantrasLoading || isReportedMantrasFetching}
            isReviewMantraModalOpen={isReviewMantraModalOpen}
            setIsReviewMantraModalOpen={setIsReviewMantraModalOpen}
          />
        </div>
      )}
    </div>
  );
};

export default Books;
