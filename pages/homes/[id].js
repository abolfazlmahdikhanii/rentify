import React, { useEffect, useState } from "react";
import Slider from "@/components/templates/HomeDetail/Slider/Slider";
import db from "../../data/db.json";
import styles from "../../styles/Detail.module.css";
import TitleInfo from "@/components/templates/HomeDetail/TitleInfo/TitleInfo";
import GeneralInfo from "@/components/templates/HomeDetail/GeneralInfo/GeneralInfo";
import { useRouter } from "next/router";
import VisitBox from "@/components/templates/HomeDetail/VisitBox/VisitBox";
import PayService from "@/components/templates/HomeDetail/PayService/PayService";
import Offer from "@/components/templates/HomeDetail/Offer/Offer";
import ModalVisitRequest from "@/components/templates/HomeDetail/ModalVisitRequest/ModalVisitRequest";
import { notFound } from "next/navigation";
const HomePageDetail = ({ houses }) => {
  const { query } = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="detail-bg">
      <div className="container">
        <Slider />
        <section className={styles.detailGrid}>
          {/* info */}
          <div className={styles.detailInfo}>
            <TitleInfo data={houses[0]} />
            <GeneralInfo
              data={houses[0]?.details}
              locationDetail={houses[0]?.location}
              equipment={houses[0]?.equipment}
            />
            <PayService />
            <Offer />
          </div>

          {/* call */}
          <div className="sticky">
            <VisitBox
              authorName={houses?.author}
              onVisitReq={() => setIsModalOpen(true)}
            />
          </div>
        </section>
      </div>
      {isModalOpen && (
        <ModalVisitRequest onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export async function getStaticPaths() {
  const res = await fetch("http://localhost:5000/api/properties");
  const data = await res.json();

  const path = data.data.splice(0, 8).map((house) => {
    return {
      params: { id: house.id.toString() },
    };
  });
  return {
    paths: path,
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { params } = context;
  const res = await fetch(`http://localhost:5000/api/properties/${params.id}`);
  if (res.status!==200) {
    return {
      notFound: true,
    };
  }
  
  const data = await res.json();
console.log(data);
  return {
    props: { houses: [data] },
  
  };
}

export default HomePageDetail;
