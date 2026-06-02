import { useRouter } from "next/router";
import { createContext, useContext } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { toastOption } from "@/helper/helper";

export const AuthContext = createContext();

const refreshToken = async () => {
  try {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
};

const fetcher = async (url) => {
  const res = await fetch(url, { method: "GET" });
  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      const retried = await fetch(url, { method: "GET" });
      if (!retried.ok) {
        const error = new Error("Error fetching");
        error.status = retried.status;
        error.info = await retried.json().catch(() => null);
        throw error;
      }
      return retried.json();
    }
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const error = new Error("Error fetching");
    error.status = res.status;
    error.info = await res.json().catch(() => null);
    throw error;
  }

  return res.json();
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWR("/api/auth/me", fetcher, {
    revalidateOnFocus: false,
  
  });

  const user = data?.user ?? null;
  const loading = isLoading;

  const setUser = (value) => mutate({ user: value }, false);
  const refetchUser = () => mutate();

  const logoutHandler = async () => {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });
      if (res.ok) {
        mutate({ user: null }, false);
        toast.success("با موفقیت خارج شدید", toastOption);
        router.replace("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, refetchUser, logoutHandler, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};



export default AuthContext;
