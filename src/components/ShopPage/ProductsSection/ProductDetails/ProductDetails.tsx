/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSingleProductByIdQuery } from "../../../../redux/Features/Shop/productsApi";
import Loader from "../../../Reusable/Loader/Loader";
import Modal from "../../../Reusable/Modal/Modal";
import Button from "../../../Reusable/Button/Button";
import { useState } from "react";
import {
  Star,
  Eye,
  ShoppingBag,
  Tag,
  User,
  Calendar,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  MousePointer,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../../../../utils/formatDate";

type TProductDetailsProps = {
  isProductDetailsModalOpen: boolean;
  setIsProductDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productId: string;
};

const ProductDetails: React.FC<TProductDetailsProps> = ({
  isProductDetailsModalOpen,
  setIsProductDetailsModalOpen,
  productId,
}) => {
  const { data, isLoading } = useGetSingleProductByIdQuery(productId);
  const productDetails = data?.data || {};
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      // Add your approve API call here
      // await approveProduct(productId).unwrap();
      toast.success("Product approved successfully");
      setIsProductDetailsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve product");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      // Add your reject API call here
      // await rejectProduct(productId).unwrap();
      toast.success("Product rejected successfully");
      setIsProductDetailsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject product");
    } finally {
      setIsRejecting(false);
    }
  };

  const nextImage = () => {
    if (productDetails.imageUrls?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === productDetails.imageUrls.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (productDetails.imageUrls?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? productDetails.imageUrls.length - 1 : prev - 1,
      );
    }
  };

  return (
    <Modal
      isModalOpen={isProductDetailsModalOpen}
      setIsModalOpen={setIsProductDetailsModalOpen}
      heading="Product Details"
    >
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50 rounded-lg">
            <Loader size="lg" text="Loading product details..." />
          </div>
        )}

        <div>
          {/* Image Gallery */}
          {productDetails.imageUrls && productDetails.imageUrls.length > 0 ? (
            <div className="mb-6">
              <div className="relative h-80 rounded-xl overflow-hidden bg-neutral-100">
                <img
                  src={productDetails.imageUrls[currentImageIndex]}
                  alt={productDetails.name}
                  className="w-full h-full object-contain"
                />

                {productDetails.imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                    >
                      <ChevronLeft size={20} className="text-neutral-20" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                    >
                      <ChevronRight size={20} className="text-neutral-20" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {productDetails.imageUrls.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {productDetails.imageUrls.map((url: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        currentImageIndex === idx
                          ? "border-primary-10"
                          : "border-transparent hover:border-neutral-50"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 h-64 bg-neutral-100 rounded-xl flex items-center justify-center">
              <ImageIcon size={48} className="text-neutral-45" />
            </div>
          )}

          {/* Product Title */}
          <h2 className="text-2xl font-bold text-neutral-10 font-Inter mb-2">
            {productDetails.name}
          </h2>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 bg-primary-10/10 text-primary-10 text-sm font-medium rounded-full">
              <Tag size={14} className="mr-1" />
              {productDetails.category}
            </span>
          </div>

          {/* Price Section */}
          <div className="bg-linear-to-r from-primary-10/5 to-transparent rounded-lg p-4 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary-10">
                {productDetails.priceCurrency}{" "}
                {productDetails.discountedPrice || productDetails.basePrice}
              </span>
              {productDetails.discountedPrice && (
                <span className="text-lg text-neutral-45 line-through">
                  {productDetails.priceCurrency} {productDetails.basePrice}
                </span>
              )}
            </div>
            {productDetails.discountedPrice && (
              <p className="text-sm text-green-600 mt-1">
                Save {productDetails.priceCurrency}{" "}
                {(
                  productDetails.basePrice - productDetails.discountedPrice
                ).toFixed(2)}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-primary-10 rounded-lg p-3 text-center">
              <Star size={20} className="text-yellow-500 mx-auto mb-1" />
              <p className="text-sm text-neutral-45">Rating</p>
              <span className="text-sm font-medium text-neutral-10">
                {productDetails.rating?.toFixed(1) || "—"}
              </span>
            </div>

            <div className="bg-white border border-primary-10 rounded-lg p-3 text-center">
              <ShoppingBag size={20} className="text-primary-10 mx-auto mb-1" />
              <p className="text-sm text-neutral-45">Sold</p>
              <p className="text-lg font-semibold text-neutral-10">
                {productDetails.soldCount?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-white border border-primary-10 rounded-lg p-3 text-center">
              <Eye size={20} className="text-blue-500 mx-auto mb-1" />
              <p className="text-sm text-neutral-45">Views</p>
              <p className="text-lg font-semibold text-neutral-10">
                {productDetails.totalClicks?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-white border border-primary-10 rounded-lg p-3 text-center">
              <MousePointer size={20} className="text-green-500 mx-auto mb-1" />
              <p className="text-sm text-neutral-45">Clicks</p>
              <p className="text-lg font-semibold text-neutral-10">
                {productDetails.totalClicks}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-10 mb-2 font-Inter">
              Description
            </h3>
            <p className="text-neutral-20 font-Roboto leading-relaxed whitespace-pre-wrap">
              {productDetails.description || "No description provided"}
            </p>
          </div>

          {/* Additional Info */}
          <div className="border-t border-neutral-50 pt-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User size={14} className="text-neutral-45" />
                <span className="text-neutral-45">Added by:</span>
                <span className="text-neutral-10 font-medium">
                  {productDetails.addedBy?.role === "admin"
                    ? "Admin"
                    : productDetails.addedBy?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-neutral-45" />
                <span className="text-neutral-45">Added on:</span>
                <span className="text-neutral-10">
                  {formatDate(productDetails.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Approve/Reject Buttons for User Role */}
          {productDetails.addedBy?.role === "user" && (
            <div className="border-t border-neutral-50 pt-4 flex gap-3">
              <Button
                label="Approve Product"
                variant="primary"
                onClick={handleApprove}
                isLoading={isApproving}
                isDisabled={isApproving || isRejecting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              />
              <Button
                label="Reject Product"
                variant="secondary"
                onClick={handleReject}
                isLoading={isRejecting}
                isDisabled={isApproving || isRejecting}
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetails;
