import Image from "next/image";
import React from "react";

const NotFound = () => {
  return (
   <div className="container">
     <div className="no-post">
      <Image
        src="/images/rafiki.png"
        width="651"
        height="350"
        className="no-post__img"
      />
      <h5 className="no-post__title">صفحه‌ی مورد نظر یافت نشد!</h5>
      <p className="no-post__txt">
        این صفحه در رنتی‌فای یافت نشد. لطفا به صفحه اصلی مراجعه کنید تا املاک
        مورد نظر خود را پیدا کنید{" "}
      </p>

      <button className="btn btn-primary no-post__btn">
        بازگشت به صفحه اصلی
      </button>
    </div>
   </div>
  );
};

export default NotFound;
