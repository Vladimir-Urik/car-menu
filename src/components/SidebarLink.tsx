import React from "react";

interface SidebarLinkProps {
    onClick: () => void;
    children: React.ReactNode;
    active?: boolean;
}

export const SidebarLink = ({ onClick, children, active = false }: SidebarLinkProps) => {
    return (
        <div
            onClick={onClick}
            className={"hover:text-black flex items-center transition-all hover:bg-white dark:hover:text-white dark:hover:bg-gray-700 rounded-md w-full px-4 py-2 text-sm cursor-pointer " + (active ? "bg-white dark:bg-gray-700 dark:text-white text-black" : "bg-transparent text-gray-600 dark:text-gray-400")}>
            {children}
        </div>
    );
};