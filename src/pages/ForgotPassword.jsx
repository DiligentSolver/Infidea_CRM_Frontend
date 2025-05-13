import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

//internal import
import Error from "@/components/form/others/Error";
import useLoginSubmit from "@/hooks/useLoginSubmit";
import InputArea from "@/components/form/input/InputArea";
import ImageLight from "@/assets/img/forgot-password-office.jpeg";
import ImageDark from "@/assets/img/forgot-password-office-dark.jpeg";
import { notifyError } from "@/utils/toast";
import Loader from "@/components/sprinkleLoader/Loader";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { onSubmit, register, handleSubmit, errors, loading } = useLoginSubmit();
  const history = useHistory();

  const handleEmailSubmit = async (data) => {
    try {
      const res = await onSubmit(data);
      if (res) {
        window.location.href = `/reset-password?email=${encodeURIComponent(data.email)}`;
      } else {
        notifyError(res?.data?.message || res?.data?.error || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      notifyError(error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to send OTP");
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
                Forgot Password
              </h1>

              <form onSubmit={handleSubmit(handleEmailSubmit)}>
                <InputArea
                  required={true}
                  register={register}
                  name="email"
                  type="email"
                  placeholder="Email Address"
                />
                <Error errorName={errors.email} />

                {loading ? (
                  <div className="mt-4">
                    <Loader size="40" />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    block
                    className="mt-4 h-12"
                  >
                    Send OTP
                  </Button>
                )}
              </form>
              
              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                  to="/login"
                >
                  Already have an account? Login
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
