import React, { useContext } from "react";
import styles from "../../../../styles/Detail.module.css";
import { Heart } from "lucide-react";
import { getDateRelative } from "@/helper/helper";
import { AuthContext } from "@/context/AuthContext";
const TitleInfo = ({ data }) => {
  const { user } = useContext(AuthContext);
  return (
    <div className={styles.detailInfo__Title}>
      <div className={styles.detailTitle}>
        <h1 className={styles.detailTitle__title}>{data?.title}</h1>
        <div className={styles.detailShare__btn}>
          <button className="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fill="#000"
                fillRule="evenodd"
                d="M4 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0M16 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0M16 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0"
                clipRule="evenodd"
              ></path>
              <path
                fill="#000"
                fillRule="evenodd"
                d="m13.474 5.88-6.5 3.5-.948-1.76 6.5-3.5zM12.526 15.88l-6.5-3.5.948-1.76 6.5 3.5z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {user?.role !== "admin" && (
            <button className="btn">
              <Heart
                size={22}
                fill={data?.isFavorite ? "#f00" : "#fff"}
                stroke={data?.isFavorite ? "#f00" : "#000"}
              />
            </button>
          )}
        </div>
      </div>
      <div className={styles.detailDate}>
        <p className={styles.detailDate__sub}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="#989BA0"
              fillRule="evenodd"
              d="M12 5a5.5 5.5 0 0 0-5.5 5.5c0 2.408 1.41 4.543 2.968 6.15A17.8 17.8 0 0 0 12 18.802q.185-.13.418-.302a18 18 0 0 0 2.114-1.85c1.558-1.607 2.968-3.742 2.968-6.15A5.5 5.5 0 0 0 12 5m0 15-.516.857-.003-.002-.005-.003-.019-.012a7 7 0 0 1-.289-.186 19.754 19.754 0 0 1-3.136-2.612C6.34 16.297 4.5 13.682 4.5 10.5a7.5 7.5 0 1 1 15 0c0 3.182-1.84 5.797-3.532 7.542a19.8 19.8 0 0 1-3.136 2.612 12 12 0 0 1-.29.186l-.018.012-.005.003-.002.001c-.001 0-.002 0-.517-.856m0 0 .515.857a1 1 0 0 1-1.03 0z"
              clipRule="evenodd"
            ></path>
            <path
              fill="#989BA0"
              fillRule="evenodd"
              d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0"
              clipRule="evenodd"
            ></path>
          </svg>
          {data?.location?.address || data?.locationHouse}
        </p>
        <p className={styles.detailDate__sub}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 22 22"
          >
            <path
              fill="#989BA0"
              fillRule="evenodd"
              d="M11 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18M0 11C0 4.925 4.925 0 11 0s11 4.925 11 11-4.925 11-11 11S0 17.075 0 11"
              clipRule="evenodd"
            ></path>
            <path
              fill="#989BA0"
              fillRule="evenodd"
              d="m12 11.414 3.207-3.207-1.414-1.414-3.5 3.5A1 1 0 0 0 10 11v6.5h2z"
              clipRule="evenodd"
            ></path>
          </svg>
          {getDateRelative(data?.created_at)}
        </p>
      </div>
      <div className={styles.detailPrice}>
        <p className={styles.detailPrice__text}>
          رهن
          <span>
            {data?.price.toLocaleString()}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="13"
              fill="none"
              viewBox="0 0 13 7"
            >
              <path
                fill="#73767C"
                d="M10.611 3.996h.996q.76 0 .76-.508 0-.2-.075-.598-.066-.405-.155-.789l.56-.147q.09.376.163.826.081.45.081.7 0 .31-.147.583a1.13 1.13 0 0 1-.45.435 1.54 1.54 0 0 1-.737.162h-.996zm.332-3.65h.737v.738h-.737zm1.32 0H13v.738h-.737z"
              ></path>
              <path
                fill="#73767C"
                d="M8.395 5.862q.516 0 .796-.126a.7.7 0 0 0 .398-.368q.11-.25.11-.664V4.66h-.81q-.62 0-1.003-.369-.376-.368-.376-1.032 0-.45.17-.818.176-.369.486-.583a1.25 1.25 0 0 1 .715-.213q.42 0 .737.206.318.207.487.575.17.361.17.833v.737h.412l.045.34-.044.324h-.413v.044q0 .84-.45 1.327-.443.495-1.43.494h-.79v-.663zm-.31-2.603q0 .405.192.575.19.162.611.162H9.7V3.26q0-.45-.207-.7-.207-.258-.612-.258a.72.72 0 0 0-.59.265q-.206.258-.206.693M3.63 5.827h.207q.347 0 .428-.31L4.5 4.67q.162-.575.501-.9.34-.331.819-.332.383 0 .678.229.295.22.457.605.162.375.162.818 0 .546-.155.9-.155.346-.405.5a.9.9 0 0 1-.516.163q-.28 0-.56-.11a9 9 0 0 1-.885-.413 1.1 1.1 0 0 1-.347.265.94.94 0 0 1-.413.096h-.206zm1.24-.287q.53.273.752.361.22.088.42.088.25 0 .376-.184.125-.192.125-.715 0-.464-.184-.723-.184-.264-.538-.265a.66.66 0 0 0-.465.184q-.192.185-.295.56z"
              ></path>
              <path
                fill="#73767C"
                d="M3.593 6.491q-.73 0-1.01-.39-.28-.399-.28-1.165l-.008-.772h.575l.007.772q0 .398.045.575a.4.4 0 0 0 .191.25q.148.067.48.067h.11l.037.339-.037.324z"
              ></path>
              <path
                fill="#73767C"
                d="M1.113.947Q.7 1.787.7 2.51q0 .67.324 1.076Q1.357 4 2.027 4h.79q.5 0 .78-.118a.7.7 0 0 0 .399-.361q.117-.243.118-.671V.534h.575v2.315q0 .855-.45 1.334t-1.423.48h-.789q-.611 0-1.04-.303a1.9 1.9 0 0 1-.648-.796A2.6 2.6 0 0 1 .125 2.51q0-.9.501-1.829zM2.219.512h.737v.737H2.22z"
              ></path>
            </svg>
          </span>
        </p>
        <p className={styles.detailPrice__text}>
          اجاره
          <span>
            {data?.ejare_price.toLocaleString()}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="13"
              fill="none"
              viewBox="0 0 13 7"
            >
              <path
                fill="#73767C"
                d="M10.611 3.996h.996q.76 0 .76-.508 0-.2-.075-.598-.066-.405-.155-.789l.56-.147q.09.376.163.826.081.45.081.7 0 .31-.147.583a1.13 1.13 0 0 1-.45.435 1.54 1.54 0 0 1-.737.162h-.996zm.332-3.65h.737v.738h-.737zm1.32 0H13v.738h-.737z"
              ></path>
              <path
                fill="#73767C"
                d="M8.395 5.862q.516 0 .796-.126a.7.7 0 0 0 .398-.368q.11-.25.11-.664V4.66h-.81q-.62 0-1.003-.369-.376-.368-.376-1.032 0-.45.17-.818.176-.369.486-.583a1.25 1.25 0 0 1 .715-.213q.42 0 .737.206.318.207.487.575.17.361.17.833v.737h.412l.045.34-.044.324h-.413v.044q0 .84-.45 1.327-.443.495-1.43.494h-.79v-.663zm-.31-2.603q0 .405.192.575.19.162.611.162H9.7V3.26q0-.45-.207-.7-.207-.258-.612-.258a.72.72 0 0 0-.59.265q-.206.258-.206.693M3.63 5.827h.207q.347 0 .428-.31L4.5 4.67q.162-.575.501-.9.34-.331.819-.332.383 0 .678.229.295.22.457.605.162.375.162.818 0 .546-.155.9-.155.346-.405.5a.9.9 0 0 1-.516.163q-.28 0-.56-.11a9 9 0 0 1-.885-.413 1.1 1.1 0 0 1-.347.265.94.94 0 0 1-.413.096h-.206zm1.24-.287q.53.273.752.361.22.088.42.088.25 0 .376-.184.125-.192.125-.715 0-.464-.184-.723-.184-.264-.538-.265a.66.66 0 0 0-.465.184q-.192.185-.295.56z"
              ></path>
              <path
                fill="#73767C"
                d="M3.593 6.491q-.73 0-1.01-.39-.28-.399-.28-1.165l-.008-.772h.575l.007.772q0 .398.045.575a.4.4 0 0 0 .191.25q.148.067.48.067h.11l.037.339-.037.324z"
              ></path>
              <path
                fill="#73767C"
                d="M1.113.947Q.7 1.787.7 2.51q0 .67.324 1.076Q1.357 4 2.027 4h.79q.5 0 .78-.118a.7.7 0 0 0 .399-.361q.117-.243.118-.671V.534h.575v2.315q0 .855-.45 1.334t-1.423.48h-.789q-.611 0-1.04-.303a1.9 1.9 0 0 1-.648-.796A2.6 2.6 0 0 1 .125 2.51q0-.9.501-1.829zM2.219.512h.737v.737H2.22z"
              ></path>
            </svg>
          </span>
        </p>
      </div>
      <div className={styles.detailReport}>
        <p className={styles.detailReport__text}>
          شناسه آگهی: RNT-{data?.id.toString().padStart(3, 0)}
        </p>
        <p className={styles.detailReport__text}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="19"
            fill="none"
            viewBox="0 0 18 19"
          >
            <path
              fill="#45484B"
              fillRule="evenodd"
              d="M14.536 9.104a.75.75 0 0 1-.661.396h-7.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 .624 1.166L13.276 6.5 14.5 8.334a.75.75 0 0 1 .037.77M12.474 8l-.723-1.084a.75.75 0 0 1 0-.832L12.474 5H7.125v3z"
              clipRule="evenodd"
            ></path>
            <path
              fill="#45484B"
              fillRule="evenodd"
              d="M7.125 2.375v14.25h-1.5V2.375z"
              clipRule="evenodd"
            ></path>
          </svg>
          گزارش
        </p>
      </div>
    </div>
  );
};

export default TitleInfo;
