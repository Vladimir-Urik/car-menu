import {SettingsPage} from "../SettingsSidebar.tsx";
import {faShield} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {CodeVerifyModal} from "../CodeVerifyModal.tsx";
import {settingsAtom} from "../../atoms/settings.ts";
import {useRecoilState} from "recoil";
import {LineHeader} from "./Components/LineHeader.tsx";
import {LineItem} from "./Components/LineItem.tsx";
import {Toggle} from "./Components/Toggle.tsx";
import {securityAtom} from "../../atoms/security.ts";
import {invoke} from "@tauri-apps/api/tauri";

const SecuritySettingsPage = () => {
    const [logged, setLogged] = useState(false);
    const [_, setSettings] = useRecoilState(settingsAtom);
    const [security, setSecurity] = useRecoilState(securityAtom);

    return (
        <>
            {logged && (
                <div>
                    <LineHeader>
                        Pin code:
                    </LineHeader>
                    <div className={"flex flex-col gap-1"}>
                        <LineItem label={<>Enabled</>} value={(
                            <Toggle value={security.pinEnabled || false} onChange={() => {
                                invoke("security_change_pin_enabled", {
                                    enabled: !security.pinEnabled
                                }).then(() => {
                                    setSecurity((sec) => {
                                        return ({
                                            ...sec,
                                            pinEnabled: !sec.pinEnabled
                                        })
                                    })
                                })
                            }}/>
                        )}/>
                        <LineItem disabled={!security.pinEnabled} label={"Change pin code..."} />
                    </div>
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