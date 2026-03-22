/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useGetAllProductsOfAVendorQuery } from "../../redux/Features/Shop/vendorApi";
import { useGetAllCategoriesByAreaNameQuery } from "../../redux/Features/Categories/categoriesApi";
import { useDeleteProductMutation } from "../../redux/Features/Shop/productsApi";
import toast from "react-hot-toast";
import type { TProduct } from "../../types/product.types";
import Table from "../../components/Reusable/Table/Table";
import ProductDetails from "../../components/ShopPage/ProductsSection/ProductDetails/ProductDetails";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const VendorsProducts = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllProductsOfAVendorQuery({
    vendorId: id,
    skip,
    limit,
    keyword,
    category,
  });

  const { data: categories } = useGetAllCategoriesByAreaNameQuery("Product");

  const [deleteProduct] = useDeleteProductMutation();

  const handleDeleteProduct = async () => {
    try {
      await toast.promise(deleteProduct(productId as string).unwrap(), {
        loading: "Loading...",
        success: "Product deleted successfully!",
        error: "Failed to delete product. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const productTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "rating", label: "Rating" },
    { key: "soldCount", label: "Sold" },
    { key: "totalClicks", label: "Clicks" },
    { key: "actions", label: "Actions" },
  ];

  const products = data?.data?.data || [];

  const productTableData = products?.map((item: TProduct, index: number) => ({
    _id: item._id,

    sl: index + 1,

    image: (
      <img
        src={item?.imageUrls?.[0] || "/placeholder-image.jpg"}
        alt={item.name}
        className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setPreviewImage(item?.imageUrls?.[0])}
      />
    ),

    name: (
      <p className="font-medium text-neutral-10 font-Inter line-clamp-2 max-w-[200px]">
        {item.name}
      </p>
    ),

    category: (
      <span className="px-2.5 py-1 bg-primary-10/10 text-primary-10 text-xs font-medium rounded-full capitalize">
        {item.category}
      </span>
    ),

    price: (
      <div className="flex flex-col">
        {item.discountedPrice ? (
          <>
            <span className="text-sm font-semibold text-green-600">
              {item.priceCurrency} {item.discountedPrice}
            </span>
            <span className="text-xs text-neutral-45 line-through">
              {item.priceCurrency} {item.basePrice}
            </span>
          </>
        ) : (
          <span className="text-sm font-semibold text-neutral-10">
            {item.priceCurrency} {item.basePrice}
          </span>
        )}
      </div>
    ),

    rating: (
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-yellow-500">★</span>
        <span className="text-sm text-neutral-10">
          {item.rating?.toFixed(1) || "—"}
        </span>
      </div>
    ),

    soldCount: (
      <span className="text-sm text-neutral-45">
        {item.soldCount?.toLocaleString() || 0}
      </span>
    ),

    totalClicks: (
      <span className="text-sm text-neutral-45">
        {item.totalClicks?.toLocaleString() || 0}
      </span>
    ),

    actions: (
      <button
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-10 bg-primary-10/10 rounded-lg hover:bg-primary-10/20 transition-colors cursor-pointer"
        onClick={() => {
          setProductId(item._id);
          setIsProductDetailsModalOpen(true);
        }}
      >
        <Eye size={14} />
        View Details
      </button>
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
    </div>
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-20 hover:text-white hover:bg-primary-10 rounded-lg transition-colors mb-3"
        title="Go back"
      >
        <ArrowLeft size={18} />
        Back
      </button>
      <Table<any>
        title={`Products (${products?.length || 0})`}
        description="Manage all your products here. You can add, edit, and delete products from this page."
        theads={productTheads}
        data={productTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={10}
        setLimit={setLimit}
        children={children}
        onDeleteItem={(row: any) => {
          setProductId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

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

      {isProductDetailsModalOpen && (
        <ProductDetails
          isProductDetailsModalOpen={isProductDetailsModalOpen}
          setIsProductDetailsModalOpen={setIsProductDetailsModalOpen}
          productId={productId as string}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default VendorsProducts;
