import React from "react";

interface FastActionButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    color?: "primary" | "danger";
}

export const FastActionButton = ({ onClick, children, color = "primary" }: FastActionButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={"bg-gray-200 hover:text-white w-10 h-10 rounded-full flex items-center text-md justify-center "+ (color == "primary" ? "hover:bg-indigo-600 text-indigo-600" : "hover:bg-red-500 text-red-500")}>
            {children}
        </button>
    );
};