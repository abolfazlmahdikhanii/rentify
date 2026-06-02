import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import styles from "../../styles/Homes.module.css";
import FilterHome from "@/components/templates/Homes/FilterHome/FilterHome";
import Tab from "@/components/module/Tab/Tab";
import TabItem from "@/components/module/Tab/TabItem";
import Home from "@/components/module/Home/Home";
import NotFound from "@/components/module/NotFound/NotFound";
import { CompareContext } from "@/context/CompareContext";
import Loader from "@/components/module/Loader/Loader";
import { getProperties } from "@/service/propertyService";
import { userVerify } from "@/lib/userAuth";

const FilterModal = dynamic(
  () => import("@/components/module/FilterModal/FilterModal"),
  { ssr: false },
);

const buildUrl = (query) => {
  const page = query.page || 1;
  const limit = 8 * page;

  let url = `/api/properties?page=${page}&limit=${limit}`;

  if (query.sort) {
    url += `&sort=${query.sort}`;
  }

  if (query.minPrice) {
    url += `&minPrice=${query.minPrice}`;
  }

  if (query.maxPrice) {
    url += `&maxPrice=${query.maxPrice}`;
  }

 
  if (query.houseType) {
    if (Array.isArray(query.houseType)) {
      query.houseType.forEach((type) => {
        url += `&propertyType=${type}`;
      });
    } else {
      url += `&propertyType=${query.houseType}`;
    }
  }

  if (query.location) {
    url += `&city=${query.location}`;
  }

  if (query.cType) {
    url += `&listingType=${query.cType}`;
  }

  if (query.search) {
    url += `&search=${query.search}`;
  }

  return url;
};

// Fetcher function

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("خطا در دریافت اطلاعات");
  }

  return res.json();
};

const Homes = ({ fallbackData }) => {
  const { isCompare, addToCompare, compare, showCompare, toggleCompare } =
    useContext(CompareContext);
  const router = useRouter();
  const { query } = router;

  const [isFilter, setIsFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const [minPrice, setMinPrice] = useState(query.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(query.maxPrice || "");
  const [roomCount, setRoomCount] = useState(
    query.room ? parseInt(query.room) : 0,
  );
  const [withPhoto, setWithPhoto] = useState(false);
  const [houseType, setHouseType] = useState([query.houseType] || []);

  const page = parseInt(query.page) || 1;

  const apiUrl = useMemo(() => buildUrl(query), [query]);

  const {
    data: houses,
    error,
    isLoading,
  } = useSWR(apiUrl, fetcher, {
    fallbackData,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });
  const totalCount = houses?.total || 0;
  console.log(houses);
  const totalPage = totalCount ? Math.ceil(totalCount / 8) : 1;

  useEffect(() => {
    // Initialize state from query params
    const initialMinPrice = query.minPrice || "";
    const initialMaxPrice = query.maxPrice || "";
    const initialRoomCount = query.room ? parseInt(query.room) : 0;
    const initialWithPhoto = query.withPhoto === "true";
    const initialHouseType = query.houseType
      ? Array.isArray(query.houseType)
        ? query.houseType
        : [query.houseType]
      : [];

    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    setRoomCount(initialRoomCount);
    setWithPhoto(initialWithPhoto);
    setHouseType(initialHouseType);

    // Calculate filter count
    const count = calculateFilterCount(query);
    setFilterCount(count);

    // Handle compare state
    const fromCompare = router.query.from == "compare";
    if (!fromCompare && isCompare) {
      toggleCompare();
    }
  }, [router.query]);

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

  const filterHandler = (...filters) => {
    const {
      houseType,
      withPhoto,
      withVideo,
      agencyOnly,
      room,
      ejareMin,
      ejareMax,
    } = filters[0];

    const newQuery = { ...router.query };

    // House type
    if (houseType && houseType.length > 0) {
      const normalizedHouseType =
        typeof houseType === "string" ? [houseType] : houseType;
      newQuery.houseType = normalizedHouseType.filter(Boolean);
    } else {
      delete newQuery.houseType;
    }

    // Other filters
    if (withPhoto) {
      newQuery.withPhoto = "true";
    } else {
      delete newQuery.withPhoto;
    }

    if (withVideo) {
      newQuery.withVideo = "true";
    } else {
      delete newQuery.withVideo;
    }

    if (agencyOnly) {
      newQuery.agencyOnly = "true";
    } else {
      delete newQuery.agencyOnly;
    }

    if (room && !isNaN(room)) {
      newQuery.room = room.toString();
    } else {
      delete newQuery.room;
    }

    if (ejareMin) {
      newQuery.minPrice = ejareMin;
    } else {
      delete newQuery.minPrice;
    }

    if (ejareMax) {
      newQuery.maxPrice = ejareMax;
    } else {
      delete newQuery.maxPrice;
    }

    // Reset page to 1 when filtering
    delete newQuery.page;

    router.push({
      pathname: "/homes",
      query: newQuery,
    });

    setIsFilter(false);
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setRoomCount(0);
    setWithPhoto(false);
    setHouseType([]);

    router.push({
      pathname: "/homes",
      query: {},
    });

    setFilterCount(0);
    setIsFilter(false);
  };

  const handleShowMore = () => {
    router.push({
      pathname: "/homes",
      query: { ...query, page: page + 1 },
    });
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return (
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
            خطا در دریافت اطلاعات
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
            }}
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  const housesList = houses.properties || [];

  return (
    <div>
      <FilterHome
        searchVal={search}
        setFilter={setIsFilter}
        count={filterCount}
      />
      <div className="container">
        <h3 className={styles.title}>رهن و اجاره آپارتمان در ایران</h3>
        {housesList.length > 0 && (
          <Tab size="sm">
            <TabItem
              title="بروزترین"
              value="newest"
              tabActive={query.sort || "newest"}
              href={"/homes?sort=newest"}
            />
            <TabItem
              title="ارزان ترین"
              value="cheap"
              tabActive={query.sort}
              href={"/homes?sort=cheap"}
            />
            <TabItem
              title="گران ترین"
              value="expensive"
              tabActive={query.sort}
              href={"/homes?sort=expensive"}
            />
          </Tab>
        )}

        <div className={`homes-grid ${styles.homeGridContainer}`}>
          {housesList.length ? (
            housesList.map((home) => (
              <Home
                key={home._id}
                {...home}
                isCompare={isCompare}
                checked={compare.some(
                  (item) => item._id.toString() === home._id.toString(),
                )}
                onChecked={(e) => addToCompare(home)}
              />
            ))
          ) : (
            <NotFound />
          )}
        </div>

        {housesList.length > 0 && totalPage > page && (
          <div className={styles.btnMore}>
            <button
              className={`btn btn-primary ${styles.btnMore__btn}`}
              onClick={handleShowMore}
              disabled={totalPage === page}
            >
              نمایش آگهی‌های بیشتر
            </button>
          </div>
        )}
      </div>

      {isCompare && (
        <div className={styles.homesFooter}>
          <button
            className={`btn ${styles.secondaryButton}`}
            type="button"
            onClick={() => router.back()}
          >
            بازگشت به آگهی‌های ذخیره شده
          </button>
          <button
            className={`btn btn-primary ${styles.btnPrimary}`}
            type="button"
            onClick={() => {
              router.back();
              showCompare();
            }}
          >
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
      const user=userVerify(req,res);
  const data = await getProperties({
    ...query,
    page: query.page || 1,
    limit: 8,
  },user._id);

  return {
    props: {
      fallbackData: JSON.parse(JSON.stringify(data)),
    },
  };
}
