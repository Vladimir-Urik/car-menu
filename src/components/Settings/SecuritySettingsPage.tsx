import {SettingsPage} from "../SettingsSidebar.tsx";
import {faShield} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {CodeVerifyModal} from "../CodeVerifyModal.tsx";
import {settingsAtom} from "../../atoms/settings.ts";
import {useRecoilState} from "recoil";

const SecuritySettingsPage = () => {
    const [logged, setLogged] = useState(false);
    const [_, setSettings] = useRecoilState(settingsAtom);

    return (
        <>
            {logged && (
                <div className={"flex flex-col gap-1"}>
                    <p>Author: Vladimir-Urik</p>
                    <p>Built with Tauri ♥️</p>
                    <p>Version: 1.0.0</p>
                </div>
            )}
            {!logged && (
                <CodeVerifyModal onCodeVerified={() => setLogged(true)} canClose onClose={() => {
                    setSettings({
                        link: "general",
                        active: true
                    })
                }} />
            )}

            {!logged && (
                <div className={"flex flex-col gap-1"}>
                    <p>Please verify your identity to access this page.</p>
                </div>
            )}
        </>
    );
}

export const securitySettingsPageInfo: SettingsPage = {
    link: "security",
    icon: faShield,
    title: "Security",
    component: <SecuritySettingsPage />
}