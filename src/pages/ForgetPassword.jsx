import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

const ForgetPassword = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(60); // Initial counter value (in seconds)
  const [isCounterActive, setIsCounterActive] = useState(false); // Flag to indicate if the counter is active

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setIsCounterActive(true); // Start the counter
        const response = await axios.post(
          "http://localhost:8000/auth/forget-password",
          {
            email: values.email,
          }
        );

        // Display success message based on the API response
        toast.success(response.data.message);
      } catch (error) {
        // Display error message based on the API response
        toast.error(
          error.response.data.message ||
            "An error occurred while processing your request."
        );
      } finally {
        setIsLoading(false); // Set isLoading to false regardless of success or error
      }
    },
  });

  useEffect(() => {
    let interval;

    if (isCounterActive) {
      interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isCounterActive]);

  useEffect(() => {
    if (counter === 0) {
      setIsCounterActive(false);
      setCounter(60); // Reset the counter to its initial value
    }
  }, [counter]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Forget Password</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
              className={`w-full px-3 py-2 border rounded-md outline-none focus:ring focus:ring-blue-300 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary rounded-md"
            disabled={isLoading || isCounterActive}
          >
            {isCounterActive
              ? `Sending an email.. ${counter}s`
              : "Forget Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
