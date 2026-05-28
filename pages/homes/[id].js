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

// Fetcher function
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
    if (res.status === 404) {
      throw new Error("NOT_FOUND");
    }
    throw new Error(`خطا در دریافت اطلاعات (${res.status})`);
  }

  const data = await res.json();
  return data;
};

const HomePageDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowShareModal, setIsShowShareModal] = useState(false);

  // استفاده از SWR
  const {
    data: house,
    error,
    isLoading,
  } = useSWR(
    id ? `https://rentify.bonto.run/api/properties/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // اگه 404 بود، retry نکن
        if (error.message === "NOT_FOUND") return;
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    },
  );

  // Error - Not Found
  if (error?.message === "NOT_FOUND") {
    return notFound();
  }

  // Error - Other
  if (error) {
    return (
      <div className="detail-bg">
        <div
          className="container"
          style={{ padding: "100px 20px", textAlign: "center" }}
        >
          <div
            style={{
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "10px",
              padding: "30px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <h2 style={{ color: "#856404", marginBottom: "15px" }}>
              ⚠️ خطا در دریافت اطلاعات
            </h2>
            <p style={{ color: "#856404", marginBottom: "20px" }}>
              {error.message}
            </p>
            <button
              onClick={() => router.reload()}
              style={{
                padding: "12px 30px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginRight: "10px",
              }}
            >
              🔄 تلاش مجدد
            </button>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "12px 30px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              equipment={house?.equipment}
            />
            <PayService />
            <Offer />
            <CommentWrapper comments={house?.comments} />
          </div>

          {/* call */}
          <div className="sticky">
            <VisitBox
              authorName={house?.author}
              authorEmail={house?.author_email}
              authorPhone={house?.contact_phone}
              onVisitReq={() => setIsModalOpen(true)}
              isOwner={house?.isAuthor}
              isMyVisit={house?.isMyVisit}
            />
          </div>
        </section>
      </div>
      {isModalOpen && (
        <ModalVisitRequest
          onClose={() => setIsModalOpen(false)}
          id={id}
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
      {isLoading || !id ? <Loader /> : null}
    </div>
  );
};

export default HomePageDetail;

// export async function getServerSideProps(context) {
//   const { params } = context;
//   const cookies = context.req.cookies || {};
//   const token = cookies.token;

//   const res = await fetch(
//     `https://rentify.bonto.run/api/properties/${params.id}`,
//     {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
//   if (res.status !== 200) {
//     return {
//       notFound: true,
//     };
//   }

//   const data = await res.json();

//   return {
//     props: { houses: [data] },
//   };
// }
