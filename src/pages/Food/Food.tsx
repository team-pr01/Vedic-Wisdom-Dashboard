/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Category from "../../components/Shared/Category/Category";
import {
  useDeleteRecipeMutation,
  useGetAllRecipesQuery,
} from "../../redux/Features/Food/foodApi";
import toast from "react-hot-toast";
import type { TFood } from "../../types/food.interface";
import { Pencil, Play, Trash2 } from "lucide-react";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import { useGetAllCategoriesByAreaNameQuery } from "../../redux/Features/Categories/categoriesApi";

const Food = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrEditRecipeModalOpen, setIsAddOrEditRecipeModalOpen] =
    useState<boolean>(false);
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllRecipesQuery({
    skip,
    limit,
    keyword,
    category,
  });

  const { data: categories } = useGetAllCategoriesByAreaNameQuery("Food");

  const [deleteAudioBook] = useDeleteRecipeMutation();

  const handleDeleteAudioBook = async (id: string) => {
    try {
      await toast.promise(deleteAudioBook(id).unwrap(), {
        loading: "Loading...",
        success: "Recipe deleted successfully!",
        error: "Failed to delete recipe. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  const foodTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "videoSource", label: "Video Source" },
    { key: "duration", label: "Duration" },
    { key: "viewVideo", label: "ViewV ideo" },
  ];

  const food = data?.data?.foods || [];

  console.log(data);

  const foodTableData = food?.map((recipe: TFood, index: number) => ({
    _id: recipe._id,

    sl: index + 1,

    title: <p className="font-medium">{recipe.title}</p>,
    category: recipe?.category,
    videoSource: (
      <p
        className={`font-medium capitalize ${recipe?.videoSource === "youtube" ? "text-red-500" : "text-blue-500"}`}
      >
        {recipe.videoSource}
      </p>
    ),
    duration: recipe?.duration,

    viewVideo: (
      <a
        href={recipe?.videoUrl}
        target="_blank"
        className="flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer"
      >
        <Play className="size-4" />
        View Video
      </a>
    ),
  }));

  const foodActions: any[] = [
    {
      label: "Edit",
      icon: <Pencil className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        setModalType("update");
        setIsAddAudioBookModalOpen(true);
        setAudioBookId(row?._id);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        handleDeleteAudioBook(row._id);
      },
    },
  ];

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
      <Category areaName="Food" />
      <Button
        label="Add New Recipe"
        onClick={() => {
          setModalType("add");
          setIsAddOrEditRecipeModalOpen(true);
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
        title={`Food & Recipes (${food?.length || 0})`}
        description="Manage all recipes"
        theads={foodTheads}
        data={foodTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        actions={foodActions}
        limit={10}
        setLimit={setLimit}
        children={children}
      />
    </div>
  );
};

export default Food;
