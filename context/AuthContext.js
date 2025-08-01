import { toastOption } from "@/helper/helper";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getCookie("token");
  const route = useRouter();
  useEffect(() => {
    fetchUser();
  }, [token]);
  // console.log(token);

  const fetchUser = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await fetch(
        "https://rentify-app.liara.run/api/auth/get-me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };
  const logoutHandler = () => {
    setLoading(true)
    route.replace("/");
    toast.success("با موفقیت خارج شدید", toastOption);
    setUser(null);
    setLoading(false);

    deleteCookie("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logoutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};
