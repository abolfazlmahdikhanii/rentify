import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

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
      const response = await fetch("http://localhost:5000/api/auth/get-me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };
  const logoutHandler = () => {
    setUser(null);
    setLoading(false);
    deleteCookie("token");
    route.replace("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser,logoutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};
