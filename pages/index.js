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

import { userVerify } from "@/lib/userAuth";
import { getProperties } from "@/service/propertyService";
const fetcher = async (url) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  const data = await res.json();
  if (Array.isArray(data?.properties)) {
    return data.data;
  } else {
    console.error("Unexpected data format:", data);
    return [];
  }
};
const Page = ({ homes }) => {
  const {
    data: houses,
    error,
    isLoading,
    isValidating,
  } = useSWR("/api/properties", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    fallbackData: homes,
  });
  const housesList = Array.isArray(houses.properties) ? houses.properties : [];

  return (
    <div className={styles.main}>
      <HeroBg houses={housesList} />
      <div className={`container ${styles.bestHomeGrid}`}>
        <BestHome
          src={"/images/bh-3.png"}
          title="ویلا"
          count={
            housesList.filter((item) => item.propertyType === "villa").length
          }
          type="villa"
        />
        <BestHome
          src={"/images/bh-2.png"}
          title="آپارتمان"
          count={
            housesList.filter((item) => item.propertyType === "apartment")
              .length
          }
          type="apartment"
        />
        <BestHome
          src={"/images/bh-1.png"}
          title="خانه ویلایی"
          count={
            housesList.filter((item) => item.propertyType === "house").length
          }
          type="house"
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

export async function getServerSideProps({ query, req, res }) {
  const user =await userVerify(req, res);
  const data = await getProperties(
    {
      limit: 8,
    },
    user._id,
  );

  return {
    props: {
      homes: JSON.parse(JSON.stringify(data)),
    },
  };
}
export default Page;
