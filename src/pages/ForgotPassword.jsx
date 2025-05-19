import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Button, Input } from "@windmill/react-ui";

//internal import
import Error from "@/components/form/others/Error";
import { notifyError, notifySuccess } from "@/utils/toast";
import EmployeeServices from "@/services/EmployeeServices";
import ImageLight from "@/assets/img/forgot-password-office.jpeg";
import ImageDark from "@/assets/img/forgot-password-office-dark.jpeg";
import Loader from "@/components/sprinkleLoader/Loader";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email }) => {
    try {
      setLoading(true);
      const res = await EmployeeServices.forgotEmployeePassword({ email });
      
      setLoading(false);
      notifySuccess(res.message || "OTP has been sent to your email");
      
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      setLoading(false);
      notifyError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="flex items-center min-h-screen p-2 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-20 md:w-5/12 md:h-auto">
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/70 to-indigo-700/70 flex items-center justify-center">
              <div className="px-4 py-2 text-center">
                <h1 className="text-2xl font-bold text-white mb-1">Infidea CRM</h1>
                <p className="text-white text-sm opacity-90">
                  Your all-in-one customer relationship solution
                </p>
                <div className="mt-2 flex flex-col space-y-0.5">
                  <div className="flex items-center text-white text-xs">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Seamless collaboration</span>
                  </div>
                  <div className="flex items-center text-white text-xs">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center text-white text-xs">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Enterprise security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <main className="flex items-center justify-center p-3 md:w-7/12">
            <div className="w-full max-w-xs mx-auto">
              <h1 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                Forgot Password
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Please enter your email to receive a verification code
              </p>

              <form onSubmit={handleSubmit(submitHandler)}>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-0.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <Input
                      {...register("email", {
                        required: "Email is required!",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address!",
                        },
                      })}
                      type="email"
                      placeholder="your@email.com"
                      className="pl-7 py-1 h-7 text-sm w-full"
                    />
                  </div>
                  <Error errorName={errors.email} />
                </div>
                
                {loading ? (
                  <div className="flex justify-center my-1">
                    <Loader size="20" />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full my-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-1 px-3 rounded-md transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm h-7"
                  >
                    Send Verification Code
                  </Button>
                )}
              </form>

              <div className="flex justify-center mt-3 text-xs">
                <Link
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  to="/login"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
