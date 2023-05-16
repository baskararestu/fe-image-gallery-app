import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser, setLoggedIn } from "../features/users/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email cannot be empty")
      .email("Wrong email format"),
    password: Yup.string()
      .required("Password cannot be empty")
      .min(6, "Password too short"),
  });

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLoginUser = async (value) => {
    try {
      setIsLoading(true);
      await dispatch(loginUser(value));
      await dispatch(setLoggedIn(true)); // Set isLoggedIn to true after successful login
      navigate("/");
      //  window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false); // set isLoading to false after receiving the response
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(value) => {
          handleLoginUser(value);
        }}
      >
        {(props) => {
          return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
              {/* <AuthNav /> */}
              <div className="bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-3xl w-3/4 max-w-sm sm:w-full mt-6">
                <div className="font-medium text-xl sm:text-3xl text-gray-800 text-center">
                  Welcome
                </div>
                <div className="mt-4 text-xl sm:text-sm text-gray-800 text-center">
                  Enter your credentials to access your account
                </div>

                <div className="mt-10">
                  <Form action="#" method="POST">
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
                      <div className="mt-5 flex flex-row justify-end">
                        <a
                          href="/forget-password"
                          className="text-xs ml-2 text-blue-500 font-semibold hover:underline "
                        >
                          Forget Password?
                        </a>
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
                  w-full
                  btn btn-primary rounded-md
                  disabled:btn-disabled
                "
                        disabled={isLoading}
                      >
                        <span className="mr-2 uppercase">
                          {isLoading ? "Signing In..." : "Sign In"}
                        </span>
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
              <div className="flex justify-center items-center mt-6">
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
                    You don't have an account?
                    <a
                      href="/register"
                      className="text-xs ml-2 text-blue-500 font-semibold hover:underline"
                    >
                      Register now
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

export default Login;
