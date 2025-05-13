import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import useLoginSubmit from "@/hooks/useLoginSubmit";
import ImageLight from "@/assets/img/create-account-office.jpeg";
import ImageDark from "@/assets/img/create-account-office-dark.jpeg";
import Loader from "@/components/sprinkleLoader/Loader";

// Field length constants based on industry standards
const FIELD_LIMITS = {
  NAME: { min: 3, max: 40 },
  EMPLOYEE_CODE: { min: 3, max: 10 },
  MOBILE: { exact: 10 },
  EMAIL: { max: 50 },
  PASSWORD: { min: 8, max: 16 },
};

const SignUp = () => {
  const { t } = useTranslation();
  const { onSubmit, register, handleSubmit, errors, loading } = useLoginSubmit();
  
  // Setting default role value
  React.useEffect(() => {
    register("role", { value: "Employee" });
  }, [register]);

  // Custom submit function with validation
  const validateAndSubmit = (data) => {
    let formErrors = {};
    let isValid = true;

    // Required fields check
    const requiredFields = ['name', 'employeeCode', 'mobile', 'email', 'password', 'confirm_password'];
    
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim === undefined || data[field].trim() === '') {
        formErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
        isValid = false;
      }
    }

    // Name validations
    if (data.name && (data.name.length < FIELD_LIMITS.NAME.min || data.name.length > FIELD_LIMITS.NAME.max)) {
      formErrors.name = `Full name must be between ${FIELD_LIMITS.NAME.min} and ${FIELD_LIMITS.NAME.max} characters`;
      isValid = false;
    }

    // Employee code validations
    if (data.employeeCode && (data.employeeCode.length < FIELD_LIMITS.EMPLOYEE_CODE.min || data.employeeCode.length > FIELD_LIMITS.EMPLOYEE_CODE.max)) {
      formErrors.employeeCode = `Employee code must be between ${FIELD_LIMITS.EMPLOYEE_CODE.min} and ${FIELD_LIMITS.EMPLOYEE_CODE.max} characters`;
      isValid = false;
    }

    // Mobile validations - exactly 10 digits
    if (data.mobile) {
      const mobileStr = data.mobile.toString();
      if (mobileStr.length !== FIELD_LIMITS.MOBILE.exact) {
        formErrors.mobile = `Mobile number must be exactly ${FIELD_LIMITS.MOBILE.exact} digits`;
        isValid = false;
      }
    }

    // Email validations
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (data.email) {
      if (!emailRegex.test(data.email)) {
        formErrors.email = "Please enter a valid email address";
        isValid = false;
      } else if (data.email.length > FIELD_LIMITS.EMAIL.max) {
        formErrors.email = `Email cannot exceed ${FIELD_LIMITS.EMAIL.max} characters`;
        isValid = false;
      }
    }

    // Password validations
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$/;
    if (data.password) {
      if (data.password.length < FIELD_LIMITS.PASSWORD.min) {
        formErrors.password = `Password must be at least ${FIELD_LIMITS.PASSWORD.min} characters long`;
        isValid = false;
      } else if (data.password.length > FIELD_LIMITS.PASSWORD.max) {
        formErrors.password = `Password cannot exceed ${FIELD_LIMITS.PASSWORD.max} characters`;
        isValid = false;
      } else if (!passwordRegex.test(data.password)) {
        formErrors.password = "Password must include at least one letter and one number";
        isValid = false;
      }
    }
    
    // Password match validation
    if (data.password && data.confirm_password && data.password !== data.confirm_password) {
      formErrors.confirm_password = "Passwords do not match";
      isValid = false;
    }
    
    if (!isValid) {
      // If validation fails, update the error state in useLoginSubmit
      for (const [key, value] of Object.entries(formErrors)) {
        errors[key] = { message: value };
      }
      return;
    }
    
    // Ensure employeeCode is uppercase before validation and submit
    if (data.employeeCode) {
      data.employeeCode = data.employeeCode.toUpperCase();
    }
    
    // If all is valid, submit the form
    onSubmit(data);
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/3">
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
          <main className="flex items-center justify-center p-6 md:w-2/3">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                {t("CreateAccount")}
              </h1>
              
              <form onSubmit={handleSubmit(validateAndSubmit)}>
                <div className="space-y-4">
                  <InputArea
                    register={register}
                    name="name" 
                    type="text"
                    placeholder="Enter your full name"
                    required={true}
                    minLength={FIELD_LIMITS.NAME.min}
                    maxLength={FIELD_LIMITS.NAME.max}
                  />
                  <Error errorName={errors.name} />
                  
                  <InputArea
                    register={register}
                    name="employeeCode"
                    type="text"
                    placeholder="Enter employee code"
                    required={true}
                    minLength={FIELD_LIMITS.EMPLOYEE_CODE.min}
                    maxLength={FIELD_LIMITS.EMPLOYEE_CODE.max}
                    onChange={e => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                  <Error errorName={errors.employeeCode} />
                  
                  <InputArea
                    register={register}
                    name="mobile"
                    type="text"
                    placeholder="Enter mobile number"
                    required={true}
                    maxLength={FIELD_LIMITS.MOBILE.exact}
                    pattern="[0-9]{10}"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      if (e.target.value.length > FIELD_LIMITS.MOBILE.exact) {
                        e.target.value = e.target.value.slice(0, FIELD_LIMITS.MOBILE.exact);
                      }
                    }}
                  />
                  <Error errorName={errors.mobile} />
                  
                  <InputArea
                    register={register}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required={true}
                    maxLength={FIELD_LIMITS.EMAIL.max}
                  />
                  <Error errorName={errors.email} />
                  
                  <InputArea
                    register={register}
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    autoComplete="new-password"
                    required={true}
                    minLength={FIELD_LIMITS.PASSWORD.min}
                    maxLength={FIELD_LIMITS.PASSWORD.max}
                  />
                  <Error errorName={errors.password} />
                  
                  <InputArea
                    register={register}
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    required={true}
                    minLength={FIELD_LIMITS.PASSWORD.min}
                    maxLength={FIELD_LIMITS.PASSWORD.max}
                    validation={{
                      validate: (value) => {
                        const passwordField = document.querySelector('input[name="password"]');
                        return (passwordField && value === passwordField.value) || "Passwords do not match";
                      }
                    }}
                  />
                  <Error errorName={errors.confirm_password} />
                </div>
                
                {loading ? <Loader size="50" />:<Button 
                  type="submit"
                  className="mt-6 w-full"
                  disabled={loading}
                >
                  Create Account
                </Button>}
              </form>

              <p className="mt-4 text-center">
                <Link
                  className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                  to="/login"
                >
                  {t("AlreadyAccount")}
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SignUp;