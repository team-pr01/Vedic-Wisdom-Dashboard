/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "../../Reusable/Modal/Modal";

type TAccountDeleteOrSuspensionReasonProps = {
  isDeleteOrSuspensionReasonModalOpen: boolean;
  setIsDeleteOrSuspensionReasonModalOpen: any;
  reason: string;
};

const AccountDeleteOrSuspensionReason: React.FC<
  TAccountDeleteOrSuspensionReasonProps
> = ({
  isDeleteOrSuspensionReasonModalOpen,
  setIsDeleteOrSuspensionReasonModalOpen,
  reason,
}) => {
  return (
    <Modal
      isModalOpen={isDeleteOrSuspensionReasonModalOpen}
      setIsModalOpen={setIsDeleteOrSuspensionReasonModalOpen}
      heading={"Reason"}
    >
      <div className="relative font-Inter pt-3">
        <p className="text-neutral-20">{reason || "Not Provided"}</p>
      </div>
    </Modal>
  );
};

export default AccountDeleteOrSuspensionReason;
