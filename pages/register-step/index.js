import CheckBox from "@/components/module/Form/CheckBox";
import Input from "@/components/module/Form/Input";
import Select from "@/components/module/Form/Select";
import MapSelect from "@/components/module/Map/MapSelect";
import Uploader from "@/components/module/Uploader/Uploader";
import Layout from "@/components/templates/RegisterStep/Layout";
import StepContent from "@/components/templates/RegisterStep/StepContent";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../../styles/RegisterStep.module.css";

import ModalMap from "@/components/templates/RegisterStep/ModalMap";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { toast } from "react-toastify";
import { toastOption } from "@/helper/helper";
import PrivateRoute from "@/components/module/PrivateRoute/PrivateRoute";

const fetcher = () =>
  fetch("https://iranplacesapi.liara.run/api/provinces").then((res) =>
    res.json()
  );
const fetcherEquipment = () =>
  fetch("http://localhost:5000/api/properties/equipment").then((res) =>
    res.json()
  );

export default function RegisterStep() {
  const { data: city, error } = useSWR("city", fetcher);
  const { data: equip, error: eqError } = useSWR("equip", fetcherEquipment);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setError,
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      houseType: "",
      contractType: "",
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
    },
    mode: "onBlur",
  });
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(true);
  const [isDisable, setIsDisable] = useState(false);
  const [position, setPosition] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  useEffect(() => {
    if (step === 7) {
      setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
        reset();
      }, 8000);
    }
  });
  const checkValidate = (fields) => {
    let isValid = true;
    clearErrors();

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
      }

      if (validate && value) {
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
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = checkValidate([
          { name: "houseType", required: true },
          { name: "contractType", required: true },
          {
            name: "rahnPrice",
            required: true,
            validate: (value) =>
              /^[0-9]+$/.test(value.replace(/[^0-9]/g, ""))
                ? true
                : "مقدار رهن باید عدد معتبر باشد",
          },
          {
            name: "ejarePrice",
            required: true,
            validate: (value) =>
              /^[0-9]+$/.test(value.replace(/[^0-9]/g, ""))
                ? true
                : "مقدار اجاره باید عدد معتبر باشد",
          },
        ]);
        break;

      case 2:
        isValid = checkValidate([
          { name: "city", required: true },
          { name: "street", required: true },
          { name: "mainArea", required: true },
          { name: "exactAddress", required: true },
        ]);
        break;

      case 3:
        isValid = checkValidate([
          { name: "bedrooms", required: true },
          { name: "buildingAge", required: true },
          { name: "unitType", required: true },
          {
            name: "areaSize",
            required: true,
            validate: (value) =>
              /^[0-9]+$/.test(value) ? true : "متراژ باید عدد معتبر باشد",
          },
          { name: "location", required: true },
          { name: "floor", required: true },
          { name: "totalFloors", required: true },
          { name: "unitsPerFloor", required: true },
        ]);
        break;
      case 4:
        isValid = checkValidate([
          {
            name: "facilities",
            validate: (value) => {
              const isValid = Array.isArray(value) && value.length > 0;
              return isValid || "حداقل یک مورد را انتخاب کنید";
            },
          },
        ]);
        break;

      case 5:
        isValid = checkValidate([
          {
            name: "description",
            required: true,
            validate: (value) =>
              value.length >= 10 ? true : "توضیحات باید حداقل 10 کاراکتر باشد",
          },
        ]);
        break;

      case 6:
        isValid = checkValidate([
          {
            name: "images",
            required: true,
            validate: (value) =>
              Array.isArray(value) && value.length > 0
                ? true
                : "حداقل یک تصویر بارگذاری کنید",
          },
        ]);
        break;

      default:
        isValid = true;
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }

    return isValid;
  };

  const prevStepHandler = () => {
    setStep((prev) => Math.max(1, prev - 1));
    clearErrors();
  };
  const onSubmitFinalHandler = async (data) => {
    try {
      setIsLoading(true);
      // Transform data to match backend expectations
      console.log(data.rahnPrice);
      const backendData = {
        houseType: data.houseType,
        title: data.title || fillTitle(),
        rahnPrice: +data.rahnPrice.replace(/\D/g, ""),
        ejare_price: +data.ejarePrice.replace(/\D/g, ""),
        location: `${data.city}-${data.mainArea}`,
        house_position: data.location,
        address: `${data.street}, ${data.mainArea}, ${data.city}`,
        full_address: data.exactAddress,
        city: data.city,
        description: data.description,
        bedrooms: `${data.bedrooms} خوابه`,
        building_area: `${data.areaSize} متر مربع`,
        floor_number: data.floor,
        floors: data.totalFloors,
        house_year: data.buildingAge,
        unitType: data.unitType,
        contractType: data.contractType,
        units_per_floor: `${data.unitsPerFloor} واحد`,
        // Send equipment as array of IDs (already properly formatted from step 4)
        equipment: data.facilities || [], // Now expects array of numbers [1, 2, 3]

        latitude: position?.[1],
        longitude: position?.[0],
      };

      const response = await fetch(`http://localhost:5000/api/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
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
      toast.error("ثبت آگهی با خطا مواجه شد ",toastOption)
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

      const formData = new FormData();
      files.forEach((file, index) => {
        if (!(file instanceof File)) {
          console.warn(
            `Item at index ${index} is not a valid File object:`,
            file
          );
          return;
        }
        formData.append("images", file);
      });
      formData.append("type", "main");

      // Log FormData entries
      console.log("FormData contents:");

      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Image upload failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Image Upload Error:", error);
      throw error;
    }
  };
  const houseTypeToPersian = (type) => {
    if (type === "Apartment") return "آپارتمان";
    else if (type === "House") return "خانه";
    else return "ویلا";
  };
  const fillTitle = () => {
    const title = `${houseTypeToPersian(watch("houseType"))} ${watch(
      "bedrooms"
    )} خوابه در ${watch("city")}`;
    return title;
  };
  return (
     <PrivateRoute role={["admin","user"]}>
 <form onSubmit={handleSubmit(onSubmitFinalHandler)}>
      <Layout active={step}>
        {step === 1 && (
          <StepContent
            step={step}
            event={nextStepHandler}
            prevEvent={prevStepHandler}
          >
            <div className={`${styles.formRow} ${styles.mb4}`}>
              <Select
                label="نوع ملک"
                placeHolder="نوع ملک خود را انتخاب کنید"
                size="lg"
                val={watch("houseType")}
                defaultValue={watch("houseType")}
                onChange={(val) => setValue("houseType", val)}
                error={errors.houseType} // Pass error message
                options={[
                  { value: "villa", label: "ویلا" },
                  { value: "apartment", label: "آپارتمان" },
                  { value: "house", label: "خانه ویلایی" },
                ]}
              />
              <Select
                label="نوع معامله"
                placeHolder="نوع معامله خود را انتخاب کنید"
                size="lg"
                val={watch("contractType")}
                defaultValue={watch("contractType")}
                onChange={(val) => setValue("contractType", val)}
                error={errors.contractType}
                options={[
                  { value: "sale", label: "فروش" },
                  { value: "rahn-ejare", label: "رهن و اجاره" },
                  { value: "ejare", label: "اجاره" },
                ]}
              />
            </div>

            <div className={styles.formRow}>
              <Input
                label="رهن"
                type="text"
                placeholder="مثلا 500 میلیون تومان"
                size="lg"
                val={watch("rahnPrice")}
                onChange={(val) => {
                  const digitsOnly = val.replace(/\D/g, "");
                  const formatted = digitsOnly.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  );
                  setValue("rahnPrice", formatted);
                }}
                error={errors.rahnPrice}
              />
              <Input
                label="اجاره"
                type="text"
                placeholder="مثلا 50 میلیون تومان"
                size="lg"
                val={watch("ejarePrice")}
                onChange={(val) => {
                  const digitsOnly = val.replace(/\D/g, "");
                  const formatted = digitsOnly.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  );
                  setValue("ejarePrice", formatted);
                }}
                error={errors.ejarePrice}
              />
            </div>
          </StepContent>
        )}
        {step === 2 && (
          <StepContent
            step={step}
            isDisable={isDisable}
            event={nextStepHandler}
            prevEvent={prevStepHandler}
          >
            <div className={`${styles.formRow} ${styles.mb4}`}>
              <Select
                label="شهر"
                placeHolder="شهر خود را انتخاب کنید"
                size="lg"
                val={watch("city")}
                defaultValue={watch("city")}
                error={errors.city}
                options={city?.map((item) => ({
                  value: item.slug,
                  label: item.name,
                }))}
                onChange={(val) => setValue("city", val)}
              />
              <Input
                label="خیابان فرعی یا کوچه"
                type="text"
                placeholder="آدرس خود را وارد کنید"
                size="lg"
                val={watch("street")}
                error={errors.street}
                onChange={(val) => setValue("street", val)}
              />
            </div>

            <div className={`${styles.formRow}`}>
              <Input
                label="خیابان یا محله‌ی اصلی"
                type="text"
                placeholder="آدرس خود را وارد کنید"
                size="lg"
                val={watch("mainArea")}
                error={errors.mainArea}
                onChange={(val) => setValue("mainArea", val)}
              />
              <Input
                label="آدرس دقیق و پلاک"
                type="text"
                placeholder="آدرس خود را وارد کنید"
                size="lg"
                val={watch("exactAddress")}
                error={errors.exactAddress}
                onChange={(val) => setValue("exactAddress", val)}
              />
            </div>
            <div className={`${styles.formRow} ${styles.mapContainer}`}>
              <MapSelect isEnable={false} />
              <div
                className={styles.showMap}
                onClick={() => setIsShowModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#353739"
                    d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14M12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2"
                  ></path>
                </svg>
                ثبت روی نقشه
              </div>
            </div>
            {isShowModal && (
              <ModalMap
                onClose={() => setIsShowModal(false)}
                onConfirm={() => {
                  setValue("position", position);
                  setIsShowModal(false);
                }}
              >
                <MapSelect
                  isEnable={true}
                  position={position}
                  setPosition={setPosition}
                />
              </ModalMap>
            )}
          </StepContent>
        )}
        {step === 3 && (
          <StepContent
            step={step}
            isDisable={!watch("bedrooms")&&!watch("buildingAge")&&!watch("areaSize")&&!watch("floor")}
            event={nextStepHandler}
            prevEvent={prevStepHandler}
          >
            <div className={`${styles.formRow} ${styles.mb4}`}>
              <Select
                label="تعداد اتاق خواب"
                placeHolder="تعداد اتاق خواب را انتخاب کنید"
                size="lg"
                val={watch("bedrooms")}
                defaultValue={watch("bedrooms")}
                onChange={(val) => setValue("bedrooms", val)}
                error={errors.bedrooms}
                options={Array(10)
                  .fill(0)
                  .map((item, i) => ({
                    value: i + 1,
                    label: `${i + 1} خوابه`,
                  }))}
              />
              <Select
                label="سن بنا"
                placeHolder="سن بنا را انتخاب کنید"
                size="lg"
                val={watch("buildingAge")}
                defaultValue={watch("buildingAge")}
                onChange={(val) => setValue("buildingAge", val)}
                error={errors.buildingAge}
                options={Array(50)
                  .fill(0)
                  .map((item, i) => ({
                    value: i + 1,
                    label: `${i + 1} سال ساخت`,
                  }))}
              />
            </div>

            <div className={`${styles.formRow} ${styles.mb4}`}>
              <Select
                label="نوع واحد"
                placeHolder="نوع واحد را انتخاب کنید"
                size="lg"
                val={watch("unitType")}
                defaultValue={watch("unitType")}
                onChange={(val) => setValue("unitType", val)}
                error={errors.unitType}
                options={[
                  { value: "maskoni", label: "واحد مسکونی" },
                  { value: "tejari", label: "واحد تجاری" },
                  { value: "tejari", label: "واحد صنعتی" },
                ]}
              />
              <Input
                label="زیر بنا (متر)"
                type="number"
                placeholder="متراژ زیر بنا را وارد کنید"
                size="lg"
                val={watch("areaSize")}
                onChange={(val) => setValue("areaSize", val)}
                error={errors.areaSize}
              />
            </div>
            <div className={`${styles.formRow} ${styles.mb4}`}>
              <Select
                label="موقعیت"
                placeHolder="موقعیت جغرافیایی ملک را انتخاب کنید"
                size="lg"
                val={watch("location")}
                defaultValue={watch("location")}
                onChange={(val) => setValue("location", val)}
                error={errors.location}
                options={[
                  { value: "north", label: "شمال" },
                  { value: "south", label: "جنوب" },
                  { value: "east", label: "شرق" },
                  { value: "west", label: "غرب" },
                  { value: "center", label: "مرکز شهر" },
                ]}
              />
              <Select
                label="طبقه"
                placeHolder="طبقه ملک را انتخاب کنید"
                size="lg"
                val={watch("floor")}
                defaultValue={watch("floor")}
                onChange={(val) => setValue("floor", val)}
                error={errors.floor}
                options={[
                  { value: "basement", label: "زیرزمین" },
                  { value: "ground", label: "همکف" },
                  ...Array.from({ length: 20 }, (_, i) => ({
                    value: String(i + 1),
                    label: `${i + 1}${i === 0 ? "م" : "م"}`, // "اول" for 1, "دوم" for 2, etc.
                  })),
                  { value: "penthouse", label: "پنت هاوس" },
                  { value: "rooftop", label: "پشت بام" },
                ]}
              />
            </div>
            <div className={`${styles.formRow} ${styles.mb1}`}>
              <Select
                label="تعداد طبقات"
                placeHolder="تعداد طبقات ساختمان را انتخاب کنید"
                size="lg"
                val={watch("totalFloors")}
                defaultValue={watch("totalFloors")}
                onChange={(val) => setValue("totalFloors", val)}
                error={errors.totalFloors}
                options={[
                  ...Array.from({ length: 20 }, (_, i) => ({
                    value: String(i + 1),
                    label: `${i + 1} طبقه`,
                  })),
                  { value: "more_than_20", label: "بیش از ۲۰ طبقه" },
                ]}
              />
              <Select
                label="تعداد واحد هر طبقه"
                placeHolder="تعداد واحد هر طبقه را انتخاب کنید"
                size="lg"
                val={getValues("unitsPerFloor")}
                defaultValue={getValues("unitsPerFloor")}
                onChange={(val) => setValue("unitsPerFloor", val)}
                error={errors.unitsPerFloor}
                options={[
                  ...Array.from({ length: 10 }, (_, i) => ({
                    value: String(i + 1),
                    label: `${i + 1} واحد`,
                  })),
                  { value: "more_than_10", label: "بیش از ۱۰ واحد" },
                ]}
              />
            </div>
          </StepContent>
        )}
        {step === 4 && (
          <StepContent
            isDisable={isDisable}
            title="تجهیزات و امکانات"
            step={step}
            event={nextStepHandler}
            prevEvent={prevStepHandler}
          >
            {equip?.data ? (
              <div className={styles.gridForm}>
                {equip.data.map((item) => {
                  const isChecked =
                    watch("facilities")?.includes(item.id) || false;
                  return (
                    <CheckBox
                      key={item.id}
                      title={item.title}
                      val={item.id === watch("facilities")[item.id]}
                      onChange={(checked) => {
                        const current = watch("facilities") || [];
                        setValue(
                          "facilities",
                          checked
                            ? [...current, item.id]
                            : current.filter((id) => id !== item.id),
                          { shouldValidate: true } // Trigger validation immediately
                        );
                      }}
                      value={isChecked}
                    />
                  );
                })}
              </div>
            ) : (
              <div>در حال بارگذاری تجهیزات...</div>
            )}

            {errors.facilities && (
              <p role="alert" className="errorMessage">
                {errors.facilities.message}
              </p>
            )}
          </StepContent>
        )}
        {step === 5 && (
          <StepContent
            isDisable={isDisable}
            title="توضیحات تکمیلی"
            step={step}
            event={nextStepHandler}
            prevEvent={prevStepHandler}
          >
            <Input
              label="عنوان را وارد کنید"
              type="text"
              placeholder="عنوان خود را وارد کنید"
              size="lg"
              val={watch("title") || fillTitle()}
              error={errors.title}
              onChange={(val) => setValue("title", val)}
            />
            <textarea
              className="text-area"
              placeholder="توضیحات خود را اینجا بنویسید..."
              onChange={(e) => setValue("description", e.target.value)}
              value={watch("description")}
            />
            {errors.description && (
              <p role="alert" className="errorMessage">
                {errors.description.message}
              </p>
            )}
            <div className={styles.chkContainer}>
              <CheckBox
                title="ملک در اجاره است."
                onChange={(val) => setValue("isRented", val)}
              />
              <CheckBox
                title="ملک تخلیه و مناسب بازدید است."
                onChange={(val) => setValue("isReadyForVisit", val)}
              />
            </div>
          </StepContent>
        )}
        {step === 6 && (
          <StepContent
            title="عکس‌ها و ویدیو ملک خود را بارگذاری کنید"
            step={step}
            isLoading={isLoading}
            // event={nextStepHandler}
            onSubmit={onSubmitFinalHandler}
            prevEvent={prevStepHandler}
            isDisable={!watch("images")?.length}
          >
            <div className={styles.uploaderGrid}>
              <Uploader
                onFileSelect={(file) => {
                  const current = watch("images") || [];
                  setValue("images", [...current, file]);
                }}
              />
              <Uploader
                onFileSelect={(file) => {
                  const current = watch("images") || [];
                  setValue("images", [...current, file]);
                }}
              />
              <Uploader
                onFileSelect={(file) => {
                  const current = watch("images") || [];
                  setValue("images", [...current, file]);
                }}
              />
              <Uploader
                onFileSelect={(file) => {
                  const current = watch("images") || [];
                  setValue("images", [...current, file]);
                }}
              />
              <Uploader
                onFileSelect={(file) => {
                  const current = watch("images") || [];
                  setValue("images", [...current, file]);
                }}
              />
              <Uploader
                onFileSelect={(file) => {
                  const current = watch("images") || [];
                  setValue("images", [...current, file]);
                }}
              />
            </div>
            {errors.images && (
              <p role="alert" className={styles.error}>
                {errors.images.message}
              </p>
            )}
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
