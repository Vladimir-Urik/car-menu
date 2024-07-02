interface ApplicationShortcutProps {
    icon: string;
    title: string;
    onClick: () => void;
}

export const ApplicationShortcut = ({icon, title, onClick}: ApplicationShortcutProps) => {
    return (
        <div
            onClick={onClick}
            className={"w-full cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 transition-all h-22 rounded-md flex flex-col items-center"}>
            <img src={icon}
                 className={"w-12 h-12 rounded-md"} alt={"Spotify Icon"}/>
            <p className={"mt-2 text-xs text-center"}>
                {title}
            </p>
        </div>
    )
}