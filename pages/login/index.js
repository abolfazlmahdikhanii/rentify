"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

export default function LoginPage() {
  const route = useRouter();
  const [activeTab, setActiveTab] = useState("house");
  const [otp, setOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [countdown, setCountdown] = useState(180);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
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
      phone: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    // } else if (countdown === 0) {
    //   setIsResendDisabled(false);
    //   setCountdown(180);
    // }
    return () => clearTimeout(timer);
  }, [countdown, isResendDisabled]);

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
        {
          name: "email",
          required: true,
          validate: (value) => {
            const emailRegex =
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(value) || "ایمیل معتبر نیست";
          },
        },
      ];
      return checkValidate(fields);
    } else if (tab === "agency") {
      const fields = [
        { name: "name", required: true },
        { name: "last_name", required: true },
        { name: "agency_name", required: true },
        {
          name: "email",
          required: true,
          validate: (value) => {
            const emailRegex =
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(value) || "ایمیل معتبر نیست";
          },
        },
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
      setOtp(true);
      const email = getValues("email");
      setCountdown(180);
      fetch("https://rentify-app.liara.run/api/auth/send-otp", {
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
          if (data.success) {
            console.log(data);
            toast.success("کد تایید به ایمیل شما ارسال شد", toastOption);
          }
          // Set otp to true after sending OTP
        })
        .catch((error) => {
          toast.error("خطا در ارسال کد تایید", toastOption);
        });
    } else {
      toast.error("لطفا ایمیل معتبر وارد کنید", toastOption);
    }
  };
  const verifyOtp = () => {
    setIsLoading(true);
    fetch("https://rentify-app.liara.run/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: getValues("email"),
        otp: otpValue,
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          setOtp(false);
          setOtpValue("");
          toast.error("کد تایید منقضی شده است", toastOption);
          return Promise.reject("Expired OTP");
        }
        if (!response.ok) {
          return Promise.reject("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        if (data?.success) {
          setIsLoading(false);
          const cookieOptions = {
            maxAge: data.needsProfileSetup ? 60 * 60 * 24 : 60 * 60 * 24 * 7,
          };
          setCookie("token", data.token, cookieOptions);

          if (!data.needsProfileSetup) {
            route.replace("/");
          } else {
            setIsVerify(true);
          }
        } else {
          throw new Error("OTP verification failed");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        if (!error?.includes("Expired OTP")) {
          toast.error("کد تایید اشتباه است", toastOption);
        }
    
      });
  };
  const resendOtp = () => {
    const email = getValues("email");
    fetch("https://rentify-app.liara.run/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsResendDisabled(true);
          setCountdown(180);
          toast.success("کد تایید مجدد ارسال شد", toastOption);
        }
      })
      .catch((error) => {
        toast.error("خطا در ارسال کد تایید", toastOption);
      });
  };

  const setupProfile = () => {
    const isValid = validationFormHandler(activeTab);
    if (isValid) {
      const formData = {
        name: getValues("name"),
        lastName: getValues("last_name"),
        agencyName: getValues("agency_name"),
      };
      fetch("https://rentify-app.liara.run/api/auth/setup-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setCookie("token", data.token, { maxAge: 60 * 60 * 24 * 7 });
            toast.success("پروفایل با موفقیت ایجاد شد", toastOption);
            setTimeout(() => {
              route.replace("/");
            }, 600);
          }
        })
        .catch((error) => {
          toast.error("خطا در ایجاد پروفایل", toastOption);
        });
    }
  };
  if (isLoading) return <Loader />;
  return (
    <div className={styles.containerRow}>
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
                  {countdown > 0 ? (
                    <>
                      <span className={styles.otpTimer}>
                        {timeFormat(countdown)}
                      </span>
                      تا دریافت مجدد کد
                    </>
                  ) : (
                    <button className="btn pageLink" onClick={resendOtp}>
                      دریافت کد مجدد
                    </button>
                  )}
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
              disabled={!isVerify && otp ? otpValue.length < 4 : false} // Call the function here
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
          />
        </div>
      </div>
    </div>
  );
}
