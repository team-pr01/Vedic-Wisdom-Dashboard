/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Category from "../../components/Shared/Category/Category";
import toast from "react-hot-toast";
import { Clock, Play } from "lucide-react";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import { useGetAllCategoriesByAreaNameQuery } from "../../redux/Features/Categories/categoriesApi";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "../../redux/Features/Course/courseApi";
import type { TCourse } from "../../types/course.types";
import AddOrEditCourse from "../../components/CoursePage/AddOrEditCourse/AddOrEditCourse";

const Course = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrEditCourseModalOpen, setIsAddOrEditCourseModalOpen] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllCoursesQuery({
    skip,
    limit,
    keyword,
    category,
  });

  const { data: categories } = useGetAllCategoriesByAreaNameQuery("Course");

  const [deleteCourse] = useDeleteCourseMutation();

  const handleDeleteCourse = async () => {
    try {
      await toast.promise(deleteCourse(courseId as string).unwrap(), {
        loading: "Loading...",
        success: "Course deleted successfully!",
        error: "Failed to delete course. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const courseTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "thumbnail", label: "Thumbnail" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "duration", label: "Duration" },
    { key: "viewCourse", label: "View Course" },
  ];

  const courses = data?.data?.courses || [];

  const courseTableData = courses?.map((course: TCourse, index: number) => ({
    _id: course._id,

    sl: index + 1,

    thumbnail: (
      <button type="button" onClick={() => setPreviewImage(course?.thumbnail as string)} className="size-12 rounded-lg overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
      </button>
    ),

    title: (
      <p className="font-medium text-neutral-10 font-Inter line-clamp-2 max-w-[250px]">
        {course.title}
      </p>
    ),

    category: (
      <span className="px-2 py-1 bg-primary-10/10 text-primary-10 text-xs font-medium rounded-full capitalize">
        {course.category}
      </span>
    ),

    duration: (
      <div className="flex items-center gap-1 text-sm text-neutral-45">
        <Clock size={14} />
        <span>{course.duration}</span>
      </div>
    ),

    viewCourse: (
      <a
        href={course.courseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-10 bg-primary-10/10 rounded-lg hover:bg-primary-10/20 transition-colors cursor-pointer"
      >
        <Play className="size-3.5" />
        View Course
      </a>
    ),
  }));

  const children = (
    <div className="flex items-center gap-3">
      <select
        value={category ?? ""}
        onChange={(e) => setCategory(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">Select Category </option>
        {categories?.data?.map((category: any) => (
          <option key={category?.category} value={category?.category}>
            {category?.category}
          </option>
        ))}
      </select>
      <Category areaName="Course" />
      <Button
        label="Add New Recipe"
        onClick={() => {
          setModalType("add");
          setIsAddOrEditCourseModalOpen(true);
        }}
        className="px-3 py-2"
      />
    </div>
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };

  return (
    <div>
      <Table<any>
        title={`All Courses (${courses?.length || 0})`}
        description="Manage all courses"
        theads={courseTheads}
        data={courseTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={limit}
        setLimit={setLimit}
        children={children}
        onEditItem={(row: any) => {
          setModalType("edit");
          setCourseId(row?._id);
          setIsAddOrEditCourseModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          setCourseId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isAddOrEditCourseModalOpen && (
        <AddOrEditCourse
          isAddOrEditCourseModalOpen={isAddOrEditCourseModalOpen}
          setIsAddOrEditCourseModalOpen={setIsAddOrEditCourseModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          courseId={courseId as string}
          categories={categories?.data || []}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteCourse}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-h-[90%] max-w-[90%] rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Course;
