import { Button, Input } from "@windmill/react-ui";
import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import EmployeeServices from "@/services/EmployeeServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import ImageLight from "@/assets/img/forgot-password-office.jpeg";
import ImageDark from "@/assets/img/forgot-password-office-dark.jpeg";
import Loader from "@/components/sprinkleLoader/Loader";

const ResetPassword = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const password = useRef("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30); // Start with 30 seconds by default
  
  useEffect(() => {
    // Get email from URL query parameters first, then try location state as fallback
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);
  
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  password.current = watch("newPassword");

  const submitHandler = async ({ otp, newPassword }) => {
    setLoading(true);

    try {
      const res = await EmployeeServices.resetEmployeePassword({ 
        email, 
        otp, 
        newPassword 
      });
      
      notifySuccess(res.message || "Password reset successful");
      setLoading(false);
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setLoading(false);
      notifyError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to reset password");
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);
      const res = await EmployeeServices.resendEmployeeForgotPasswordOtp({ email });
      notifySuccess(res.message || "OTP resent successfully");
      setResending(false);
      setTimer(30);
    } catch (err) {
      setResending(false);
      notifyError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Reset Password
              </h1>

              {!email ? (
                <div className="text-red-500 mb-4">
                  Email not found. Please go back to the forgot password page.
                </div>
              ) : (
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="text-gray-700 dark:text-gray-300 mb-4">
                    Resetting password for: <strong>{email}</strong>
                  </div>
                  
                  <InputArea
                    required={true}
                    register={register}
                    label="OTP"
                    name="otp"
                    type="text"
                    placeholder="Enter OTP Code"
                  />
                  <Error errorName={errors.otp} />
                  <div className="mb-4">
                    {timer > 0 ? (
                      <div className="flex items-center">
                        <p className="text-sm text-emerald-500 dark:text-emerald-400">
                          Resend OTP in {timer} seconds
                        </p>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleResendOtp}
                        disabled={resending}
                        className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                      >
                        {resending ? (
                          <span className="flex items-center">
                            <Loader size="20" />
                          </span>
                        ) : (
                          "Resend OTP"
                        )}
                      </button>
                    )}
                  </div>
                  
                  
                  <InputArea
                    required={true}
                    register={register}
                    label="New Password"
                    name="newPassword"
                    type="password"
                    placeholder="Enter New Password"
                    className="mb-4"
                  />
                  <Error errorName={errors.newPassword} />
                  
                  <div className="mb-4"></div>
                  
                  <InputArea
                    required={true}
                    register={register}
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm New Password"
                    validation={{
                      validate: (value) =>
                        value === password.current || "The passwords do not match",
                    }}
                  />
                  <Error errorName={errors.confirmPassword} />
                  
                  {loading ? (
                    <div className="mt-4">
                      <Loader size="40" />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      className="mt-4 h-12 w-full"
                    >
                      Reset Password
                    </Button>
                  )}
                </form>
              )}
              
              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                  to="/login"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
