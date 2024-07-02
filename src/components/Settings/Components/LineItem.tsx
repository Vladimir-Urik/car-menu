import React from "react";

export const LineItem = ({label, value = (<></>), disabled = false, onClick = () => {}}: {
    label: React.ReactNode,
    value?: React.ReactNode,
    disabled?: boolean,
    onClick?: () => void
}) => (
    <div onClick={onClick} className={"px-4 w-full py-2 cursor-pointer bg-white rounded-lg dark:bg-gray-700 dark:text-gray-200 text-sm flex items-center justify-between "+ (disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "")}>
        <div>
            {label}
        </div>
        <div>
            {value}
        </div>
    </div>
);