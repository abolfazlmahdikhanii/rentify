import CheckBox from "@/components/module/Form/CheckBox";
import Input from "@/components/module/Form/Input";
import Select from "@/components/module/Form/Select";
import MapSelect from "@/components/module/Map/MapSelect";
import Uploader from "@/components/module/Uploader/Uploader";
import Layout from "@/components/templates/RegisterStep/Layout";
import StepContent from "@/components/templates/RegisterStep/StepContent";
import StepDeal from "@/components/templates/RegisterStep/StepDeal";
import StepLocation from "@/components/templates/RegisterStep/StepLocation";
import StepDetails from "@/components/templates/RegisterStep/StepDetails";
import StepEquipment from "@/components/templates/RegisterStep/StepEquipment";
import StepMoreInfo from "@/components/templates/RegisterStep/StepMoreInfo";
import StepImages from "@/components/templates/RegisterStep/StepImages";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../../styles/RegisterStep.module.css";

import ModalMap from "@/components/templates/RegisterStep/ModalMap";
import useSWR from "swr";
import { toast } from "react-toastify";
import { toastOption } from "@/helper/helper";
import PrivateRoute from "@/components/module/PrivateRoute/PrivateRoute";
import Loader from "@/components/module/Loader/Loader";

const fetcher = () =>
  fetch("api/locations/provinces").then((res) => res.json());
const fetcherEquipment = () =>
  fetch("/api/properties/equipment").then((res) => res.json());

const formatCurrency = (value) =>
  value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const isNumber = (value) => /^[0-9]+$/.test(value.replace(/\D/g, ""));

const validationRules = {
  1: [
    { name: "houseType", required: true },
    { name: "contractType", required: true },
  ],
  2: [
    { name: "city", required: true },
    { name: "street", required: true },
    { name: "mainArea", required: true },
    { name: "exactAddress", required: true },
  ],
  3: [
    { name: "bedrooms", required: true },
    { name: "buildingAge", required: true },
    { name: "unitType", required: true },
    {
      name: "areaSize",
      required: true,
      validate: (value) => isNumber(value) || "متراژ باید عدد معتبر باشد",
    },
    { name: "location", required: true },
    { name: "floor", required: true },
    { name: "totalFloors", required: true },
    { name: "unitsPerFloor", required: true },
  ],
  4: [
    {
      name: "facilities",
      validate: (value) =>
        (Array.isArray(value) && value.length > 0) ||
        "حداقل یک مورد را انتخاب کنید",
    },
  ],
  5: [
    {
      name: "description",
      required: true,
      validate: (value) =>
        value?.length >= 10 || "توضیحات باید حداقل 10 کاراکتر باشد",
    },
  ],
  6: [
    {
      name: "images",
      required: true,
      validate: (value) =>
        (Array.isArray(value) && value.length > 0) ||
        "حداقل یک تصویر بارگذاری کنید",
    },
  ],
};

export default function RegisterStep() {
  const { data: cities, error } = useSWR("city", fetcher);
  const { data: equip, error: eqError } = useSWR("equip", fetcherEquipment);
  const {
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      houseType: "",
      contractType: "",
      sale: "",
      rahnPrice: "",
      ejarePrice: "",
      city: "",
      street: "",
      mainArea: "",
      exactAddress: "",
      bedrooms: "",
      buildingAge: "",
      unitType: "",
      areaSize: "",
      location: "",
      floor: "",
      totalFloors: "",
      unitsPerFloor: "",
      facilities: [],
      description: "",
      isRented: false,
      isReadyForVisit: false,
      images: [],
      cityName: "",
      position: "",
    },
    mode: "onBlur",
  });
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [position, setPosition] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (step !== 7) return;
    const timer = setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      reset();
    }, 8000);

    return () => clearTimeout(timer);
  }, [step, reset]);
  const validateStep = (stepNumber) => {
    clearErrors();
    let fields = validationRules[stepNumber] || [];
    let isValid = true;

    if (stepNumber === 1) {
      const contractType = watch("contractType");
      fields = [
        { name: "houseType", required: true },
        { name: "contractType", required: true },
      ];

      if (contractType === "sale") {
        fields.push({
          name: "sale",
          required: true,
          validate: (value) =>
            isNumber(value) || "مقدار قیمت فروش باید عدد معتبر باشد",
        });
      }

      if (contractType === "ejare") {
        fields.push({
          name: "ejarePrice",
          required: true,
          validate: (value) =>
            isNumber(value) || "مقدار اجاره باید عدد معتبر باشد",
        });
      }

      if (contractType === "rahn-ejare") {
        fields.push(
          {
            name: "rahnPrice",
            required: true,
            validate: (value) =>
              isNumber(value) || "مقدار رهن باید عدد معتبر باشد",
          },
          {
            name: "ejarePrice",
            required: true,
            validate: (value) =>
              isNumber(value) || "مقدار اجاره باید عدد معتبر باشد",
          },
        );
      }
    }

    fields.forEach(({ name, required, validate }) => {
      const value = watch(name);

      if (
        required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        setError(name, {
          type: "required",
          message: "لطفا فیلد مورد نظر را تکمیل کنید",
        });
        isValid = false;
        return;
      }

      if (validate) {
        const validationResult = validate(value);
        if (validationResult !== true) {
          setError(name, {
            type: "validate",
            message: validationResult || "مقدار وارد شده معتبر نیست",
          });
          isValid = false;
        }
      }
    });

    return isValid;
  };

  const nextStepHandler = (currentStep) => {
    if (validateStep(currentStep)) {
      setStep((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const addImage = (file) => {
    const current = watch("images") || [];
    setValue("images", [...current, file], { shouldValidate: true });
  };

  const handleEquipmentChange = (id, checked) => {
    const current = watch("facilities") || [];
    setValue(
      "facilities",
      checked ? [...current, id] : current.filter((item) => item !== id),
      { shouldValidate: true },
    );
  };

  const prevStepHandler = () => {
    setStep((prev) => Math.max(1, prev - 1));
    clearErrors();
  };
  const onSubmitFinalHandler = async (data) => {
    try {
      setIsLoading(true);
      // Transform data to match backend expectations

      const backendData = {
        houseType: data.houseType,
        title: data.title || fillTitle(),
        propertyType: data.houseType,
        listingType: data.contractType,
        salePrice: +data.sale.replace(/\D/g, ""),
        rahnPrice: +data.rahnPrice.replace(/\D/g, ""),
        ejare_price: +data.ejarePrice.replace(/\D/g, ""),
        location: `${data.city}-${data.mainArea}`,
        house_position: data.location,
        address: `${data.street}, ${data.mainArea}, ${data.cityName}`,
        full_address: data.exactAddress,
        street: data.street,
        mainArea: data.mainArea,
        city: data.city,
        description: data.description,
        bedrooms: parseInt(data.bedrooms, 10) || 0,
        building_area: data.areaSize
          ? parseInt(String(data.areaSize).replace(/\D/g, ""), 10)
          : undefined,
        floor_number: data.floor,
        floors: data.totalFloors,
        house_year: data.buildingAge,
        unitType: data.unitType,
        contractType: data.contractType,
        unitPerFloor: `${data.unitsPerFloor} واحد`,
        equipment: data.facilities || [],
        position: location,
        latitude: position?.[1],
        longitude: position?.[0],
      };

      const response = await fetch(`/api/properties/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create property");
      }

      if (result.success && data.images?.length > 0) {
        await uploadImages(data.images, result.propertyId);
      }

      setIsLoading(false);
      setIsSuccess(true);
      setStep((prev) => prev + 1);
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("ثبت آگهی با خطا مواجه شد ", toastOption);
      setIsSuccess(false);
      setIsLoading(false);
      // Show error to user
      // alert(`Error: ${error.message}`);
    }
  };

  // Enhanced image upload function
  const uploadImages = async (files, propertyId) => {
    try {
      if (!files || files.length === 0) {
        throw new Error("No files provided for upload");
      }

      const uploadResults = [];
      for (const file of files) {
        if (!(file instanceof File)) {
          console.warn("Skipping non-File object:", file);
          continue;
        }

        const formData = new FormData();
        formData.append("image", file);

        const url = new URL("/api/upload/post-images", window.location.origin);
        url.searchParams.append("imgType", "main");
        url.searchParams.append("id", propertyId);
        url.searchParams.append("cityName", watch("cityName"));

        const response = await fetch(url.toString(), {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Image upload failed");
        }

        const result = await response.json();
        uploadResults.push(result);
      }

      return uploadResults;
    } catch (error) {
      console.error("Image Upload Error:", error);
      throw error;
    }
  };
  const houseTypeToPersian = (type) => {
    if (type === "apartment") return "آپارتمان";
    else if (type === "house") return "خانه";
    else return "ویلا";
  };
  const fillTitle = () => {
    const title = `${houseTypeToPersian(watch("houseType"))} ${watch(
      "bedrooms",
    )} خوابه در ${watch("cityName")}`;
    return title;
  };
  return (
    <PrivateRoute role={["admin", "user"]}>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit(onSubmitFinalHandler)}>
        <Layout active={step}>
          {step === 1 && (
            <StepContent
              step={step}
              event={nextStepHandler}
              prevEvent={prevStepHandler}
            >
              <StepDeal
                watch={watch}
                setValue={setValue}
                errors={errors}
                nextStep={nextStepHandler}
              />
            </StepContent>
          )}
          {step === 2 && (
            <StepContent
              step={step}
              event={nextStepHandler}
              prevEvent={prevStepHandler}
            >
              <StepLocation
                cities={cities}
                watch={watch}
                setValue={setValue}
                errors={errors}
                isShowModal={isShowModal}
                setIsShowModal={setIsShowModal}
                position={position}
                setPosition={setPosition}
              />
            </StepContent>
          )}
          {step === 3 && (
            <StepContent
              step={step}
              isDisable={
                !watch("bedrooms") &&
                !watch("buildingAge") &&
                !watch("areaSize") &&
                !watch("floor")
              }
              event={nextStepHandler}
              prevEvent={prevStepHandler}
            >
              <StepDetails watch={watch} setValue={setValue} errors={errors} />
            </StepContent>
          )}
          {step === 4 && (
            <StepContent
              title="تجهیزات و امکانات"
              step={step}
              event={nextStepHandler}
              prevEvent={prevStepHandler}
            >
              <StepEquipment
                equip={equip}
                watch={watch}
                errors={errors}
                onChange={handleEquipmentChange}
              />
            </StepContent>
          )}
          {step === 5 && (
            <StepContent
              title="توضیحات تکمیلی"
              step={step}
              event={nextStepHandler}
              prevEvent={prevStepHandler}
            >
              <StepMoreInfo
                watch={watch}
                setValue={setValue}
                errors={errors}
                fillTitle={fillTitle}
              />
            </StepContent>
          )}
          {step === 6 && (
            <StepContent
              title="عکس‌ها و ویدیو ملک خود را بارگذاری کنید"
              step={step}
              isLoading={isLoading}
              onSubmit={onSubmitFinalHandler}
              prevEvent={prevStepHandler}
              isDisable={!watch("images")?.length}
            >
              <StepImages addImage={addImage} errors={errors} />
            </StepContent>
          )}

          {step === 7 && isSuccess && (
            <div className={styles.formSection}>
              <div className={"sucessContainer"}>
                {/* <DotLottieReact
                src="/images/successMessage.json"
                loop
                autoplay
                className="sucessAnimate"
                style={{ width: 200, height: 200 }}
              /> */}
                <p>آگهی شما با موفقیت ثبت شد</p>
              </div>
            </div>
          )}
        </Layout>
      </form>
    </PrivateRoute>
  );
}
