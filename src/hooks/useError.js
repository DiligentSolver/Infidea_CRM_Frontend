import { useContext } from "react";
import Cookies from "js-cookie";

//internal import
import { notifyError } from "@/utils/toast";
import { AdminContext } from "@/context/AdminContext";
import EmployeeServices from "@/services/EmployeeServices";

const useError = () => {
  const { dispatch } = useContext(AdminContext);

  const handleErrorNotification = async (err, time = 100) => {
    // console.log(`handleErrorNotification, error on ${from}`, err);
    if (err.includes("status code 401")) {
      // console.log("inside", err);
      try {
        dispatch({ type: "USER_LOGOUT" });
        // Remove authentication/session cookies
        Cookies.remove("adminInfo");
        Cookies.remove("company");
        Cookies.remove("token");
      } catch (error) {
        console.error("Logout error", error);
      }
    } else {
      notifyError(err, time);
    }
  };

  return {
    handleErrorNotification,
  };
};

export default useError;
