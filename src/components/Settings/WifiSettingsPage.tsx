import {SettingsPage} from "../SettingsSidebar.tsx";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import {faWifi} from "@fortawesome/free-solid-svg-icons";
import {LineHeader} from "./Components/LineHeader.tsx";
import {LineItem} from "./Components/LineItem.tsx";
import {Toggle} from "./Components/Toggle.tsx";

interface WifiInfo {
    enabled: boolean;
}

const WifiSettingsPage = () => {
    const [wifiInfo, setWifiInfo] = useState<WifiInfo | undefined>()

    const updateInfo = () => {
        invoke("wifi_info").then((info) => {
            console.log(info)
            setWifiInfo(info as WifiInfo)
        })
    };

    useEffect(() => {
        updateInfo()
    })
    
    const toggleWifi = () => {
        invoke("wifi_toggle", {state: !wifiInfo?.enabled}).then((info) => {
            setWifiInfo(info as WifiInfo)
        })
    }

    return (
        <div>
            <LineHeader>
                This device:
            </LineHeader>
            <div className={"flex flex-col gap-1"}>
                <LineItem label={<>Enabled</>} value={(
                    <Toggle value={wifiInfo?.enabled || false} onChange={() => toggleWifi()}/>
                )}/>
            </div>
        </div>
    );
}

export const wifiSettingsPageInfo: SettingsPage = {
    link: "wifi",
    icon: faWifi,
    title: "WiFi",
    component: <WifiSettingsPage/>
}