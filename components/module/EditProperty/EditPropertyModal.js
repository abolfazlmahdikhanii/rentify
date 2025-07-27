"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight, MapPin, Upload, X } from "lucide-react";

import Select from "../Form/Select";
import styles from "./EditProperty.module.css";
import { toast } from "react-toastify";
import Input from "../Form/Input";
import ModalMap from "@/components/templates/RegisterStep/ModalMap";
import MapSelect from "../Map/MapSelect";
import CheckBox from "../Form/CheckBox";
import Uploader from "../Uploader/Uploader";
import useSWR from "swr";
import { getCookie } from "cookies-next";
import { toastOption } from "@/helper/helper";

const fetcher = () =>
  fetch("https://iranplacesapi.liara.run/api/provinces").then((res) =>
    res.json()
  );
export default function EditPropertyModal({
  isOpen,
  onClose,
  propertyData,
  onSuccess,
}) {
  const { data: cities, isLoading: load } = useSWR("cities", fetcher);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // const [cities, setCities] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [position, setPosition] = useState(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    getValues,
    clearErrors,
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
      title: "",
      isRented: false,
      isReadyForVisit: false,
    },
    mode: "onBlur",
  });

  console.log(propertyData);
  // Load initial data when modal opens
  useEffect(() => {
    if (isOpen && propertyData) {
      // Transform API data to form format
      const formattedData = {
        id: propertyData.id,
        houseType: propertyData.type.toLowerCase(), // "House" -> "house"
        title: propertyData.title,
        rahnPrice: propertyData.price
          ?.toString()
          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        ejarePrice: propertyData.ejare_price
          ?.toString()
          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        // Extract bedroom count from "3 خوابه" format
        bedrooms: propertyData.bedrooms ? parseInt(propertyData.bedrooms) : "",
        // Extract area size from "300 متر مربع" format
        areaSize: propertyData.building_area
          ? parseInt(propertyData.building_area.replace(/\D/g, ""))
          : "",
        // Location handling (split "قزوین-امام سجاد")
        city: propertyData.location?.split("-")[0] || "",
        mainArea: propertyData.location?.split("-")[1] || "",
        street: "", // Not in your data
        exactAddress: propertyData.full_address || "",
        // Facilities/equipment
        facilities: propertyData.equipment?.map((item) => item.id) || [],
        description: propertyData.description,
        // Additional fields from your data
        contact_phone: propertyData.contact_phone,
        // Default values for fields not in your data
        contractType: propertyData.contractType, // Default since you have both price and ejare_price
        buildingAge: propertyData.house_year,
        unitType: propertyData.unitType,
        floor: propertyData.floor_number,
        totalFloors: propertyData.floors,
        unitsPerFloor: propertyData.unit_floor,
        location: propertyData.house_position,
        isRented: false,
        isReadyForVisit: propertyData.status === "approved",
        images: propertyData.images,
      };

      reset(formattedData);

      // Set existing images if available
      if (propertyData.images) {
        setSelectedImages(propertyData.images);
        setValue("images", propertyData.images);
      }

      if (propertyData.latitude && propertyData.longitude) {
        const lat = parseFloat(propertyData.latitude);
        const lng = parseFloat(propertyData.longitude);

        // Only set position if valid numbers
        if (!isNaN(lat) && !isNaN(lng)) {
          setPosition({ lat, lng });
        } else {
          // Set default position if invalid
          setPosition({ lat: 35.6892, lng: 51.389 }); // Default to Tehran coordinates
        }
      } else {
        // Set default position if no coordinates
        setPosition({ lat: 35.6892, lng: 51.389 });
      }
    }
  }, [isOpen, propertyData]);

  // Fetch cities and equipment data
  useEffect(() => {
    if (isOpen) {
      fetchEquipment();
    }
  }, [isOpen]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(
        "https://rentify-app.liara.run/api/properties/equipment"
      );
      const data = await response.json();
      setEquipment(data.data || []);
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
    }
  };

  const validateStep = (currentStep) => {
    let isValid = true;
    clearErrors();

    const validationRules = {
      1: [
        { name: "houseType", required: true },
        { name: "contractType", required: true },
        { name: "rahnPrice", required: true },
        { name: "ejarePrice", required: true },
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
        { name: "areaSize", required: true },
        { name: "location", required: true },
        { name: "floor", required: true },
        { name: "totalFloors", required: true },
        { name: "unitsPerFloor", required: true },
      ],
      4: [
        {
          name: "facilities",
          validate: (value) => {
            return Array.isArray(value) && value.length > 0
              ? true
              : "حداقل یک مورد را انتخاب کنید";
          },
        },
      ],
      5: [
        {
          name: "description",
          required: true,
          validate: (value) =>
            value.length >= 10 ? true : "توضیحات باید حداقل 10 کاراکتر باشد",
        },
      ],
    };

    const rules = validationRules[currentStep] || [];

    rules.forEach(({ name, required, validate }) => {
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

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setStep((prev) => Math.min(6, prev + 1));
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    setStep((prev) => Math.max(1, prev - 1));
    clearErrors();
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const backendData = {
        houseType: data.houseType,
        title: data.title,
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
        equipment: data.facilities || [],
      };

      const response = await fetch(
        `https://rentify-app.liara.run/api/properties/${propertyData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify(backendData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update property");
      }

      // Handle image upload if there are new images
      if (data.images?.length > 0) {
        await uploadImages(data.images, propertyData.id);
      }

      toast.success("ملک با موفقیت ویرایش شد", toastOption);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("ویرایش ملک با خطا مواجه شد", toastOption);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (files, propertyId) => {
    try {
      // If no files provided, return success (don't throw error)
      // This handles the case where user doesn't select new images
      if (!files || files.length === 0) {
        console.log("No new images selected for upload");
        return {
          success: true,
          message: "No new images to upload",
          images: [],
        };
      }

      // Filter out invalid files and keep only valid File objects
      const validFiles = files.filter((file, index) => {
        if (!(file instanceof File)) {
          console.warn(
            `Item at index ${index} is not a valid File object:`,
            file
          );
          return false;
        }
        return true;
      });

      // If no valid files after filtering, return success
      if (validFiles.length === 0) {
        console.log("No valid files found for upload");
        return {
          success: true,
          message: "No valid images to upload",
          images: [],
        };
      }

      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("type", "main");

      // Log FormData entries for debugging
      console.log(
        `Uploading ${validFiles.length} images for property ${propertyId}`
      );

      const response = await fetch(
        `https://rentify-app.liara.run/api/properties/${propertyId}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Upload failed" }));
        throw new Error(errorData.message || "Image upload failed");
      }

      const result = await response.json();
      console.log("Images uploaded successfully:", result);
      return result;
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={`${styles.formRow}`}>
              <Select
                label="نوع ملک"
                placeHolder="نوع ملک خود را انتخاب کنید"
                size="md"
                val={watch("houseType")}
                defaultValue={getValues("houseType")}
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
                size="md"
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
                size="md"
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
                size="md"
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
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={`${styles.formRow} ${styles.mb4}`}>
              <Select
                label="شهر"
                placeHolder="شهر خود را انتخاب کنید"
                size="md"
                val={watch("city")}
                defaultValue={watch("city")}
                error={errors.city}
                options={cities?.map((item) => ({
                  value: item.slug,
                  label: item.name,
                }))}
                onChange={(val) => setValue("city", val)}
              />
              <Input
                label="خیابان فرعی یا کوچه"
                type="text"
                placeholder="آدرس خود را وارد کنید"
                size="md"
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
                size="md"
                val={watch("mainArea")}
                error={errors.mainArea}
                onChange={(val) => setValue("mainArea", val)}
              />
              <Input
                label="آدرس دقیق و پلاک"
                type="text"
                placeholder="آدرس خود را وارد کنید"
                size="md"
                val={watch("exactAddress")}
                error={errors.exactAddress}
                onChange={(val) => setValue("exactAddress", val)}
              />
            </div>
            <div className={` ${styles.mapContainer}`}>
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
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={`${styles.formRow} ${styles.mb4}`}>
              <Select
                label="تعداد اتاق خواب"
                placeHolder="تعداد اتاق خواب را انتخاب کنید"
                size="md"
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
                size="md"
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
                size="md"
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
                size="md"
                val={watch("areaSize")}
                onChange={(val) => setValue("areaSize", val)}
                error={errors.areaSize}
              />
            </div>
            <div className={`${styles.formRow} ${styles.mb4}`}>
              <Select
                label="موقعیت"
                placeHolder="موقعیت جغرافیایی ملک را انتخاب کنید"
                size="md"
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
                size="md"
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
                size="md"
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
                size="md"
                val={watch("unitsPerFloor")}
                defaultValue={watch("unitsPerFloor")}
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
          </div>
        );

      case 4:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>تجهیزات و امکانات</h3>
            {equipment ? (
              <div className={styles.gridForm}>
                {equipment.map((item) => {
                  // Get current facilities array or empty array if undefined
                  const currentFacilities = watch("facilities") || [];
                  // Check if this item's id exists in the facilities array
                  const isChecked = currentFacilities.includes(item.id);

                  return (
                    <CheckBox
                      key={item.id}
                      title={item.title} // Using item.name instead of item.title
                      checked={isChecked}
                      onChange={(checked) => {
                        setValue(
                          "facilities",
                          checked
                            ? [...currentFacilities, item.id] // Add id if checked
                            : currentFacilities.filter((id) => id !== item.id), // Remove id if unchecked
                          { shouldValidate: true }
                        );
                      }}
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
          </div>
        );

      case 5:
        return (
          <div className={styles.stepContent}>
            <Input
              label="عنوان را وارد کنید"
              type="text"
              placeholder="عنوان خود را وارد کنید"
              size="md"
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
          </div>
        );

      case 6:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>
              عکس‌ها و ویدیو ملک خود را بارگذاری کنید
            </h3>
            <div className={styles.uploaderGrid}>
              {Array.from({ length: 6 }).map((_, index) => {
                const currentImage =
                  watch("images")?.[index] || propertyData?.images?.[index];

                return (
                  <Uploader
                    key={index}
                    existingImage={currentImage}
                    onFileSelect={(file) => {
                      const current = watch("images") || [];
                      const newImages = [...current];
                      newImages[index] = file;
                      setValue("images", newImages);
                    }}
                    onRemove={() => {
                      const current = watch("images") || [];
                      const newImages = [...current];
                      newImages[index] = null;
                      setValue("images", newImages);
                    }}
                  />
                );
              })}
            </div>
            {errors.images && (
              <p role="alert" className={styles.error}>
                {errors.images.message}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = {
      1: "اطلاعات پایه",
      2: "آدرس و موقعیت",
      3: "مشخصات ملک",
      4: "تجهیزات و امکانات",
      5: "توضیحات تکمیلی",
      6: "تصاویر ملک",
    };
    return titles[step];
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>ویرایش ملک - {getStepTitle()}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalWrapper}>
          <div className={styles.modalBody}>
            {/* Progress Bar */}
            <div className={styles.progressContainer}>
              <div className={styles.progressInfo}>
                <span>مرحله {step} از 6</span>
                <span>{Math.round((step / 6) * 100)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              {renderStep()}

              {/* Navigation Buttons */}
            </form>
          </div>
          <div className={styles.navigationButtons}>
            {step < 6 ? (
              <button
                type="button"
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={nextStep}
              >
                <ChevronRight className={styles.buttonIcon} />
                مرحله بعد
              </button>
            ) : (
              <button
                type="submit"
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={isLoading}
              >
                {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            )}

            <button
              type="button"
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={prevStep}
              disabled={step === 1}
            >
              مرحله قبل
              <ChevronLeft className={styles.buttonIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
