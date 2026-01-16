import React from 'react';

const Loader = ({ text = "Processing..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse rounded-full"></div>

                {/* Logo Container with Pulse */}
                <div className="relative bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-2000">
                    <img
                        src="/ElimuPath.png"
                        alt="Loading..."
                        className="w-16 h-16 object-contain"
                    />
                </div>

                {/* Spinning Ring */}
                <div className="absolute -inset-2 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            {text && (
                <p className="mt-8 text-lg font-medium text-gray-700 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loader;
