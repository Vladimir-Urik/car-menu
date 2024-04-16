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
            className={"hover:text-black flex items-center transition-all hover:bg-white w-full px-4 py-2 text-sm cursor-pointer " + (active ? "bg-white text-black" : "bg-transparent text-gray-600")}>
            {children}
        </div>
    );
};