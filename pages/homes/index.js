import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "../../styles/Homes.module.css";
import db from "../../data/db.json";
import FilterHome from "@/components/templates/Homes/FilterHome/FilterHome";
import Tab from "@/components/module/Tab/Tab";
import TabItem from "@/components/module/Tab/TabItem";
import Home from "@/components/module/Home/Home";
import Image from "next/image";
import { useRouter } from "next/router";
const FilterModal = dynamic(
  () => import("@/components/module/FilterModal/FilterModal"),
  { ssr: false }
);
import NotFound from "@/components/module/NotFound/NotFound";
import Link from "next/link";
import { CompareContext } from "@/context/CompareContext";
import dynamic from "next/dynamic";
const Homes = ({
  houses = [],
  query = {},
  page = 1,
  totalPage = 1,
  minPrices,
  maxPrices,
  roomCounts,
}) => {
  const { isCompare, addToCompare, compare, showCompare, toggleCompare } =
    useContext(CompareContext);
  const router = useRouter();
  const [isFilter, setIsFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const [pages, setPages] = useState(page || 1);
  const [minPrice, setMinPrice] = useState(query.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(query.maxPrice || "");
  const [roomCount, setRoomCount] = useState(
    query.room ? parseInt(query.room) : 0
  );

  const [withPhoto, setWithPhoto] = useState(false);

  const [houseType, setHouseType] = useState([query.houseType] || []);
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
  
    // Calculate filter count based on query params
    const count = calculateFilterCount(query);
    setFilterCount(count);
  
    // Handle compare state
    const fromCompare = router.query.from === "compare";
    if (!fromCompare && isCompare) {
      toggleCompare();
    }
  }, [router.query]);
  
  const calculateFilterCount = (queryParams) => {
    let count = 0;
  
    // Price filters
    if (queryParams.minPrice) count++;
    if (queryParams.maxPrice) count++;
  
    // Room count filter
    if (queryParams.room && parseInt(queryParams.room) > 0) count++;
  
    // Other filters
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
      houseType, // Should be ["Villa", "Apartment"] (not split into chars)
      withPhoto,
      withVideo,
      agencyOnly,
      room,
      ejareMin,
      ejareMax,
    } = filters[0];

    // Create query object
    const query = { ...router.query };

    // Ensure houseType is an array of valid strings (not split chars)
    if (houseType && houseType.length > 0) {
      // If houseType is a string (e.g., "Villa"), convert it to an array
      const normalizedHouseType =
        typeof houseType === "string" ? [houseType] : houseType;
      // Filter out empty values (optional)
      query.houseType = normalizedHouseType.filter(Boolean);
    } else {
      delete query.houseType;
    }

    // Rest of the filters (unchanged)
    if (withPhoto) {
      query.withPhoto = "true";
    } else {
      delete query.withPhoto;
    }

    if (withVideo) {
      query.withVideo = "true";
    } else {
      delete query.withVideo;
    }

    if (agencyOnly) {
      query.agencyOnly = "true";
    } else {
      delete query.agencyOnly;
    }

    if (room && !isNaN(room)) {
      query.room = room.toString();
    } else {
      delete query.room;
    }

    if (ejareMin) {
      query.minPrice = ejareMin;
    } else {
      delete query.minPrice;
    }

    if (ejareMax) {
      query.maxPrice = ejareMax;
    } else {
      delete query.maxPrice;
    }

    // Update URL without page reload
    router.push({
      pathname: "/homes",
      query: query,
    });

    filterCountHandler();
    setIsFilter(false);
  };
  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setRoomCount(0);

    setWithPhoto(false);
    setHouseType([]);
    filterHandler({
      houseType: [],
      withPhoto: false,
      withVideo: false,
      agencyOnly: false,
      roomCount: 0,
      minPrice: "",
      maxPrice: "",
    });
    setFilterCount(0);
    setIsFilter(false);
  };
  const handleShowMore = () => {
    setIsLoading(true);
    router.push({
      pathname: "/homes",
      query: { ...query, page: page + 1 },
    });
  };
  return (
    <div>
      <FilterHome
        // onSearch={setSearch}
        searchVal={search}
        setFilter={setIsFilter}
        count={filterCount}
      />
      <div className="container">
        <h3 className={styles.title}>رهن و اجاره آپارتمان در ایران</h3>
        {houses.length > 0 && (
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
          {houses.length ? (
            houses?.map((home, i) => (
              <Home
                key={home.id}
                {...home}
                isCompare={isCompare}
                checked={compare.some((item) => item.id === home.id)}
                onChecked={(e) => addToCompare(home)}
              />
            ))
          ) : (
            <NotFound />
          )}
        </div>

        {houses.length>0 && totalPage > page && (
          <div className={styles.btnMore}>
            <button
              className={`btn btn-primary ${styles.btnMore__btn}`}
              onClick={handleShowMore}
              disabled={page && +totalPage === page}
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

export async function getServerSideProps(context) {
  const { params, query } = context;

  const page = query.page || 1;
  const limit = 8 * page; // 8 items per page
  const start = (page - 1) * limit;
  // Get total count
  const countRes = await fetch("http://localhost:5000/api/properties");
  const total = await countRes.json();

  let url = `http://localhost:5000/api/properties?limit=${limit}`;

  // Add sorting if specified
  if (query.sort === "newest") {
    url += `&_sort=created_date&_order=desc`;
  } else if (query.sort === "cheap") {
    url += `&_sort=price,ejare_price&_order=asc`;
  } else if (query.sort === "expensive") {
    url += `&_sort=pric,ejare_pricee&_order=desc`;
  }
  // Add filter if specified
  if (query.minPrice) {
    url += `&price_gte=${query.minPrice}`;
  }
  if (query.maxPrice) {
    url += `&price_lte=${query.maxPrice}`;
  }
  if (query.room) {
    url += `&roomCount=${query.room}`;
  }
  if (query.houseType) {
    if (Array.isArray(query.houseType) && query.houseType.length > 0) {
      const newHouseType = ["Villa", "House", "Apartment"];
      const filterType = query.houseType.filter((item, i) =>
        newHouseType.includes(item)
      );
      url += filterType.map((item) => `&type=${item}`).join("");
    } else {
      url += `&type=${query.houseType}`;
    }
  }
  console.log(url);
  const res = await fetch(url);

  if (res.status !== 200) {
    return {
      notFound: true,
    };
  }
  const data = await res.json();

  const totalPage = Math.ceil(total.length / 8);

  return {
    props: {
      houses: data.data,
      page: Number(query.page),
      totalPage,
      query,
    },
  };
}
export default Homes;
