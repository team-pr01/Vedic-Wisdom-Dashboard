/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGetAllReferralsOfAnUserQuery } from "../../../redux/Features/Referral/referralApi";
import Modal from "../../Reusable/Modal/Modal";
import Loader from "../../Reusable/Loader/Loader";
import { IMAGES } from "../../../assets";

type TReferralListProps = {
  userName: string;
  userId: string;
  isReferralListModalOpen: boolean;
  setIsReferralListModalOpen: any;
};

const ReferralList: React.FC<TReferralListProps> = ({
  userName,
  userId,
  isReferralListModalOpen,
  setIsReferralListModalOpen,
}) => {
  const [page, setPage] = useState<number>(1);
  const limit = 50;
  const skip = (page - 1) * limit;

  const { data, isLoading } = useGetAllReferralsOfAnUserQuery({
    skip,
    limit,
    userId,
  });

  // Get data from API response
  const referrals = data?.data?.data || [];
  const meta = data?.data?.meta || {};

  // Use meta from API response
  const totalCount = meta?.total || 0;
  const totalPages = meta?.totalPages || 1;
  const currentPage = (meta?.skip || 0) / (meta?.limit || 10) + 1;

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const referralTableData = referrals?.map((referral: any, index: number) => ({
    _id: referral._id,
    rank: (meta?.skip || 0) + index + 1,
    image: (
      <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-10/10">
        {referral?.referredUser?.image || referral?.referredUser?.avatar ? (
          <img
            src={referral.referredUser.image || referral.referredUser.avatar}
            alt={referral?.referredUser?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={IMAGES.logo}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}
      </div>
    ),
    name: (
      <div className="flex items-center gap-2">
        <span className="font-medium text-neutral-10">
          {referral?.referredUser?.name || "—"}
        </span>
      </div>
    ),
  }));

  return (
    <Modal
      isModalOpen={isReferralListModalOpen}
      setIsModalOpen={setIsReferralListModalOpen}
      heading={
        <h1>
          Referral Leaderboard of{" "}
          <span className="text-primary-10">{userName}</span>
        </h1>
      }
    >
      <div className="relative font-Inter pt-3">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50 rounded-lg">
            <Loader size="lg" text="Loading referrals..." />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-50">
                <th className="text-left text-xs font-semibold text-neutral-45 py-3 pl-0">
                  Image
                </th>
                <th className="text-left text-xs font-semibold text-neutral-45 py-3 px-3">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-neutral-45 py-3 pr-0">
                  Sl
                </th>
              </tr>
            </thead>
            <tbody>
              {referralTableData?.length > 0 ? (
                referralTableData.map((item: any) => (
                  <tr
                    key={item._id}
                    className="border-b border-neutral-50 hover:bg-neutral-50/30 transition-colors"
                  >
                    <td className="py-3 pl-0">{item.image}</td>
                    <td className="py-3 px-3">{item.name}</td>
                    <td className="py-3 pr-0">
                      <span className="text-sm font-semibold text-neutral-10">
                        #{item.rank}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-neutral-45">
                    No referrals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="mt-6 flex justify-end items-center gap-2">
            <div className="flex items-center gap-2 text-xs lg:text-sm">
              {/* Prev Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`px-3 py-1.5 rounded-md border transition-colors ${
                  currentPage > 1
                    ? "border-primary-10 bg-primary-10 text-white hover:bg-primary-10/90 cursor-pointer"
                    : "border-neutral-55/60 text-neutral-45 cursor-not-allowed opacity-50"
                }`}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1.5 rounded-md border transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary-10 text-white border-primary-10"
                          : "border-neutral-55/60 hover:bg-primary-10 hover:text-white cursor-pointer"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
                )
              ) : (
                <>
                  {/* First Page */}
                  <button
                    onClick={() => goToPage(1)}
                    className={`px-3 py-1.5 rounded-md border transition-colors ${
                      currentPage === 1
                        ? "bg-primary-10 text-white border-primary-10"
                        : "border-neutral-55/60 hover:bg-primary-10 hover:text-white cursor-pointer"
                    }`}
                  >
                    1
                  </button>

                  {/* Ellipsis if currentPage > 3 */}
                  {currentPage > 3 && <span className="px-2">...</span>}

                  {/* Pages around current */}
                  {currentPage > 2 && (
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      className="px-3 py-1.5 rounded-md border border-neutral-55/60 hover:bg-primary-10 hover:text-white cursor-pointer"
                    >
                      {currentPage - 1}
                    </button>
                  )}

                  {/* Current Page */}
                  {currentPage !== 1 && currentPage !== totalPages && (
                    <button className="px-3 py-1.5 rounded-md border bg-primary-10 text-white border-primary-10">
                      {currentPage}
                    </button>
                  )}

                  {/* Next page after current */}
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      className="px-3 py-1.5 rounded-md border border-neutral-55/60 hover:bg-primary-10 hover:text-white cursor-pointer"
                    >
                      {currentPage + 1}
                    </button>
                  )}

                  {/* Ellipsis if currentPage < totalPages - 2 */}
                  {currentPage < totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}

                  {/* Last Page */}
                  {totalPages > 1 && (
                    <button
                      onClick={() => goToPage(totalPages)}
                      className={`px-3 py-1.5 rounded-md border transition-colors ${
                        currentPage === totalPages
                          ? "bg-primary-10 text-white border-primary-10"
                          : "border-neutral-55/60 hover:bg-primary-10 hover:text-white cursor-pointer"
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                </>
              )}

              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`px-3 py-1.5 rounded-md border transition-colors ${
                  currentPage < totalPages
                    ? "border-primary-10 bg-primary-10 text-white hover:bg-primary-10/90 cursor-pointer"
                    : "border-neutral-55/60 text-neutral-45 cursor-not-allowed opacity-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReferralList;
