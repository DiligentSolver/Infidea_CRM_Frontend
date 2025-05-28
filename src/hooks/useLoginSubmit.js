import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import Cookies from "js-cookie";

//internal import
import { AdminContext } from "@/context/AdminContext";
import EmployeeServices from "@/services/EmployeeServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const { dispatch } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Function to calculate cookie expiration time (9 PM Indian time)
  const getNext9PMIST = () => {
    const now = new Date();

    // Get current time in UTC+5:30 (IST)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(now.getTime() + istOffset);

    // Set target time to 9 PM IST today
    const targetIST = new Date(nowIST);
    targetIST.setHours(21, 0, 0, 0);

    // If current IST time is past 9 PM, set to 9 PM tomorrow
    if (nowIST > targetIST) {
      targetIST.setDate(targetIST.getDate() + 1);
    }

    // Convert targetIST back to UTC
    const targetUTC = new Date(targetIST.getTime() - istOffset);

    return targetUTC;
  };

  // Function to set admin cookie with consistent configuration
  const setAdminCookie = (data) => {
    const next9PMIST = getNext9PMIST();
    Cookies.set("adminInfo", JSON.stringify(data), {
      expires: next9PMIST,
      sameSite: "None",
      secure: true,
    });
  };

  // Function to remove admin cookie
  const removeAdminCookie = () => {
    Cookies.remove("adminInfo", { sameSite: "None", secure: true });
  };

  const onSubmit = async ({
    name,
    email,
    password,
    confirmPassword,
    mobile,
    otp,
    role,
    employeeCode,
  }) => {
    setLoading(true);

    try {
      if (location.pathname === "/login") {
        // Check if we're in OTP verification mode
        if (otpRequired && userId) {
          // Verify OTP
          if (!otp) {
            setLoading(false);
            return notifyError("OTP is required!");
          }

          const res = await EmployeeServices.verifyLoginOtp({ userId, otp });
          if (res) {
            notifySuccess("Login successful!");
            dispatch({ type: "USER_LOGIN", payload: res });
            setAdminCookie(res);

            // Reset OTP state
            setOtpRequired(false);
            setUserId(null);
            setUserEmail("");

            // Redirect to the intended page or dashboard
            const redirectTo = location.state?.from || "/dashboard";
            navigate(redirectTo, { replace: true });
          }
        } else {
          // Normal login flow
          if (!email || !password) {
            setLoading(false);
            return notifyError("Email and password are required!");
          }

          const res = await EmployeeServices.loginEmployee({ email, password });
          if (res) {
            if (res.requiresOtp) {
              // OTP flow required
              notifySuccess(
                res.message ||
                  "Verification code has been sent to administrators"
              );
              setOtpRequired(true);
              setUserId(res.userId);
              setUserEmail(res.email);
              // Clear password field
              setValue("password", "");
            } else {
              // Direct login
              notifySuccess("Login Success!");
              dispatch({ type: "USER_LOGIN", payload: res });
              setAdminCookie(res);

              // Redirect to the intended page or dashboard
              const redirectTo = location.state?.from || "/dashboard";
              navigate(redirectTo, { replace: true });
            }
          }
        }
      }

      if (location.pathname === "/signup") {
        // Check required fields for signup
        if (!name || !email || !password || !mobile) {
          setLoading(false);
          return notifyError("Required fields are missing!");
        }

        // Make sure passwords match
        if (password !== confirmPassword) {
          setLoading(false);
          return notifyError("Passwords do not match!");
        }

        const res = await EmployeeServices.registerEmployee({
          name,
          email,
          password,
          mobile,
          role,
          employeeCode,
        });

        // Check if signup was successful and redirect to login page
        if (res && res.success === true) {
          notifySuccess(res.message || "Account created successfully!");
          navigate("/login", { replace: true });
          return res;
        }
      }

      if (location.pathname === "/forgot-password") {
        if (!email) {
          setLoading(false);
          return notifyError("Email is required!");
        }

        const res = await EmployeeServices.forgotEmployeePassword({ email });
        if (res) {
          notifySuccess(res.message || "OTP sent to your email");
          return res; // Return the response for further processing
        } else {
          throw new Error("Failed to send OTP");
        }
      }

      if (location.pathname === "/reset-password") {
        if (!email || !otp || !password) {
          setLoading(false);
          return notifyError("Email, OTP and password are required!");
        }

        const res = await EmployeeServices.resetEmployeePassword({
          email,
          otp,
          newPassword: password,
        });

        notifySuccess(res.message || "Password reset successful");
        return res; // Return the response for the component to handle redirection
      }
    } catch (err) {
      notifyError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset OTP verification state
  const resetOtpState = () => {
    setOtpRequired(false);
    setUserId(null);
    setUserEmail("");
  };

  // Resend Login OTP
  const resendLoginOtp = async () => {
    try {
      if (!userEmail) {
        return { success: false, message: "Email not found" };
      }

      const res = await EmployeeServices.resendLoginOtp({ email: userEmail });
      return { success: true, ...res };
    } catch (err) {
      console.error("Resend OTP error:", err);
      // Return a structured error object instead of throwing
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to resend OTP",
      };
    }
  };

  return {
    onSubmit,
    register,
    handleSubmit,
    errors,
    loading,
    otpRequired,
    userId,
    userEmail,
    resetOtpState,
    setValue,
    resendLoginOtp,
    setAdminCookie,
    removeAdminCookie,
  };
};

export default useLoginSubmit;
