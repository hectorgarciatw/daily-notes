import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/dashboard");
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-center">
                    <a className="flex items-center space-x-2">
                        <span className="text-4xl">📌</span>
                        <span className="text-2xl text-white font-semibold">QuickClips</span>
                    </a>
                </div>

                <form className="mt-6">
                    <div>
                        <label for="username" className="block text-sm text-gray-800 dark:text-gray-200">
                            Username
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <label for="password" className="block text-sm text-gray-800 dark:text-gray-200">
                                Password
                            </label>
                            <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:underline">
                                Forget Password?
                            </a>
                        </div>

                        <input
                            type="password"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleLogin}
                            className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-between mt-4">
                    <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>

                    <a href="#" className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">
                        or login with Social Media
                    </a>

                    <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
                </div>

                <p className="mt-8 text-xs font-light text-center text-gray-400">
                    Don't have an account?{" "}
                    <a href="#" className="font-medium text-gray-700 hover:underline">
                        Create One
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
