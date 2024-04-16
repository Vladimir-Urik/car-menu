import {SettingsPage} from "../SettingsSidebar.tsx";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import {LineItem} from "./BluetoothSettingsPage.tsx";
import {faWifi} from "@fortawesome/free-solid-svg-icons";

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
            <p className={"text-sm mb-2"}>
                This device:
            </p>
            <div className={"flex flex-col gap-1"}>
                <LineItem label={<>Enabled</>} value={(
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                               checked={wifiInfo?.enabled || false} onChange={() => {
                            toggleWifi()
                        }}/>
                        <div
                            className="group text-xs text-black peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-12 h-6  shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95">
                        </div>
                    </label>
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