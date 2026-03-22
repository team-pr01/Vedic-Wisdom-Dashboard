/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "../../Reusable/Modal/Modal";

type TReferralListProps = {
  isAccountDeleteReasonModalOpen: boolean;
  setIsAccountDeleteReasonModalOpen: any;
  reason: string;
};

const AccountDeleteReason: React.FC<TReferralListProps> = ({
  isAccountDeleteReasonModalOpen,
  setIsAccountDeleteReasonModalOpen,
  reason,
}) => {
  return (
    <Modal
      isModalOpen={isAccountDeleteReasonModalOpen}
      setIsModalOpen={setIsAccountDeleteReasonModalOpen}
      heading={"Account Deletion Reason"}
    >
      <div className="relative font-Inter pt-3">
        <p className="text-neutral-20">{reason || "Not Provided"}</p>
      </div>
    </Modal>
  );
};

export default AccountDeleteReason;
