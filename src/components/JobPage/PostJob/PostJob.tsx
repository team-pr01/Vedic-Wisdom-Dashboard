/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
import { useForm } from "react-hook-form";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import { Country, State, City } from "country-state-city";
import { useEffect, useState } from "react";
import Button from "../../Reusable/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleJobByIdQuery,
  usePostJobMutation,
  useUpdateJobMutation,
} from "../../../redux/Features/Job/jobApi";
import toast from "react-hot-toast";
import {
  experienceLevelOptions,
  hiringTypes,
  jobTypeOptions,
  salaryTypeOptions,
  workModeOptions,
} from "../../../constants/jobFilters";
import Loader from "../../Reusable/Loader/Loader";

const PostJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const { data, isLoading: isSingleJobDataLoading } =
    useGetSingleJobByIdQuery(jobId);

  useEffect(() => {
    const singleJobData = data?.data || {};
    console.log(singleJobData);
    if (jobId) {
      setValue("title", singleJobData?.title);
      setValue("experienceLevel", singleJobData?.experienceLevel);
      setValue("description", singleJobData?.description);
      setValue("jobType", singleJobData?.jobType);
      setValue("workMode", singleJobData?.workMode);
      setValue("hiringType", singleJobData?.hiringType);

      // If hiring type is company
      if (singleJobData?.hiringType === "company") {
        const company = singleJobData.company;

        setValue("companyName", company?.name);
        setValue("companyDescription", company?.description);
        setValue("companyWebsite", company?.website);

        // Location
        setValue("companyCity", company?.location?.city);
        setValue("companyState", company?.location?.state);
        setValue("companyCountry", company?.location?.country);

        // Contact
        setValue("companyPhoneNumber", company?.phoneNumber);
        setValue("companyEmail", company?.email);

        // Social Media
        setValue("facebook", company?.socialMedia?.facebook);
        setValue("instagram", company?.socialMedia?.instagram);
        setValue("linkedin", company?.socialMedia?.linkedin);
      }
      // If hiring type is individual
      if (singleJobData?.hiringType === "individual") {
        const individual = singleJobData.individual;

        setValue("individualFullName", individual?.fullName);
        setValue("individualPhoneNumber", individual?.phoneNumber);
        setValue("individualEmail", individual?.email);
        setValue("individualAddress", individual?.address);
        setValue("individualIdentityNumber", individual?.identityNumber);
      }

      setValue("salaryType", singleJobData?.salary?.type || "");
      setValue("currency", singleJobData?.salary?.currency);
      setValue("minimum", singleJobData?.salary?.minimum);
      setValue("maximum", singleJobData?.salary?.maximum);
      setValue("city", singleJobData?.location?.city);
      setValue("state", singleJobData?.location?.state);
      setValue("country", singleJobData?.location?.country);
      setValue("requiredSkills", singleJobData?.requiredSkills);
      setValue("responsibilities", singleJobData?.responsibilities);
      setValue("applicationDeadline", singleJobData?.applicationDeadline);
      setValue("vacancy", singleJobData?.vacancy);

      setSelectedCountry(singleJobData?.location?.country);
      setSelectedState(singleJobData?.location?.state);
    }
  }, [jobId, setValue, data]);

  const hiringType = watch("hiringType");
  const salaryType = watch("salaryType");

  // Country options
  const countryOptions = Country.getAllCountries().map((c: any) => ({
    label: c.name,
    value: c.isoCode,
  }));

  // State options (based on selected country)
  const stateOptions = State.getStatesOfCountry(selectedCountry).map((s) => ({
    label: s.name,
    value: s.isoCode,
  }));

  // City options (based on selected state)
  const cityOptions = City.getCitiesOfState(selectedCountry, selectedState).map(
    (c: any) => ({
      label: c.name,
      value: c.name,
    }),
  );

  const responsibilities = watch("responsibilities") || [];
  const requiredSkills = watch("requiredSkills") || [];
  const [input, setInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const handleAddTag = (value: string) => {
    const trimmed = value.trim();

    if (trimmed && !responsibilities.includes(trimmed)) {
      setValue("responsibilities", [...responsibilities, trimmed]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "responsibilities",
      responsibilities.filter((tag: string) => tag !== tagToRemove),
    );
  };

  const handleAddSkill = (value: string) => {
    const trimmed = value.trim();

    if (trimmed && !requiredSkills.includes(trimmed)) {
      setValue("requiredSkills", [...requiredSkills, trimmed]);
    }
  };

  const handleRemoveSkill = (tagToRemove: string) => {
    setValue(
      "requiredSkills",
      requiredSkills.filter((tag: string) => tag !== tagToRemove),
    );
  };

  const [postJob, { isLoading }] = usePostJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  // Function to post or update job
  const handleSubmitJob = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("experienceLevel", data.experienceLevel);
      formData.append("description", data.description);
      formData.append("jobType", data.jobType);
      formData.append("workMode", data.workMode);
      formData.append("hiringType", data.hiringType);
      formData.append("salary[type]", data.salaryType);
      formData.append("salary[currency]", data.currency);
      if (data.minimum !== undefined && data.minimum !== null) {
        formData.append("salary[minimum]", String(data.minimum));
      }

      if (data.maximum !== undefined && data.maximum !== null) {
        formData.append("salary[maximum]", String(data.maximum));
      }
      formData.append("location[city]", data.city);
      formData.append("location[state]", data.state);
      formData.append("location[country]", data.country);
      formData.append("requiredSkills", data.requiredSkills);
      formData.append("responsibilities", data.responsibilities);
      formData.append("applicationDeadline", data.applicationDeadline);
      formData.append("vacancy", data.vacancy);

      // For company
      formData.append("company[name]", data.companyName);
      formData.append("company[description]", data.companyDescription);
      formData.append("company[location][city]", data.companyCity);
      formData.append("company[location][state]", data.companyState);
      formData.append("company[location][country]", data.companyCountry);
      formData.append("company[phoneNumber]", data.companyPhoneNumber);
      formData.append("company[email]", data.companyEmail);
      formData.append("company[website]", data.companyWebsite);
      formData.append("company[socialMedia][facebook]", data.facebook);
      formData.append("company[socialMedia][instagram]", data.instagram);
      formData.append("company[socialMedia][linkedin]", data.linkedin);

      // For individual
      formData.append("individual[fullName]", data.individualFullName);
      formData.append("individual[phoneNumber]", data.individualPhoneNumber);
      formData.append("individual[email]", data.individualEmail);
      formData.append("individual[address]", data.individualAddress);
      formData.append(
        "individual[identityNumber]",
        data.individualIdentityNumber,
      );

      let response;
      if (jobId) {
        response = await updateJob({ id: jobId, data: formData }).unwrap();
      } else {
        response = await postJob(formData).unwrap();
      }
      if (response?.success) {
        toast.success(response?.message);
        navigate("/dashboard/job");
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className="max-w-175 mx-auto h-auto bg-white border border-primary-10/40 p-6 rounded-xl">
      {isSingleJobDataLoading && <Loader />}
      <form onSubmit={handleSubmit(handleSubmitJob)}>
        {/* Hiring Type */}
        <SelectDropdown
          label="Hiring Type"
          options={hiringTypes}
          error={errors.hiringType}
          {...register("hiringType")}
        />

        {hiringType === "company" && (
          <div className="space-y-4 mt-5">
            {/* Organization Name */}
            <TextInput
              label="Company Name"
              placeholder="Enter company name"
              error={errors.companyName}
              {...register("companyName", {
                required: "Company name is required",
              })}
            />

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput
                label="City"
                placeholder="Enter city"
                error={errors.companyCity}
                {...register("companyCity", { required: "City is required" })}
              />

              <TextInput
                label="State"
                placeholder="Enter state"
                error={errors.companyState}
                {...register("companyState", { required: "State is required" })}
              />

              <TextInput
                label="Country"
                placeholder="Enter country"
                error={errors.companyCountry}
                {...register("companyCountry", {
                  required: "Country is required",
                })}
              />
            </div>

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Write brief about what your company does"
              error={errors.companyDescription}
              {...register("companyDescription")}
              isRequired={false}
            />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                error={errors.companyPhoneNumber}
                {...register("companyPhoneNumber", {
                  required: "Phone number is required",
                })}
              />

              <TextInput
                label="Email"
                type="email"
                placeholder="Enter email address"
                error={errors.companyEmail}
                {...register("companyEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>

            {/* Website */}
            <TextInput
              label="Website"
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              error={errors.companyWebsite}
              {...register("companyWebsite")}
              isRequired={false}
            />

            {/* Social Media Links */}
            <div className="border border-neutral-50 rounded-lg p-4 mt-2">
              <h3 className="text-md font-semibold text-neutral-10 mb-3 font-Inter">
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput
                  label="Facebook"
                  type="url"
                  placeholder="https://facebook.com/username"
                  error={errors.facebook}
                  {...register("facebook")}
                  isRequired={false}
                />

                <TextInput
                  label="Instagram"
                  type="url"
                  placeholder="https://instagram.com/username"
                  error={errors.instagram}
                  {...register("instagram")}
                  isRequired={false}
                />

                <TextInput
                  label="LinkedIn"
                  type="url"
                  placeholder="https://linkedin.com/company/username"
                  error={errors.linkedin}
                  {...register("linkedin")}
                  isRequired={false}
                />
              </div>
            </div>
          </div>
        )}

        {hiringType === "individual" && (
          <div className="space-y-4 mt-5">
            {/* Full Name */}
            <TextInput
              label="Full Name"
              placeholder="Enter full name"
              error={errors.individualFullName}
              {...register("individualFullName", {
                required: "Full name is required",
              })}
            />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                error={errors.individualPhoneNumber}
                {...register("individualPhoneNumber", {
                  required: "Phone number is required",
                })}
              />

              <TextInput
                label="Email"
                type="email"
                placeholder="Enter email address"
                error={errors.individualEmail}
                {...register("individualEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>

            {/* Address */}
            <TextInput
              label="Address"
              placeholder="Enter address"
              error={errors.individualAddress}
              {...register("individualAddress", {
                required: "Address is required",
              })}
            />

            {/* Identity Number */}
            <TextInput
              label="Identity Number"
              placeholder="Enter identity number (NID/Passport/Driving License)"
              error={errors.individualIdentityNumber}
              {...register("individualIdentityNumber")}
              isRequired={false}
            />
          </div>
        )}

        <div className="space-y-4 mt-5">
          {/* Job Title and Experience Level */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Job Title"
              placeholder="Enter job title"
              error={errors.title}
              {...register("title", {
                required: "Job Title is required",
              })}
            />
            <SelectDropdown
              label="Experience Level"
              options={experienceLevelOptions}
              error={errors.experienceLevel}
              {...register("experienceLevel", {
                required: "Experience level is required",
              })}
            />
          </div>

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Write brief about what you are looking for"
            error={errors.description}
            {...register("description")}
            isRequired={false}
          />

          {/* Job Type and Work Mode */}
          <div className="grid grid-cols-2 gap-4">
            <SelectDropdown
              label="Job Type"
              options={jobTypeOptions}
              error={errors.jobType}
              {...register("jobType")}
            />

            <SelectDropdown
              label="Work Mode"
              options={workModeOptions}
              error={errors.workMode}
              {...register("workMode")}
            />
          </div>

          {/* Salary Type */}
          <div className="grid grid-cols-4 gap-4">
            <SelectDropdown
              label="Salary Type"
              options={salaryTypeOptions}
              error={errors.salaryType}
              {...register("salaryType")}
            />
            {salaryType === "paid" && (
              <>
                <TextInput
                  label="Currency"
                  placeholder="Currency e.g., USD, INR, BDT"
                  error={errors.currency}
                  {...register("currency", {
                    required: "Currency is required",
                  })}
                />
                <TextInput
                  label="Minimum"
                  placeholder="Minimum salary"
                  error={errors.minimum}
                  {...register("minimum", {
                    required: "Minimum Salary is required",
                  })}
                />
                <TextInput
                  label="Maximum"
                  placeholder="Maximum salary"
                  error={errors.maximum}
                  {...register("maximum", {
                    required: "Maximum Salary is required",
                  })}
                />
              </>
            )}
          </div>

          {/* Country, State, and City */}
          <div className="grid grid-cols-3 gap-4">
            <SelectDropdown
              label="Country"
              options={countryOptions}
              error={errors.country}
              {...register("country")}
              value={selectedCountry}
              onChange={(e: any) => {
                const value = e.target.value;
                console.log(value);

                setSelectedCountry(value);
                setSelectedState("");
              }}
            />

            <SelectDropdown
              label="State"
              options={stateOptions}
              error={errors.state}
              value={selectedState}
              {...register("state")}
              onChange={(e: any) => {
                const value = e.target.value;
                setSelectedState(value);
              }}
            />

            <SelectDropdown
              label="City"
              options={cityOptions}
              error={errors.city}
              {...register("city")}
            />
          </div>

          {/* Responsibilities */}
          <div>
            <TextInput
              label="Responsibilities"
              name="responsibilities"
              placeholder="Press enter to add new"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag(input);
                  setInput("");
                }
              }}
              error={errors.responsibilities?.message as any}
            />

            <div className="flex flex-col gap-2 mt-2">
              {responsibilities.map((tag: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center text-neutral-5 px-2 py-1 w-fit"
                >
                  <span>
                    {index + 1}. {tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <TextInput
              label="Required Skills"
              name="requiredSkills"
              placeholder="Press enter to add new"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill(skillInput);
                  setSkillInput("");
                }
              }}
              error={errors.requiredSkills?.message as any}
            />

            <div className="flex flex-col gap-2 mt-2">
              {requiredSkills.map((tag: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center text-neutral-5 px-2 py-1 w-fit"
                >
                  <span>
                    {index + 1}. {tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(tag)}
                    className="ml-1 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Deadline and vacancy */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              type="date"
              label="Application Deadline"
              error={errors.applicationDeadline}
              {...register("applicationDeadline", {
                required: "Application deadline is required",
              })}
            />
            <TextInput
              type="number"
              label="Vacancy"
              placeholder="Enter number of vacancies"
              error={errors.vacancy}
              {...register("vacancy", {
                required: "Vacancy is required",
                min: { value: 1, message: "Vacancy must be at least 1" },
              })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 justify-end mt-5">
          <Button
            label={"Cancel"}
            type="button"
            variant="secondary"
            className="py-1.75 w-full md:w-fit"
            onClick={() => {
              navigate(-1);
            }}
          />
          <Button
            type="submit"
            label={"Submit"}
            variant="primary"
            className="py-1.75 w-full md:w-fit"
            isLoading={isLoading || isUpdating}
            isDisabled={isLoading || isUpdating}
          />
        </div>
      </form>
    </div>
  );
};

export default PostJob;
