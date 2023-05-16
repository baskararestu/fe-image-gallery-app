import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username cannot be empty")
      .min(5, "Username too short")
      .max(30),
    email: Yup.string()
      .required("Email cannot be empty")
      .email("Wrong email format"),
    password: Yup.string()
      .min(8)
      .required("Password cannot be empty")
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
        "Passwords should contain at least 8 characters including an uppercase letter, a symbol, and a number"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password cannot be empty"),
  });

  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (value) => {
    try {
      setIsLoading(true); // set isLoading to true before making the API call
      let response = await axios.post("http://localhost:8000/auth", value);
      console.log(response);
      navigate("/login");
      toast.success("Register success");
    } catch (error) {
      toast.error("Registration failed. Username or Email already exist", {
        autoClose: 3000,
      });
      console.log(error);
    } finally {
      setIsLoading(false); // set isLoading to false after receiving the response
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={async (value) => {
          await registerUser(value);
        }}
      >
        {(props) => {
          return (
            <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
              <div className="bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-3xl w-3/4 max-w-sm sm:w-full mt-16">
                <div className="font-medium text-xl sm:text-3xl text-gray-800 text-center">
                  Welcome
                </div>
                <div className="mt-4 text-xl sm:text-sm text-gray-800 text-center">
                  Enter your credentials to access your account
                </div>

                <div className="mt-10 ">
                  <Form action="#" method="POST" className="">
                    <div className="flex flex-col mb-5">
                      <label className="mb-1 text-xs tracking-wide text-gray-600">
                        Username :
                      </label>
                      <div className="relative">
                        <Field
                          name="username"
                          autoComplete="username"
                          className="
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    rounded-2xl
                    border border-gray-400
                    w-full
                    py-2
                    focus:outline-none focus:border-blue-400
                  "
                          placeholder="Enter your username"
                        />
                        <ErrorMessage
                          component="div"
                          name="username"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col mb-5">
                      <label
                        htmlFor="email"
                        className="mb-1 text-xs tracking-wide text-gray-600"
                      >
                        E-Mail Address:
                      </label>
                      <div className="relative">
                        <Field
                          id="email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          className="
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    rounded-2xl
                    border border-gray-400
                    w-full
                    py-2
                    focus:outline-none focus:border-blue-400
                  "
                          placeholder="Enter your email"
                        />
                        <ErrorMessage
                          component="div"
                          name="email"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col mb-6">
                      <label
                        htmlFor="password"
                        className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                      >
                        Password:
                      </label>
                      <div className="relative">
                        <Field
                          id="password"
                          type="password"
                          name="password"
                          autoComplete="current-password"
                          className="
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    rounded-2xl
                    border border-gray-400
                    w-full
                    py-2
                    focus:outline-none focus:border-blue-400
                  "
                          placeholder="Enter your password"
                        />
                        <ErrorMessage
                          component="div"
                          name="password"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col mb-5">
                      <label
                        htmlFor="password"
                        className="mb-1 text-xs tracking-wide text-gray-600"
                      >
                        Confirm Password :
                      </label>
                      <div className="relative">
                        <Field
                          type="password"
                          name="confirmPassword"
                          autoComplete="new-password"
                          className="
                text-sm
                placeholder-gray-500
                pl-10
                pr-4
                rounded-2xl
                border border-gray-400
                w-full
                py-2
                focus:outline-none focus:border-blue-400
              "
                          placeholder="Confirm your password"
                        />
                        <ErrorMessage
                          component="div"
                          name="confirmPassword"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="flex w-full">
                      <button
                        type="submit"
                        className="
                  flex
                  mt-2
                  items-center
                  justify-center
                  btn btn-primary rounded-md
                  w-full
                  disabled:btn-disabled
                "
                        disabled={isLoading} // disable the button if isSubmitting or isLoading is true
                      >
                        <span className="mr-2 uppercase">
                          {isLoading ? "Signing up..." : "Sign up"}
                        </span>
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
              <div className="flex justify-center items-center my-6">
                <a
                  href="#"
                  target="_blank"
                  className="
            inline-flex
            items-center
            text-gray-700
            font-medium
            text-xs text-center
          "
                >
                  <span className="ml-2">
                    Already have an account?
                    <a
                      href="/login"
                      className="text-xs ml-2 text-primary font-semibold hover:underline"
                    >
                      Sign In
                    </a>
                  </span>
                </a>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

export default Register;
