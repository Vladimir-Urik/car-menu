import {SettingsPage} from "../SettingsSidebar.tsx";
import {faCogs} from "@fortawesome/free-solid-svg-icons";

const GeneralSettingsPage = () => {
    return (
        <div className={"flex flex-col gap-1"}>
            <p>Author: Vladimir-Urik</p>
            <p>Built with Tauri ♥️</p>
            <p>Version: 1.0.0</p>
        </div>
    );
}

export const generalSettingsPageInfo: SettingsPage = {
    link: "general",
    icon: faCogs,
    title: "General",
    component: <GeneralSettingsPage />
}