import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Cookies from "js-cookie";
import HeroBg from "@/components/templates/index/HeroBg/HeroBg";
import BestHome from "@/components/templates/index/BestHome/BestHome";
import LastVisited from "@/components/templates/index/LastVisited/LastVisited";
import CardSection from "@/components/templates/index/CardSection/CardSection";
import StepProcess from "@/components/templates/index/StepProcess/StepProcess";
import LoanBanner from "@/components/templates/index/LoanBanner/LoanBanner";
import useSWR from "swr";
import { toast } from "react-toastify";
import { toastOption } from "@/helper/helper";
import Loader from "@/components/module/Loader/Loader";

const fetcher = async (url) => {
  const token = Cookies.get("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  const data = await res.json();

  // مهم: چک کنیم که data.data آرایه هست یا نه
  if (Array.isArray(data?.data)) {
    return data.data;
  } else if (Array.isArray(data)) {
    return data;
  } else {
    console.error("Unexpected data format:", data);
    return [];
  }
};

const Page = () => {
  const {
    data: houses,
    error,
    isLoading,
    isValidating,
  } = useSWR("https://rentify-api.runflare.run/api/properties", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    fallbackData: [],
    dedupingInterval: 2000,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  // نمایش خطا فقط یکبار
  useEffect(() => {
    if (error) {
      toast.error("خطا در دریافت اطلاعات", toastOption);
    }
  }, [error]);

  // مطمئن بشیم که houses همیشه آرایه هست
  const housesList = Array.isArray(houses) ? houses : [];

  return (
    <div className={styles.main}>
      <HeroBg houses={housesList} />
      <div className={`container ${styles.bestHomeGrid}`}>
        <BestHome
          src={"/images/bh-3.png"}
          title="ویلا"
          count={housesList.filter((item) => item.type === "Villa").length}
          type="Villa"
        />
        <BestHome
          src={"/images/bh-2.png"}
          title="آپارتمان"
          count={housesList.filter((item) => item.type === "Apartment").length}
          type="Apartment"
        />
        <BestHome
          src={"/images/bh-1.png"}
          title="خانه ویلایی"
          count={housesList.filter((item) => item.type === "House").length}
          type="House"
        />
      </div>
      <LastVisited houses={housesList} />
      <div className="container">
        <CardSection />
        <StepProcess />
        <LoanBanner />
      </div>
      {isLoading && housesList.length === 0 && <Loader />}
      {isValidating && !isLoading && <Loader />}
    </div>
  );
};

export default Page;
// export async function getServerSideProps(context) {
//   try {
//     const token = context.req.cookies?.token;

//     const res = await fetch("http://rentify-api.runflare.run/api/properties", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//     });

//     if (!res.ok) {
//       console.error("API Error:", res.status);
//       return { props: { houses: [] } };
//     }

//     const data = await res.json();

//     return {
//       props: {
//         houses: data?.data || [],
//       },
//     };
//   } catch (error) {
//     console.error("Fetch error:", error.message);
//     return { props: { houses: [] } };
//   }
// }
// export default Page;
