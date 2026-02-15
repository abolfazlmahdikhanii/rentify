import React from "react";
import styles from "../styles/Home.module.css";
import HeroBg from "@/components/templates/index/HeroBg/HeroBg";
import BestHome from "@/components/templates/index/BestHome/BestHome";
import LastVisited from "@/components/templates/index/LastVisited/LastVisited";
import CardSection from "@/components/templates/index/CardSection/CardSection";
import StepProcess from "@/components/templates/index/StepProcess/StepProcess";
import LoanBanner from "@/components/templates/index/LoanBanner/LoanBanner";
import { getCookie } from "cookies-next";
import useSWR from "swr";

const Page = ({ houses }) => {
  return (
    <div className={styles.main}>
      <HeroBg houses={houses} />
      <div className={`container ${styles.bestHomeGrid}`}>
        <BestHome
          src={"/images/bh-3.png"}
          title="ویلا"
          count={houses.filter((item) => item.type === "Villa").length}
          type="Villa"
        />
        <BestHome
          src={"/images/bh-2.png"}
          title="آپارتمان"
          count={houses.filter((item) => item.type === "Apartment").length}
          type="Apartment"
        />
        <BestHome
          src={"/images/bh-1.png"}
          title="خانه ویلایی"
          count={houses.filter((item) => item.type === "House").length}
          type="House"
        />
      </div>
      <LastVisited houses={houses} />
      <div className="container">
        <CardSection />
        <StepProcess />
        <LoanBanner />
      </div>
    </div>
  );
};
export async function getServerSideProps(context) {
  try {
    const token = context.req.cookies?.token;

    const res = await fetch("https://rentify-api.runflare.run/api/properties", {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      console.error("API Error:", res.status);
      return { props: { houses: [] } };
    }

    const data = await res.json();

    return {
      props: {
        houses: data?.data || [],
      },
    };
  } catch (error) {
    console.error("Fetch error:", error.message);
    return { props: { houses: [] } };
  }
}
export default Page;
