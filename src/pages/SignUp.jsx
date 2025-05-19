import React, { useState, useEffect } from "react";
import { Button, Input } from "@windmill/react-ui";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// Internal imports
import Error from "@/components/form/others/Error";
import useCompanySubmit from "@/hooks/useCompanySubmit";
import ImageLight from "@/assets/img/create-account-office.jpeg";
import ImageDark from "@/assets/img/create-account-office-dark.jpeg";
import Loader from "@/components/sprinkleLoader/Loader";

const SignUp = () => {
  const { t } = useTranslation();
  const { onSubmit, register, handleSubmit, errors, loading } = useCompanySubmit();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    document.title = "Infidea CRM | Sign Up";
  }, []);

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
                Create Account
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Join Infidea CRM to manage your business effectively
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Company Name Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-0.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <Input
                      {...register("companyName", {
                        required: "Company name is required!",
                      })}
                      type="text"
                      placeholder="Your company name"
                      className="pl-7 py-1 h-7 text-sm w-full"
                    />
                  </div>
                  <Error errorName={errors.companyName} />
                </div>
                
                {/* Email Field */}
                <div>
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
                
                {/* Phone Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-0.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <Input
                      {...register("phone", {
                        required: "Phone number is required!",
                      })}
                      type="text"
                      placeholder="Phone number"
                      className="pl-7 py-1 h-7 text-sm w-full"
                    />
                  </div>
                  <Error errorName={errors.phone} />
                </div>
                
                {/* Password Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-0.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Input
                      {...register("password", {
                        required: "Password is required!",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="pl-7 pr-7 py-1 h-7 text-sm w-full"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  <Error errorName={errors.password} />
                </div>
                
                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-0.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Input
                      {...register("confirmPassword", {
                        required: "Confirm password is required!",
                        validate: (value) =>
                          value === watch("password") || "Passwords do not match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      className="pl-7 pr-7 py-1 h-7 text-sm w-full"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  <Error errorName={errors.confirmPassword} />
                </div>
                
                <div className="mt-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                      {...register("acceptTerms", {
                        required: "You must accept the terms and conditions",
                      })}
                    />
                    <span className="ml-1 text-xs text-gray-700 dark:text-gray-400">
                      I accept the Terms and Privacy Policy
                    </span>
                  </label>
                  <Error errorName={errors.acceptTerms} />
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
                    Create Account
                  </Button>
                )}
              </form>

              <div className="flex justify-center mt-3 text-xs">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    to="/login"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SignUp;