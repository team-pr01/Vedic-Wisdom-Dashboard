/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSingleNewsByIdQuery } from "../../../redux/Features/News/newsApi";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import { LANGUAGES } from "../../../constants/allLanguages";
import { useState, useMemo } from "react";
import {
  Calendar,
  Eye,
  ThumbsUp,
  Globe,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { formatDate } from "../../../utils/formatDate";

type NewsDetailsProps = {
  isNewsDetailsModalOpen: boolean;
  setIsNewsDetailsModalOpen: any;
  newsId: string;
};

const NewsDetails = ({
  isNewsDetailsModalOpen,
  setIsNewsDetailsModalOpen,
  newsId,
}: NewsDetailsProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, isError } = useGetSingleNewsByIdQuery(
    { id: newsId, languageCode: selectedLanguage },
    { skip: !newsId },
  );

  const news = data?.data || {};
  const { title, content, tags, category, likes, views, createdAt } = news;

  // Filter languages based on search
  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return LANGUAGES;
    return LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Get current language name
  const currentLanguage = LANGUAGES.find(
    (lang) => lang.code === selectedLanguage,
  );

  return (
    <Modal
      isModalOpen={isNewsDetailsModalOpen}
      setIsModalOpen={setIsNewsDetailsModalOpen}
      heading="News Details"
    >
      <div className="relative">
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50 rounded-lg">
            <Loader size="lg" text="Loading news details..." />
          </div>
        )}

        {/* Language Selector with Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-20 mb-2">
            <Globe size={14} className="inline mr-1" />
            Language
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full md:w-64 flex items-center justify-between px-4 py-2 border border-neutral-50 rounded-lg bg-white hover:bg-neutral-50 transition-colors"
            >
              <span className="text-sm text-neutral-10">
                {currentLanguage?.name || "Select Language"}
              </span>
              <ChevronDown size={16} className="text-neutral-45" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-full md:w-80 bg-white rounded-lg shadow-lg border border-neutral-50 z-40 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-3 border-b border-neutral-50">
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-45"
                      />
                      <input
                        type="text"
                        placeholder="Search language..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-sm border border-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <X
                            size={14}
                            className="text-neutral-45 hover:text-neutral-20"
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Language List */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setSelectedLanguage(language.code);
                          setIsDropdownOpen(false);
                          setSearchQuery("");
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                          selectedLanguage === language.code
                            ? "bg-primary-10/10 text-primary-10"
                            : "text-neutral-10"
                        }`}
                      >
                        <span>{language.name}</span>
                        <span className="text-xs text-neutral-45 uppercase">
                          {language.code}
                        </span>
                      </button>
                    ))}
                    {filteredLanguages.length === 0 && (
                      <div className="px-4 py-3 text-sm text-neutral-45 text-center">
                        No languages found
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* No Content State */}
        {isError && (
          <div className="text-center py-12">
            <Globe size={48} className="mx-auto text-neutral-45 mb-3" />
            <p className="text-neutral-45">
              No content available for {currentLanguage?.name}
            </p>
          </div>
        )}

        {/* News Content */}
        {!isError && (
          <div className="space-y-6 px-1">
            {/* Featured Image */}
            {news?.imageUrl && (
              <div className="w-full h-64 rounded-xl overflow-hidden bg-neutral-100">
                <img
                  src={news.imageUrl}
                  alt={title || "News image"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-10 font-Inter leading-tight">
                {title || "—"}
              </h2>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 py-3 border-y border-neutral-50">
              <div className="bg-primary-10 rounded-3xl px-2 py-1 text-white text-xs">
                {category}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-neutral-45">
                <Calendar size={14} />
                <span>{formatDate(createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-neutral-45">
                <Eye size={14} />
                <span>{views || 0} views</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-neutral-45">
                <ThumbsUp size={14} />
                <span>{likes || 0} likes</span>
              </div>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-20 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-10/10 text-primary-10 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content with Rich Text */}
            {content && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-20 mb-3">
                  Content
                </h3>
                <div className="prose prose-neutral max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    className="news-content"
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      lineHeight: "1.6",
                      color: "#1C2542",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NewsDetails;
