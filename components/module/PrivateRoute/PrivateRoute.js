import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

const PrivateRoute = ({ role, children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;

    // If there's no user, redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    // If role is specified and user doesn't have required role, redirect
    if (role && !role.includes(user.role)) {
      router.push("/"); // Consider having a dedicated unauthorized page
    }
  }, [user, role, router, loading]);

  // Don't render children while loading or if auth checks fail
  if (loading || !user || (role && !role.includes(user?.role))) {
    return null; // or return a loading spinner
  }

  return <>{children}</>;
};

export default PrivateRoute;