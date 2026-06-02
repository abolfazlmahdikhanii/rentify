"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import { toast } from "react-toastify";

import Layout from "@/components/templates/RegisterStep/Layout";
import StepContent from "@/components/templates/RegisterStep/StepContent";
import StepDeal from "@/components/templates/RegisterStep/StepDeal";
import StepLocation from "@/components/templates/RegisterStep/StepLocation";
import StepDetails from "@/components/templates/RegisterStep/StepDetails";
import StepEquipment from "@/components/templates/RegisterStep/StepEquipment";
import StepMoreInfo from "@/components/templates/RegisterStep/StepMoreInfo";
import StepImages from "@/components/templates/RegisterStep/StepImages";

import Loader from "@/components/module/Loader/Loader";
import PrivateRoute from "@/components/module/PrivateRoute/PrivateRoute";

import { toastOption } from "@/helper/helper";
import styles from "./EditProperty.module.css";

const fetcher = () =>
  fetch("/api/locations/provinces").then((res) => res.json());

const fetcherEquipment = () =>
  fetch("/api/properties/equipment").then((res) => res.json());

export default function EditPropertyModal({
  propertyData,
  onSuccess,
  onClose,
  isOpen,
}) {
  const { data: cities } = useSWR("city", fetcher);
  const { data: equip } = useSWR("equip", fetcherEquipment);
  console.log(cities);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(null);

  const {
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      houseType: "",
      contractType: "",
      sale: "",
      rahnPrice: "",
      ejarePrice: "",
      city: "",
      cityName: "",
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
      images: [],
      isRented: false,
      isReadyForVisit: false,
    },
  });

  // ---------------------------
  // RESET EDIT DATA
  // ---------------------------
  useEffect(() => {
    if (!isOpen || !propertyData) return;

    const mapped = {
      houseType: propertyData.propertyType || "",
      contractType: propertyData.listingType || "",

      sale: propertyData.price?.toString() || "",
      rahnPrice: propertyData.mortgagePrice?.toString() || "",
      ejarePrice: propertyData.rentPrice?.toString() || "",

      city: propertyData.location.city || "",
      cityName: findCity(propertyData.location.city)?.title || "",
      mainArea: propertyData.location.mainArea || "",
      exactAddress: propertyData.location.address || "",
      street: propertyData.location.district || "",
      bedrooms: propertyData.details?.bedrooms || "",
      buildingAge: propertyData.details?.houseYear || "",
      unitType: propertyData.details?.unitType || "",
      areaSize: propertyData.details?.buildingArea || "",

      location: propertyData.details?.position || "",
      floor: propertyData.details?.floor || "",
      totalFloors: propertyData.details?.totalFloors || "",
      unitsPerFloor: propertyData.details?.unitPerFloor || "",

      facilities:
        propertyData.equipments?.map((i) => i.equipmentId?._id || i._id) || [],
      description: propertyData.details?.description || "",
      title: propertyData.title || "",
      images: propertyData.images || [],
    };

    reset(mapped);

    if (propertyData.latitude && propertyData.longitude) {
      setPosition([
        parseFloat(propertyData.longitude),
        parseFloat(propertyData.latitude),
      ]);
    }
  }, [propertyData, isOpen, reset]);

  const findCity = (val) =>
    cities?.states?.find((item) => item._id.toString() === val.toString());
  // ---------------------------
  // MODAL GUARD
  // ---------------------------
  if (!isOpen) return null;

  // ---------------------------
  // VALIDATION
  // ---------------------------
  const validateStep = (step) => {
    clearErrors();

    const rules = {
      1: ["houseType", "contractType"],
      2: ["city", "street", "mainArea", "exactAddress"],
      3: ["bedrooms", "buildingAge", "areaSize"],
      4: ["facilities"],
      5: ["description"],
      6: ["images"],
    };

    let valid = true;

    (rules[step] || []).forEach((field) => {
      const value = watch(field);

      if (!value || (Array.isArray(value) && value.length === 0)) {
        setError(field, {
          type: "required",
          message: "این فیلد الزامی است",
        });
        valid = false;
      }
    });

    return valid;
  };

  // ---------------------------
  // NAVIGATION
  // ---------------------------
  const nextStep = () => {
    if (validateStep(step)) setStep((p) => p + 1);
  };

  const prevStep = () => setStep((p) => Math.max(1, p - 1));

  // ---------------------------
  // SUBMIT
  // ---------------------------

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
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
        address: `${data.street}, ${data.mainArea}, ${findCity(propertyData.location.city)?.title}`,
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
        unitPerFloor: data.unitsPerFloor,
        equipment: data.facilities || [],
        position: data.location,
        latitude: position?.[1],
        longitude: position?.[0],
      };

      const res = await fetch(`/api/properties/${propertyData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success("ویرایش با موفقیت انجام شد", toastOption);

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("خطا در ویرایش ملک", toastOption);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {isLoading && <Loader />}

        <div className={styles.modalHeader}>
          <h2>ویرایش ملک</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.modalWrapper}>
          <div className={styles.modalBody}>
            <Layout active={step}>
              {step === 1 && (
                <StepContent step={step} event={nextStep} prevEvent={prevStep}>
                  <StepDeal watch={watch} setValue={setValue} errors={errors} />
                </StepContent>
              )}

              {step === 2 && (
                <StepContent step={step} event={nextStep} prevEvent={prevStep}>
                  <StepLocation
                    cities={cities}
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                    position={position}
                    setPosition={setPosition}
                  />
                </StepContent>
              )}

              {step === 3 && (
                <StepContent step={step} event={nextStep} prevEvent={prevStep}>
                  <StepDetails
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                  />
                </StepContent>
              )}

              {step === 4 && (
                <StepContent step={step} event={nextStep} prevEvent={prevStep}>
                  <StepEquipment
                    equip={equip}
                    watch={watch}
                    errors={errors}
                    onChange={(_id, checked) => {
                      const current = watch("facilities") || [];

                      setValue(
                        "facilities",
                        checked
                          ? [...current, _id]
                          : current.filter((i) => i !== _id),
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        },
                      );
                    }}
                  />
                </StepContent>
              )}

              {step === 5 && (
                <StepContent step={step} event={nextStep} prevEvent={prevStep}>
                  <StepMoreInfo
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                  />
                </StepContent>
              )}

              {step === 6 && (
                <StepContent
                  step={step}
                  prevEvent={prevStep}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <StepImages
                    addImage={(file) => {
                      const current = watch("images") || [];
                      setValue("images", [...current, file]);
                    }}
                    errors={errors}
                    images={watch("images")}
                  />
                </StepContent>
              )}
            </Layout>
          </div>
        </form>
      </div>
    </div>
  );
}
