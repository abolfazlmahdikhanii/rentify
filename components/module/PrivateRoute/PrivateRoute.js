import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import Loader from "../Loader/Loader";

const PrivateRoute = ({ role, children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const allowedRoles = role ? (Array.isArray(role) ? role : [role]) : null;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [user, allowedRoles, router, loading]);

  if (loading) return <Loader />;
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
};

export default PrivateRoute;
