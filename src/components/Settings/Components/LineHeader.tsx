import React from "react";

export const LineHeader = ({children}: {
    children: React.ReactNode
}) => (
    <p className={"text-sm mb-2 dark:text-white"}>
        {children}
    </p>
);