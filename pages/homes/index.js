import Home from "@/components/module/Home/Home";
import Loader from "@/components/module/Loader/Loader";
import NotFound from "@/components/module/NotFound/NotFound";
import Tab from "@/components/module/Tab/Tab";
import TabItem from "@/components/module/Tab/TabItem";
import FilterHome from "@/components/templates/Homes/FilterHome/FilterHome";
import { CompareContext } from "@/context/CompareContext";
import { userVerify } from "@/lib/userAuth";
import { getProperties } from "@/service/propertyService";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import styles from "../../styles/Homes.module.css";

const FilterModal = dynamic(
  () => import("@/components/module/FilterModal/FilterModal"),
  { ssr: false },
);

const buildUrl = (query) => {
  const params = new URLSearchParams();
  params.set("page", parseInt(query.page) || 1);
  params.set("limit", "8");

  if (query.sort) params.set("sort", query.sort);
  if (query.minPrice) params.set("minPrice", query.minPrice);
  if (query.maxPrice) params.set("maxPrice", query.maxPrice);
  if (query.room) params.set("room", query.room);
  if (query.withPhoto) params.set("withPhoto", query.withPhoto);
  if (query.location) params.set("city", query.location);
  if (query.cType) params.set("listingType", query.cType);
  if (query.search) params.set("search", query.search);

  if (query.houseType) {
    const types = Array.isArray(query.houseType)
      ? query.houseType
      : [query.houseType];
    types.forEach((type) => params.append("propertyType", type));
  }

  return `/api/properties?${params.toString()}`;
};

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
  return res.json();
};

const Homes = ({ fallbackData }) => {
  const { isCompare, addToCompare, compare, showCompare, toggleCompare } =
    useContext(CompareContext);
  const router = useRouter();
  const { query } = router;

  const [isFilter, setIsFilter] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [minPrice, setMinPrice] = useState(query.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(query.maxPrice || "");
  const [roomCount, setRoomCount] = useState(
    query.room ? parseInt(query.room) : 0,
  );
  const [withPhoto, setWithPhoto] = useState(false);
  const [houseType, setHouseType] = useState(
    query.houseType ? (Array.isArray(query.houseType) ? query.houseType : [query.houseType]) : [],
  );

  const page = parseInt(query.page) || 1;
  const apiUrl = useMemo(() => buildUrl(query), [query]);

  const { data: houses, error, isLoading } = useSWR(apiUrl, fetcher, {
    fallbackData,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const totalCount = houses?.total || 0;
  const totalPage = totalCount ? Math.ceil(totalCount / 8) : 1;

 
  const buildSortUrl = (sortValue) => {
    const newQuery = { ...query, sort: sortValue };
    delete newQuery.page;
    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((v) => params.append(key, v));
      } else {
        params.set(key, val);
      }
    });
    return `/homes?${params.toString()}`;
  };

  const calculateFilterCount = (queryParams) => {
    let count = 0;
    if (queryParams.minPrice) count++;
    if (queryParams.maxPrice) count++;
    if (queryParams.room && parseInt(queryParams.room) > 0) count++;
    if (queryParams.withPhoto === "true") count++;
    if (queryParams.houseType) {
      count += Array.isArray(queryParams.houseType)
        ? queryParams.houseType.length
        : 1;
    }
    return count;
  };

  useEffect(() => {
    setMinPrice(query.minPrice || "");
    setMaxPrice(query.maxPrice || "");
    setRoomCount(query.room ? parseInt(query.room) : 0);
    setWithPhoto(query.withPhoto === "true");
    setHouseType(
      query.houseType
        ? Array.isArray(query.houseType)
          ? query.houseType
          : [query.houseType]
        : [],
    );
    setFilterCount(calculateFilterCount(query));

    const fromCompare = router.query.from === "compare";
    if (!fromCompare && isCompare) toggleCompare();
  }, [router.query]);

  const filterHandler = (filters) => {
    const { houseType, withPhoto, withVideo, agencyOnly, room, ejareMin, ejareMax } = filters;
    const newQuery = { ...router.query };

    if (houseType?.length > 0) {
      newQuery.houseType = (typeof houseType === "string" ? [houseType] : houseType).filter(Boolean);
    } else {
      delete newQuery.houseType;
    }

    withPhoto ? (newQuery.withPhoto = "true") : delete newQuery.withPhoto;
    withVideo ? (newQuery.withVideo = "true") : delete newQuery.withVideo;
    agencyOnly ? (newQuery.agencyOnly = "true") : delete newQuery.agencyOnly;
    room && !isNaN(room) ? (newQuery.room = room.toString()) : delete newQuery.room;
    ejareMin ? (newQuery.minPrice = ejareMin) : delete newQuery.minPrice;
    ejareMax ? (newQuery.maxPrice = ejareMax) : delete newQuery.maxPrice;

    delete newQuery.page;
    router.push({ pathname: "/homes", query: newQuery });
    setIsFilter(false);
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setRoomCount(0);
    setWithPhoto(false);
    setHouseType([]);
    setFilterCount(0);
    setIsFilter(false);
    router.push({ pathname: "/homes", query: {} });
  };

  const handleShowMore = () => {
    router.push({ pathname: "/homes", query: { ...query, page: page + 1 } });
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
        <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "10px", padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ color: "#856404", marginBottom: "15px" }}>خطا در دریافت اطلاعات</h2>
          <p style={{ color: "#856404", marginBottom: "20px" }}>{error.message}</p>
          <button onClick={() => router.reload()} style={{ padding: "12px 30px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  const housesList = houses?.properties || [];

  return (
    <div>
      <FilterHome setFilter={setIsFilter} count={filterCount} />
      <div className="container">
        <h3 className={styles.title}>رهن و اجاره آپارتمان در ایران</h3>

        {housesList.length > 0 && (
          <Tab size="sm">
            <TabItem title="بروزترین" value="newest" tabActive={query.sort || "newest"} href={buildSortUrl("newest")} />
            <TabItem title="ارزان ترین" value="cheap" tabActive={query.sort} href={buildSortUrl("cheap")} />
            <TabItem title="گران ترین" value="expensive" tabActive={query.sort} href={buildSortUrl("expensive")} />
          </Tab>
        )}

        <div className={`homes-grid ${styles.homeGridContainer}`}>
          {housesList.length ? (
            housesList.map((home) => (
              <Home
                key={home._id}
                {...home}
                isCompare={isCompare}
                checked={compare.some((item) => item._id.toString() === home._id.toString())}
                onChecked={() => addToCompare(home)}
              />
            ))
          ) : (
            <NotFound />
          )}
        </div>

        {housesList.length > 0 && totalPage > page && (
          <div className={styles.btnMore}>
            <button className={`btn btn-primary ${styles.btnMore__btn}`} onClick={handleShowMore}>
              نمایش آگهی‌های بیشتر
            </button>
          </div>
        )}
      </div>

      {isCompare && (
        <div className={styles.homesFooter}>
          <button className={`btn ${styles.secondaryButton}`} type="button" onClick={() => router.back()}>
            بازگشت به آگهی‌های ذخیره شده
          </button>
          <button className={`btn btn-primary ${styles.btnPrimary}`} type="button" onClick={() => { router.back(); showCompare(); }}>
            تایید
          </button>
        </div>
      )}

      {isFilter && (
        <FilterModal
          close={() => setIsFilter(false)}
          onFilter={filterHandler}
          minPrice={minPrice || query.minPrice}
          maxPrice={maxPrice || query.maxPrice}
          setMaxPrice={setMaxPrice}
          setMinPrice={setMinPrice}
          roomCount={query.room ? parseInt(query.room) : roomCount || 0}
          setRoomCount={setRoomCount}
          houseType={houseType || query.houseType}
          setHouseType={setHouseType}
          withPhoto={withPhoto || query.withPhoto}
          setWithPhoto={setWithPhoto}
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
};

export default Homes;

export async function getServerSideProps({ query, req, res }) {
  const user = await userVerify(req, res);
  const data = await getProperties({ ...query, page: query.page || 1, limit: 8 }, user?._id);
  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(data)),
    },
  };
}