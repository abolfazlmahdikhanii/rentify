"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "../../styles/login.module.css";
import Input from "@/components/module/Form/Input";
import OtpInput from "react-otp-input";
import { set, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "cookies-next";
import { timeFormat, toastOption } from "@/helper/helper";
import { toast } from "react-toastify";
import Loader from "@/components/module/Loader/Loader";
import { AuthContext } from "@/context/AuthContext";

export default function LoginPage() {
  const route = useRouter();
  const [activeTab, setActiveTab] = useState("house");
  const [otp, setOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [countdown, setCountdown] = useState(180);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const { refetchUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    getValues,
    setError,
    clearErrors,

    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      last_name: "",
      agency_name: "",
      email: "",
      phone: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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
  const validationFormHandler = (tab) => {
    if (tab === "house") {
      const fields = [
        { name: "name", required: true },
        { name: "last_name", required: true },
      ];
      return checkValidate(fields);
    } else if (tab === "agency") {
      const fields = [
        { name: "name", required: true },
        { name: "last_name", required: true },
        { name: "agency_name", required: true },
      ];
      return checkValidate(fields);
    }
  };
  const sendOtp = () => {
    const fields = [
      {
        name: "email",
        required: true,
        validate: (value) => {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(value) || "ایمیل معتبر نیست";
        },
      },
    ];
    const isValid = checkValidate(fields);

    if (isValid) {
      const email = getValues("email");
      setCountdown(180);
      setIsLoading(true);
      fetch("/api/auth/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Replace with the actual phone number
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success || data.devOtp) {
            setOtp(true);
            setIsResendDisabled(true);
            setCountdown(180);
            toast.success("کد تایید به ایمیل شما ارسال شد", toastOption);
            setIsLoading(false);
          }
          // Set otp to true after sending OTP
        })
        .catch((error) => {
          toast.error("خطا در ارسال کد تایید", toastOption);
          setIsLoading(false);
        });
    } else {
      toast.error("لطفا ایمیل معتبر وارد کنید", toastOption);
      setIsLoading(false);
    }
  };
  const verifyOtp = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: getValues("email"),
          otp: otpValue,
        }),
      });

      if (response.status === 400) {
        setOtp(false);
        setOtpValue("");
        toast.error("کد تایید منقضی شده است", toastOption);
        throw new Error("Expired OTP");
      }

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      if (!data?.success) {
        throw new Error("OTP verification failed");
      }

      await refetchUser();

      if (!data.needsProfileSetup) {
        route.replace("/");
      } else {
        setIsVerify(true);
      }
    } catch (error) {
      toast.error(error.message, toastOption);
    } finally {
      setIsLoading(false);
    }
  };
  const resendOtp = () => {
    const fields = [
      {
        name: "email",
        required: true,
        validate: (value) => {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(value) || "ایمیل معتبر نیست";
        },
      },
    ];

    if (!checkValidate(fields)) {
      toast.error("لطفا ایمیل معتبر وارد کنید", toastOption);
      return;
    }

    const email = getValues("email");
    setIsLoading(true);
    fetch("/api/auth/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success || data.devOtp) {
          setIsResendDisabled(true);
          setCountdown(180);
          toast.success("کد تایید مجدد ارسال شد", toastOption);
        } else {
          throw new Error(data.message || "خطا در ارسال کد تایید");
        }
      })
      .catch((error) => {
        toast.error(error.message || "خطا در ارسال کد تایید", toastOption);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const setupProfile = async () => {
    const isValid = validationFormHandler(activeTab);

    if (!isValid) return;

    const formData = {
      name: getValues("name"),
      lastName: getValues("last_name"),
      agencyName: getValues("agency_name"),
    };

    try {
      const response = await fetch("/api/auth/setup-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await refetchUser();
        toast.success("پروفایل با موفقیت ایجاد شد", toastOption);
        setTimeout(() => {
          route.replace("/");
        }, 600);
      } else {
        throw new Error(data.message || "خطا در ایجاد پروفایل");
      }
    } catch (error) {
      toast.error(error.message || "خطا در ایجاد پروفایل", toastOption);
    }
  };

  return (
    <div className={styles.containerRow}>
      {isLoading && <Loader />}
      <div className={styles.rightSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image src="/images/logo.png" width={170} height={60} alt="logo" />
          </div>
        </div>

        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>
            {!isVerify && !otp && "ورود | ثبت نام"}
            {!isVerify && otp && "کد تایید"} {isVerify && "تکمیل پروفایل"}
          </h2>
          {!isVerify && !otp && (
            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <form onSubmit={handleSubmit(sendOtp)}>
                  <div className={styles.emailRow}>
                    {" "}
                    <Input
                      type="email"
                      label="ایمیل"
                      placeholder="ایمیل را وارد کنید"
                      error={errors.email}
                      val={getValues("email")}
                      size="lg"
                      onChange={(val) =>
                        setValue("email", val, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </div>
                </form>
              </div>

              <div className={styles.rememberMe}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">مرا به خاطر بسپار</label>
              </div>
            </div>
          )}
          {!isVerify && otp && (
            <>
              <div className={styles.otpInfo}>
                <p className={styles.otpText}>
                  کد ارسال شده به شماره ایمیل{" "}
                  <span dir="ltr">{getValues("email")}</span> را وارد کنید
                </p>
                <p className={styles.otpEdit} onClick={() => setOtp(false)}>
                  ویرایش ایمیل
                </p>
              </div>
              <OtpInput
                value={otpValue}
                onChange={setOtpValue}
                numInputs={4}
                containerStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  direction: "ltr",
                }}
                inputStyle={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "12px",
                  font: "inherit",
                  border: "1px solid #ccc",
                  margin: "0 12px",
                  fontSize: "27px",
                  textAlign: "center",
                }}
                skipDefaultStyles={true}
                inputType="tel"
                renderInput={(props) => <input {...props} />}
              />
              <div className={styles.otpTime}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <g
                    fill="#989BA0"
                    fillRule="evenodd"
                    clipPath="url(#clip0_3596_43985)"
                    clipRule="evenodd"
                  >
                    <path d="M9 2.25a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5M.75 9a8.25 8.25 0 1 1 16.5 0A8.25 8.25 0 0 1 .75 9"></path>
                    <path d="m9.75 9.31 2.405-2.406-1.06-1.06L8.47 8.469a.75.75 0 0 0-.22.53v4.875h1.5z"></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_3596_43985">
                      <path fill="#fff" d="M0 0h18v18H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
                <p className={styles.otpTimeText}>
                  <button
                    className="btn pageLink"
                    onClick={resendOtp}
                    disabled={isResendDisabled || isLoading}
                  >
                    {countdown > 0
                      ? `ارسال مجدد (${timeFormat(countdown)})`
                      : "دریافت کد مجدد"}
                  </button>
                </p>
              </div>
            </>
          )}
          {isVerify && (
            <>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${
                    activeTab === "house" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setActiveTab("house");
                    reset({
                      name: "",
                      last_name: "",
                      agency_name: "",
                    });
                  }}
                >
                  مالک | مستاجر
                </button>
                <button
                  className={`${styles.tab} ${
                    activeTab === "agency" ? styles.activeTab : ""
                  }`}
                  onClick={() => {
                    setActiveTab("agency");
                    reset({
                      name: "",
                      last_name: "",
                      agency_name: "",
                    });
                  }}
                >
                  آژانس املاک
                </button>
              </div>

              <div className={styles.formGroup}>
                {activeTab === "house" ? (
                  <form onSubmit={handleSubmit(setupProfile)}>
                    <div className={styles.formRow}>
                      <div>
                        <Input
                          label="نام"
                          placeholder="نام را وارد کنید"
                          val={watch("name")}
                          error={errors.name}
                          onChange={(val) => {
                            setValue("name", val, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </div>
                      <Input
                        label=" نام خانوادگی"
                        placeholder=" نام خانوادگی را وارد کنید"
                        val={watch("last_name")}
                        error={errors.last_name}
                        onChange={(val) =>
                          setValue("last_name", val, {
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit(setupProfile)}>
                    <div className={styles.formRow}>
                      <div>
                        <Input
                          label="نام"
                          error={errors.name}
                          placeholder="نام را وارد کنید"
                          val={watch("name")}
                          onChange={(val) =>
                            setValue("name", val, {
                              shouldValidate: true,
                            })
                          }
                        />
                      </div>
                      <Input
                        label="نام خانوادگی"
                        error={errors.last_name}
                        placeholder="نام خانوادگی را وارد کنید"
                        val={watch("last_name")}
                        onChange={(val) =>
                          setValue("last_name", val, {
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                    <div className={styles.emailRow}>
                      <Input
                        label="نام دفتر"
                        placeholder="نام دفتر را وارد کنید"
                        error={errors.agency_name}
                        val={watch("agency_name")}
                        onChange={(val) =>
                          setValue("agency_name", val, {
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
          {!isVerify ? (
            <button
              className={styles.loginButton}
              disabled={
                (!isVerify && otp ? otpValue.length < 4 : false) || isLoading
              } // Call the function here
              onClick={!isVerify && !otp ? sendOtp : verifyOtp}
            >
              {!isVerify && otp ? "تایید کد" : "ورود و دریافت کد"}
            </button>
          ) : (
            <button className={styles.loginButton} onClick={setupProfile}>
              تکمیل پروفایل
            </button>
          )}
        </div>
      </div>
      <div className={styles.leftSection}>
        <div className={styles.illustrationContainer}>
          <Image
            src="/images/login.png"
            alt="Login illustration"
            width={640}
            height={400}
            className={styles.illustration}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
