import React from "react";
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
  return data?.data || [];
};

const Page = () => {
  const {
    data: houses,
    error,
    isLoading,
  } = useSWR("https://rentify-api.runflare.run/api/properties", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  });
  
  if (error) {
    toast.error("خطا در دریافت اطلاعات", toastOption);
  }

  // حالت خالی بودن داده
  const housesList = houses || [];
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
    </div>
  );
};
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
export default Page;
