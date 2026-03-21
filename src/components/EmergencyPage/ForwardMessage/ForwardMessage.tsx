/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForwardMessageToOthersMutation } from "../../../redux/Features/Emergency/emergencyApi";
import { useGetAllUsersQuery } from "../../../redux/Features/User/userApi";
import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import { bangladeshDistricts, countries } from "../../../constants/filterData";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";

type TForwardMessageProps = {
  isForwardMessageModalOpen: boolean;
  setIsForwardMessageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  emergencyId: string;
};
const ForwardMessage: React.FC<TForwardMessageProps> = ({
  isForwardMessageModalOpen,
  setIsForwardMessageModalOpen,
  emergencyId,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    city: selectedDistrict,
    country: selectedCountry,
  });
  const users = data?.data?.data || [];
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const isAllSelected = selectedUserIds?.length === users?.length;
  const [forwardMessageToOthers, { isLoading: isForwarding }] =
    useForwardMessageToOthersMutation();

  const handleForwardMessageToOthers = async () => {
    try {
      const payload = {
        userIds: selectedUserIds,
        emergencyMessageId: emergencyId,
      };

      await forwardMessageToOthers(payload).unwrap();
      setIsForwardMessageModalOpen(false);
    } catch (err: any) {
      console.log("object", err);
    }
  };

  const targetedCountries = countries?.map((country) => ({
    label: country,
    value: country,
  }));

  const bangladeshDistrictsOptions = bangladeshDistricts.map((district) => ({
    label: district,
    value: district,
  }));

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCountry(value);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDistrict(value);
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      const allIds = users?.map((user: any) => user._id) || [];
      setSelectedUserIds(allIds);
    }
  };

  const toggleSelectUser = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds((prev) => prev.filter((_id) => _id !== id));
    } else {
      setSelectedUserIds((prev) => [...prev, id]);
    }
  };

  return (
    <Modal
      isModalOpen={isForwardMessageModalOpen}
      setIsModalOpen={setIsForwardMessageModalOpen}
      heading={`Forward Message`}
    >
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <div className="flex flex-col gap-6 mb-6">
          {/* Targeted Country */}
          <SelectDropdown
            label="Targeted Country"
            value={selectedCountry}
            onChange={handleCountryChange}
            options={targetedCountries}
          />

          <SelectDropdown
            label="Targeted City"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            options={
              selectedCountry === "Bangladesh" ? bangladeshDistrictsOptions : []
            }
            isDisabled={!selectedCountry}
            isRequired={false}
          />
        </div>

        {/* User table */}
        <div className="mb-6">
          <p className="font-medium text-gray-700 dark:text-white mb-2">
            Targeted Audience <span className="text-red-600"> *</span>
          </p>

          <div className="mt-4 overflow-x-auto bg-white border border-neutral-55 rounded-xl shadow-sm p-3 font-Inter">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="font-semibold">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-sm text-gray-700 dark:text-white">
                    User ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm text-gray-700 dark:text-white">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm text-gray-700 dark:text-white">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-sm text-gray-700 dark:text-white">
                    Phone Number
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900">
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center">
                      <Loader />
                    </td>
                  </tr>
                ) : users?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-gray-500 dark:text-gray-300"
                    >
                      No user found
                    </td>
                  </tr>
                ) : (
                  users?.map((user: any) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-300 dark:border-gray-700"
                    >
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user._id)}
                          onChange={() => toggleSelectUser(user._id)}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                        {user.userId}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
                        {user?.city || user?.state || user?.country ? (
                          <span>
                            {[user.city, user.state, user.country]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100 flex gap-1">
                        <span>{user.countryCode || "N/A"}</span>{" "}
                        <span>{user.phoneNumber}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            label={"Cancel"}
            type="button"
            variant="secondary"
            className="py-1.75 w-full md:w-fit"
            onClick={() => {
              setIsForwardMessageModalOpen(false);
            }}
          />
          <Button
            type="submit"
            label={"Forward"}
            variant="primary"
            className="py-1.75 w-full md:w-fit"
            isLoading={isForwarding}
            isDisabled={isForwarding}
            onClick={handleForwardMessageToOthers}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ForwardMessage;
