import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Cookies from "js-cookie";
import Head from "next/head";
import Slider from "@/components/templates/HomeDetail/Slider/Slider";
import styles from "../../styles/Detail.module.css";
import TitleInfo from "@/components/templates/HomeDetail/TitleInfo/TitleInfo";
import GeneralInfo from "@/components/templates/HomeDetail/GeneralInfo/GeneralInfo";
import VisitBox from "@/components/templates/HomeDetail/VisitBox/VisitBox";
import PayService from "@/components/templates/HomeDetail/PayService/PayService";
import Offer from "@/components/templates/HomeDetail/Offer/Offer";
import ModalVisitRequest from "@/components/templates/HomeDetail/ModalVisitRequest/ModalVisitRequest";
import CommentWrapper from "@/components/templates/HomeDetail/Comment/CommentWrapper";
import ShareModal from "@/components/templates/HomeDetail/ShareModal/ShareModal";
import Loader from "@/components/module/Loader/Loader";
import { notFound } from "next/navigation";
import { userVerify } from "@/lib/userAuth";
import { getPropertyByID } from "@/service/propertyService";

const HomePageDetail = ({ house }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowShareModal, setIsShowShareModal] = useState(false);
console.log("house",house)
  return (
    <div className="detail-bg">
      <Head>
        <title>{house?.title || "جزئیات ملک"}</title>
      </Head>
      <div className="container">
        <Slider images={house?.images} />
        <section className={styles.detailGrid}>
          {/* info */}
          <div className={styles.detailInfo}>
            <TitleInfo data={house} onShare={() => setIsShowShareModal(true)} />
            <GeneralInfo
              data={house?.details}
              locationDetail={house?.location}
              equipment={house?.equipments}
            />
            <PayService />
            <Offer />
            <CommentWrapper comments={house?.comments} />
          </div>

          {/* call */}
          <div className="sticky">
            <VisitBox
              authorName={house?.agencyName?house?.agencyName:`${house?.owner?.name} ${house?.owner?.lastName}`}
              authorEmail={house?.owner?.email}
              authorPhone={house?.contact_phone}
              onVisitReq={() => setIsModalOpen(true)}
              isOwner={house?.isAuthor}
              isMyVisit={house?.isVisit}
            />
          </div>
        </section>
      </div>
      {isModalOpen && (
        <ModalVisitRequest
          onClose={() => setIsModalOpen(false)}
          id={house?._id}
          approvedTime={house?.visitTimes}
        />
      )}
      {isShowShareModal && (
        <ShareModal
          isOpen={isShowShareModal}
          onClose={() => setIsShowShareModal(false)}
          title="اشتراک گذاری ملک"
        />
      )}
    </div>
  );
};

export default HomePageDetail;

export async function getServerSideProps({ query, req, res }) {
  const user = await userVerify(req, res);

  const result = await getPropertyByID(query.id, user?._id);

  if (!result?.success || !result?.property) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      house: JSON.parse(JSON.stringify(result.property)),
    },
  };
}
