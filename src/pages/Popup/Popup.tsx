import { useState } from "react";
import PopupCard from "../../components/PopupPage/PopupCard/PopupCard";
import Button from "../../components/Reusable/Button/Button";
import Loader from "../../components/Reusable/Loader/Loader";
import { useGetAllPopupsQuery } from "../../redux/Features/Popup/popupApi";
import type { TPopup } from "../../types/popup.types";
import AddOrEditPopup from "../../components/PopupPage/AddOrEditPopup/AddOrEditPopup";

const Popup = () => {
  const { data, isLoading } = useGetAllPopupsQuery({});
  const [selectedPopupId, setSelectedPopupId] = useState<string>("");
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrEditPopupModalOpen, setIsAddOrEditPopupModalOpen] =
    useState(false);
  return (
    <div>
      <div className="font-Inter text-neutral-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Popup Notifications</h2>
          <p className="text-sm mt-1">Manage all your popup notifications</p>
        </div>
        <Button
          label="Add Popup"
          onClick={() => {
            setModalType("add");
            setIsAddOrEditPopupModalOpen(true);
          }}
          type="button"
        />
      </div>

      {isLoading ? (
        <div className="mt-14">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 mt-8">
          {data?.data?.map((popup: TPopup) => (
            <PopupCard popup={popup} setModalType={setModalType} setIsAddOrEditPopupModalOpen={setIsAddOrEditPopupModalOpen} setSelectedPopupId={setSelectedPopupId} />
          ))}
        </div>
      )}

      {isAddOrEditPopupModalOpen && (
        <AddOrEditPopup
          isAddOrEditPopupModalOpen={isAddOrEditPopupModalOpen}
          setIsAddOrEditPopupModalOpen={setIsAddOrEditPopupModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          popupId={selectedPopupId as string}
        />
      )}
    </div>
  );
};

export default Popup;
