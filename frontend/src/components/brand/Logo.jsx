import React from 'react';

const Logo = ({ className = "h-10", showText = true }) => {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <img
                src="/elimu_path.png"
                alt="ElimuPath Logo"
                className="h-full w-auto object-contain rounded-lg"
            />
            {showText && (
                <span className="text-2xl font-bold text-gray-900">ElimuPath</span>
            )}
        </div>
    );
};

export default Logo;
