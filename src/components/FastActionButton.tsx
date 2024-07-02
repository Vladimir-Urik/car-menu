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
            className={"bg-gray-200 dark:bg-gray-800 hover:text-white dark:hover:text-white w-12 h-12 rounded-full flex items-center text-lg justify-center "+ (color == "primary" ? "hover:bg-indigo-600 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-400" : "hover:bg-red-500 dark:hover:bg-red-800 text-red-500 dark:text-red-400")}>
            {children}
        </button>
    );
};