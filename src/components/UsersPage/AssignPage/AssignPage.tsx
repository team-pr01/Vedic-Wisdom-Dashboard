/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useAssignPagesMutation,
  useGetSingleUserByIdQuery,
} from "../../../redux/Features/User/userApi";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import { navItems } from "../../Sidebar/Sidebar";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import { X } from "lucide-react";

type TFormValues = {
  assignedPages: string[];
};

type TAssignPageProps = {
  isAssignPageModalOpen: boolean;
  setIsAssignPageModalOpen: any;
  userId: string;
  userName: string;
};

const AssignPage: React.FC<TAssignPageProps> = ({
  isAssignPageModalOpen,
  setIsAssignPageModalOpen,
  userId,
  userName,
}) => {
  const { handleSubmit, reset } = useForm<TFormValues>();

  const { data, isLoading: isSingleUserDataLoading } =
    useGetSingleUserByIdQuery(userId);
  const [assignPages, { isLoading: isAssigningPage }] =
    useAssignPagesMutation();

  const [assignedPages, setAssignedPages] = useState<string[]>([]);

  // Fetching default values
  useEffect(() => {
    const userDetails = data?.data || {};
    setAssignedPages(userDetails?.assignedPages || []);
  }, [data]);

  const handleTogglePage = (pagePath: string) => {
    if (assignedPages.includes(pagePath)) {
      // Remove page if already assigned
      setAssignedPages(assignedPages.filter((path) => path !== pagePath));
    } else {
      // Add page if not assigned
      setAssignedPages([...assignedPages, pagePath]);
    }
  };

  const handleChangeAssignedPages = async () => {
    try {
      const payload = {
        userId,
        pages: assignedPages,
      };
      const response = await assignPages(payload).unwrap();
      if (response?.success)
        toast.success(response?.message || "Pages updated successfully");
      setIsAssignPageModalOpen(false);
      reset();
    } catch (error) {
      const errMsg =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as any).data?.message === "string"
          ? (error as any).data.message
          : "Something went wrong";
      toast.error(errMsg);
    }
  };

  const removePage = (pageToRemove: string) => {
    setAssignedPages(assignedPages.filter((page) => page !== pageToRemove));
  };

  return (
    <Modal
      isModalOpen={isAssignPageModalOpen}
      setIsModalOpen={setIsAssignPageModalOpen}
      heading={
        <h1>
          Assign Pages to <span className="text-primary-10">{userName}</span>
        </h1>
      }
    >
      <div className="relative font-Inter pt-3">
        {isSingleUserDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleChangeAssignedPages)}
          className="space-y-6"
        >
          {/* All Pages */}
          <div>
            <label className="block text-sm font-medium text-neutral-20 mb-3">
              Available Pages
            </label>
            <div className="flex flex-wrap items-center gap-3 w-full">
              {navItems?.map((page) => (
                <button
                  key={page?.label}
                  type="button"
                  onClick={() => handleTogglePage(page.path)}
                  className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ${
                    assignedPages.includes(page.path)
                      ? "bg-primary-10 text-white shadow-md hover:bg-primary-10/90"
                      : "bg-white border border-primary-10 text-primary-10 hover:bg-primary-10 hover:text-white"
                  }`}
                >
                  {page?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Pages */}
          {assignedPages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-neutral-20 mb-3">
                Selected Pages ({assignedPages.length})
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {assignedPages.map((pagePath) => {
                  const page = navItems.find((item) => item.path === pagePath);
                  return (
                    <div
                      key={pagePath}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-10/10 text-primary-10 rounded-full text-sm font-medium"
                    >
                      <span>{page?.label || pagePath}</span>
                      <button
                        type="button"
                        onClick={() => removePage(pagePath)}
                        className="hover:bg-primary-10/20 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-neutral-50">
            <Button
              label="Cancel"
              type="button"
              variant="secondary"
              className="py-1.75 w-full md:w-fit"
              onClick={() => {
                setIsAssignPageModalOpen(false);
                reset();
              }}
            />
            <Button
              type="submit"
              label="Save Changes"
              variant="primary"
              className="py-1.75 w-full md:w-fit"
              isLoading={isAssigningPage}
              isDisabled={isAssigningPage}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AssignPage;
