import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import ImageLight from "@/assets/img/login-office.jpeg";
import ImageDark from "@/assets/img/login-office-dark.jpeg";
import useLoginSubmit from "@/hooks/useLoginSubmit";
import Loader from "@/components/sprinkleLoader/Loader";

const Login = () => {
  const { t } = useTranslation();
  const { 
    onSubmit, 
    register, 
    handleSubmit, 
    errors, 
    loading, 
    otpRequired, 
    userEmail, 
    resetOtpState 
  } = useLoginSubmit();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
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
                <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  {otpRequired ? "Enter Verification Code" : "Welcome Back!"}
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
                  {otpRequired ? (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          A verification code has been sent to admin. Please enter the code below:
                        </p>
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Email: {userEmail}
                          </span>
                        </div>
                      </div>
                      
                      <InputArea
                        required={true}
                        register={register}
                        label="Verification Code"
                        name="otp"
                        type="text"
                        autoComplete="one-time-code"
                        placeholder="Enter verification code"
                      />
                      <Error errorName={errors.otp} />
                      
                      <div className="flex flex-col space-y-4 mt-6">
                        <Button
                          type="submit"
                          className="h-12 w-full"
                          disabled={loading}
                        >
                          {loading ? <Loader size="30" /> : "Verify"}
                        </Button>
                        
                        <Button
                          type="button"
                          className="h-12 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                          onClick={resetOtpState}
                        >
                          Back to Login
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <InputArea
                        required={true}
                        register={register}
                        label="Email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        placeholder="Email"
                      />
                      <Error errorName={errors.email} />
                      <div className="mt-6"></div>
                      <InputArea
                        required={true}
                        register={register}
                        label="Password"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        placeholder="Password"
                      />
                      <Error errorName={errors.password} />

                      {loading ? (
                        <div className="mt-4">
                          <Loader size="40" />
                        </div>
                      ) : (
                        <Button
                          type="submit"
                          className="mt-4 h-12 w-full"
                          to="/dashboard"
                        >
                          {t("LoginTitle")}
                        </Button>
                      )}
                      
                      <p className="mt-4">
                        <Link
                          className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                          to="/forgot-password"
                        >
                          {t("ForgotPassword")}
                        </Link>
                      </p>
                      <p className="mt-1">
                        <Link
                          className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                          to="/signup"
                        >
                          {t("CreateAccountTitle")}
                        </Link>
                      </p>
                    </>
                  )}
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
