import Header from "@/components/module/Header/Header";
import "@/styles/globals.css";
import "@/styles/panel.css";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import Footer from "@/components/module/Footer/Footer";
import { CompareProvider } from "@/context/CompareContext";
import { AuthProvider } from "@/context/AuthContext";
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const noFooterRoutes = ["user-panel", "register-step", "login"];
  const noHeaderRoutes = ["login"];
  const shouldShowFooter = !noFooterRoutes.some((route) =>
    router.pathname.includes(route)
  );
  const shouldShowHeader = !noHeaderRoutes.some((route) =>
    router.pathname.includes(route)
  );
  return (
    <ProgressProvider
      height="4px"
      color="#0d6efd"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <AuthProvider>
        <CompareProvider>
          {shouldShowHeader && <Header />}
          <Component {...pageProps} />
          {shouldShowFooter && <Footer />}
          <ToastContainer />
        </CompareProvider>
      </AuthProvider>
    </ProgressProvider>
  );
}
