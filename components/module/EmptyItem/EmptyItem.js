import { PackageOpen } from "lucide-react";
import React from "react";

const EmptyItem = ({title}) => {
  return (
    <div className="no-comment">
      <PackageOpen size={50} />
      <p className="no-comment__text"> {title}...</p>
    </div>
  );
};

export default EmptyItem;
