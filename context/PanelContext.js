import { getStorage, saveStorage } from "@/helper/helper";

const { useContext, createContext, useState } = require("react");

export const PanelContext = createContext();

export const PanelProvider = ({ children }) => {
  const [isShowModal, setIsShow] = useState(false);

  const showModalLogout = () => {
    setIsShow(true);
  };
  const closeModalLogout = () => {
    setIsShow(false);
  };

  return (
    <PanelContext.Provider
      value={{
        isShowModal,
        showModalLogout,
        closeModalLogout,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};
