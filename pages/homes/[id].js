import React, { useEffect, useState } from "react";
import Slider from "@/components/templates/HomeDetail/Slider/Slider";
import styles from "../../styles/Detail.module.css";
import TitleInfo from "@/components/templates/HomeDetail/TitleInfo/TitleInfo";
import GeneralInfo from "@/components/templates/HomeDetail/GeneralInfo/GeneralInfo";
import { useRouter } from "next/router";
import VisitBox from "@/components/templates/HomeDetail/VisitBox/VisitBox";
import PayService from "@/components/templates/HomeDetail/PayService/PayService";
import Offer from "@/components/templates/HomeDetail/Offer/Offer";
import ModalVisitRequest from "@/components/templates/HomeDetail/ModalVisitRequest/ModalVisitRequest";
import CommentWrapper from "@/components/templates/HomeDetail/Comment/CommentWrapper";
import ShareModal from "@/components/templates/HomeDetail/ShareModal/ShareModal";
const HomePageDetail = ({ houses }) => {
  const { query } = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowShareModal, setIsShowShareModal] = useState(false);
  return (
    <div className="detail-bg">
      <div className="container">
        <Slider images={houses[0]?.images} />
        <section className={styles.detailGrid}>
          {/* info */}
          <div className={styles.detailInfo}>
            <TitleInfo
              data={houses[0]}
              onShare={() => setIsShowShareModal(true)}
            />
            <GeneralInfo
              data={houses[0]?.details}
              locationDetail={houses[0]?.location}
              equipment={houses[0]?.equipment}
            />
            <PayService />
            <Offer />
            <CommentWrapper comments={houses[0]?.comments} />
          </div>

          {/* call */}
          <div className="sticky">
            <VisitBox
              authorName={houses[0]?.author}
              authorEmail={houses[0]?.author_email}
              authorPhone={houses[0]?.contact_phone}
              onVisitReq={() => setIsModalOpen(true)}
              isOwner={houses[0]?.isAuthor}
              isMyVisit={houses[0]?.isMyVisit}
            />
          </div>
        </section>
      </div>
      {isModalOpen && (
        <ModalVisitRequest
          onClose={() => setIsModalOpen(false)}
          id={query.id}
          approvedTime={houses[0].visitTimes}
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

export async function getServerSideProps(context) {
  const { params } = context;
  const cookies = context.req.cookies || {};
  const token = cookies.token;

  const res = await fetch(
    `https://rentify-app.liara.run/api/properties/${params.id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (res.status !== 200) {
    return {
      notFound: true,
    };
  }

  const data = await res.json();

  return {
    props: { houses: [data] },
  };
}

export default HomePageDetail;
