import { getStorage, saveStorage } from "@/helper/helper";

const { useContext, createContext, useState } = require("react");

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compare, setCompare] = useState(getStorage("compare") || []);
  const [isCompare, setIsCompare] = useState(getStorage("isCompare") || false);
  const [isShowCompare, setIsShowCompare] = useState(false);

  const addToCompare = (product) => {
    setCompare((prev) => {
      const isProductInCompare = prev.some((item) => item.id === product.id);
      let newCompare;

      if (isProductInCompare) {
        newCompare = prev.filter((item) => item.id !== product.id);
      } else {
        if (prev.length < 3) {
          newCompare = [...prev, product];
        } else {
          // Optional: Show a toast notification
          // toast.error("حداکثر ۳ مورد قابل مقایسه هستند");
          newCompare = prev;
        }
      }

      // Save to localStorage inside the setter function
      saveStorage("compare", newCompare);
      return newCompare;
    });
  };
  const compareHandler = () => {
    setIsCompare(true);
    saveStorage("isCompare", true);
  };
  const showCompare = () => {
    setIsShowCompare(true);
  };
  const removeFromCompare = (productId) => {
    setCompare((prev) => {
      const newCompare = prev.filter((item) => item.id !== productId);

      // Save to localStorage
      saveStorage("compare", newCompare);

      // Update showCompare state if needed
      if (newCompare.length < 1) {
        setIsShowCompare(false);
      }

      return newCompare;
    });
  };
  const toggleCompare = () => {
    setIsCompare(false);
    // localStorage.removeItem("compare")
    saveStorage("isCompare", false);
  };

  return (
    <CompareContext.Provider
      value={{
        compare,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isCompare,
        showCompare,
        isShowCompare,
        compareHandler,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
