import Home from "@/components/module/Home/Home";
import React, { useContext, useState } from "react";
import ModalProperty from "./ModalProperty";
import { CompareContext } from "@/context/CompareContext";

const CompareContent = ({ items, homes }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const {
    isCompare,
    toggleCompare,
    addToCompare,
    compare,
    isShowCompare,
    showCompare,
    removeFromCompare,
  } = useContext(CompareContext);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const handleDragStart = (e, index) => {
    setDraggedItem(items[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (index) => {
    const draggedOverItem = items[index];

    // If the item is dragged over itself, ignore
    if (draggedItem === draggedOverItem) {
      return;
    }

    // Filter out the dragged item
    let newItems = items.filter((item) => item !== draggedItem);

    // Insert the dragged item after the dragged over item
    newItems.splice(index, 0, draggedItem);

    setItems(newItems);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };
  const filterOptions = [
    { id: 1, name: "متراژکل" },
    { id: 2, name: "اتاق خواب" },
    { id: 3, name: "طبقه" },
    { id: 4, name: "طبقات آپارتمان" },
    { id: 5, name: "سرویس بهداشتی" },
    { id: 6, name: "حمام", active: true },
    { id: 7, name: "موقعیت مکانی" },
    { id: 8, name: "سال ساخت", active: true },
    { id: 9, name: "انباری" },
    { id: 10, name: "پارکینگ" },
    { id: 11, name: "جنس کف" },
  ];
  console.log(homes);
  return (
    <div className="container">
      <div className="property-comparison-container">
        <div className="header">
          <h2 className="titleProperty">مقایسه املاک</h2>
          <div className="filter-icon-container">
            <button className="filter-icon-button" onClick={toggleFilters}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M2 2.5c0-.56.44-1 1-1h18c.55 0 1 .44 1 1v3c0 .29-.13.56-.35.75l-6.66 5.7v7.54c0 .37-.22.72-.56.89l-4 2c-.31.15-.68.13-.97-.04-.3-.18-.48-.5-.49-.84l-.15-9.56L2.3 6.23c-.22-.19-.35-.47-.35-.76v-3zm2 1v1.54l6.503 5.7c.21.18.33.45.34.73l.13 8.41 2.02-1.02v-7.39c0-.3.12-.57.34-.76L19.983 5V3.45h-16z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-options">
            {filterOptions?.map((option) => (
              <button
                key={option.id}
                className={`filter-button ${option.active ? "active" : ""}`}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="compare-house">
        <button className="compare-btn" onClick={() => setIsShowModal(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="66"
            height="67"
            fill="none"
            viewBox="0 0 66 67"
          >
            <path
              fill="#A9ABAF"
              fillRule="evenodd"
              d="M33 .5C14.775.5 0 15.275 0 33.5s14.775 33 33 33 33-14.775 33-33S51.225.5 33 .5m-3 30v-15h6v15h15v6H36v15h-6v-15H15v-6z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        {homes.map((home) => (
          <Home
            key={home.id}
            {...home}
            isMyCompare={true}
            remove={() => removeFromCompare(home.id)}
          />
        ))}
      </div>
      <div className="specs-wrapper">
        <div
          className="spec-row"
          draggable
          onDragStart={(e) => handleDragStart(e, 0)}
          onDragOver={() => handleDragOver(0)}
          onDragEnd={handleDragEnd}
        >
          <div className="spec-label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={18}
              height={18}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            متراژ{" "}
          </div>
          {homes.map((item) => (
            <div className="spec-value">{item?.building_area || "---"}</div>
          ))}
        </div>

        <div className="spec-row">
          <div className="spec-label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={18}
              height={18}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            اتاق خواب{" "}
          </div>
          {homes.map((item) => (
            <div className="spec-value">{item?.bedrooms || "---"}</div>
          ))}
        </div>

        <div className="spec-row">
          <div className="spec-label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={18}
              height={18}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            سال ساخت{" "}
          </div>
          {homes.map((item) => (
            <div className="spec-value">{item?.house_year?`${item?.house_year} سال` : "---"}</div>
          ))}
        </div>

        <div className="spec-row">
          <div className="spec-label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={18}
              height={18}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            سرویس بهداشتی{" "}
          </div>
          {homes.map((item) => (
            <div className="spec-value">{item?.bathrooms || "---"} عدد</div>
          ))}
        </div>

        <div className="spec-row">
          <div className="spec-label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={18}
              height={18}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            حمام{" "}
          </div>
          {homes.map((item) => (
            <div className="spec-value">{item?.bathrooms || "---"} عدد</div>
          ))}
        </div>
      </div>
      {isShowModal && (
        <ModalProperty
          onClose={() => setIsShowModal(false)}
          onConfirm={() => setIsShowModal(false)}
        >
          <div className="fav-grid">
            {items?.map((home) => (
              <Home
                key={home.id}
                {...home}
                isBorder={true}
                isCompare={isCompare}
                checked={compare.some((item) => item.id === home.id)}
                onChecked={(e) => addToCompare(home)}
              />
            ))}
          </div>
        </ModalProperty>
      )}
    </div>
  );
};

export default CompareContent;
