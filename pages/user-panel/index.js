import PrivateRoute from "@/components/module/PrivateRoute/PrivateRoute";
import Content from "@/components/module/UserPanel/Content/Content";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { toastOption } from "@/helper/helper";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";
const fetcher = () =>
  fetch("http://localhost:5000/api/auth/info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  }).then((res) => res.json());
const Dashboard = () => {
  const { data, isLoading } = useSWR("info", fetcher);
  const [profileImage, setProfileImage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    name: data?.user?.name || "",
    lastName: data?.user?.lastName || "",
    job: data?.user?.job || "",
    phone: data?.user?.phone || "",
    email: data?.user?.email || "",
    password: "", // Don't pre-fill password for security
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (formData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/complete-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify({
            ...formData,
            // profileImage // Include the image if you're uploading it
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Handle success (show toast, etc.)
        toast.success("اطلاعات با موفقیت ثبت شد", toastOption);
      } else {
        // Handle error
        toast.error("ثبت اطلاعات با خطا مواجه شد", toastOption);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  return (
    <DashboardLayout title="ویرایش اطلاعات">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Content>
          <div className="profile-image-section">
            <div className="profile-image-container">
              <Image
                src={"/images/profile.png" || profileImage}
                alt="تصویر پروفایل"
                width={100}
                height={100}
                className="profile-pic"
                onChange={(e) => setProfileImage(e.target.files[0])}
                priority
              />
            </div>
            <label htmlFor="profile-image" className="change-image-btn">
              تغییر عکس
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                className="file-input"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="form-fields">
            <div className="form-row">
              <div>
                <div className="inputLabel">نام</div>
                <div className="inputWrapper">
                  <input
                    type="text"
                    className={`input ${errors.name ? "input-error" : ""}`}
                    placeholder="نام را وارد کنید"
                    defaultValue={data?.user?.name}
                    {...register("name", {
                      required: "نام الزامی است",

                      minLength: {
                        value: 2,
                        message: "نام باید حداقل ۲ کاراکتر باشد",
                      },
                    })}
                  />
                </div>
                {errors.name && (
                  <span className="errorMessage">{errors.name.message}</span>
                )}
              </div>

              <div>
                <div className="inputLabel">نام خانوادگی</div>
                <div className="inputWrapper">
                  <input
                    type="text"
                    className={`input ${errors.lastName ? "input-error" : ""}`}
                    placeholder="نام خانوادگی را وارد کنید"
                    defaultValue={data?.user?.lastName}
                    {...register("lastName", {
                      required: "نام خانوادگی الزامی است",
                      minLength: {
                        value: 2,
                        message: "نام خانوادگی باید حداقل ۲ کاراکتر باشد",
                      },
                    })}
                  />
                </div>
                {errors.lastName && (
                  <span className="errorMessage">
                    {errors.lastName.message}
                  </span>
                )}
              </div>

              <div>
                <div className="inputLabel">شغل</div>
                <div className="inputWrapper">
                  <input
                    type="text"
                    className="input"
                    placeholder="شغل را وارد کنید"
                    defaultValue={data?.user?.job}
                    {...register("job")}
                  />
                </div>
              </div>

              <div>
                <div className="inputLabel">تلفن همراه</div>
                <div className="inputWrapper">
                  <input
                    type="tel"
                    className={`input ${errors.phone ? "input-error" : ""}`}
                    placeholder="تلفن همراه را وارد کنید"
                    defaultValue={data?.user?.phone}
                    {...register("phone", {
                      required: "شماره تلفن الزامی است",
                      pattern: {
                        value: /^09[0-9]{9}$/,
                        message:
                          "شماره تلفن معتبر وارد کنید (مثال: 09123456789)",
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <span className="errorMessage">{errors.phone.message}</span>
                )}
              </div>

              <div>
                <div className="inputLabel">ایمیل</div>
                <div className="inputWrapper">
                  <input
                    type="email"
                    className={`input ${errors.email ? "input-error" : ""}`}
                    placeholder="ایمیل را وارد کنید"
                    autoComplete="username"
                    defaultValue={data?.user?.email}
                    {...register("email", {
                      required: "ایمیل الزامی است",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "ایمیل معتبر وارد کنید",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <span className="errorMessage">{errors.email.message}</span>
                )}
              </div>

              <div>
                <div className="inputLabel">رمز عبور جدید (اختیاری)</div>
                <div className="inputWrapper">
                  <input
                    type="password"
                    className={`input ${errors.password ? "input-error" : ""}`}
                    autoComplete="current-password"
                    placeholder="رمز عبور جدید را وارد کنید"
                    {...register("password", {
                      minLength: {
                        value: 6,
                        message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <span className="errorMessage">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Content>
        <div className="btn-row">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "در حال ثبت..." : "ثبت تغییرات"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default Dashboard;
