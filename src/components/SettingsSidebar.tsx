import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose, faLock, faVolumeUp} from "@fortawesome/free-solid-svg-icons";
import {SidebarLink} from "./SidebarLink.tsx";
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {useRecoilState} from "recoil";
import {settingsAtom} from "../atoms/settings.ts";
import React from "react";
import {generalSettingsPageInfo} from "./Settings/GeneralSettingsPage.tsx";
import {bluetoothSettingsPageInfo} from "./Settings/BluetoothSettingsPage.tsx";
import {securityAtom} from "../atoms/security.ts";
import {securitySettingsPageInfo} from "./Settings/SecuritySettingsPage.tsx";
import {wifiSettingsPageInfo} from "./Settings/WifiSettingsPage.tsx";
import {audioSettingsPageInfo} from "./Settings/AudioSettingsPage.tsx";

export interface SettingsPage {
    link: string,
    icon: IconDefinition,
    title: string,
    component: React.ReactNode,
}

const settingsPages: SettingsPage[] = [
    generalSettingsPageInfo,
    bluetoothSettingsPageInfo,
    wifiSettingsPageInfo,
    audioSettingsPageInfo,
    securitySettingsPageInfo
]

export const SettingsSidebar = () => {
    const [settings, setSettings] = useRecoilState(settingsAtom);
    const [_, setSecurity] = useRecoilState(securityAtom);

    return (
        <div className={"fixed top-0 py-3 h-screen w-2/4 transition-all duration-500 "+ (settings.active ? "right-0" : "-right-full")}>
            <div className={"bg-gray-100 shadow-lg rounded-l-lg w-full h-full py-6 px-8"}>
                <div className={"flex justify-between items-center w-full"}>
                    <h1 className={"text-xl font-bold"}>
                        Settings
                    </h1>
                    <button
                        onClick={() => setSettings({
                            link: "general",
                            active: false
                        })}
                        className={"bg-gray-200 hover:text-white w-8 h-8 rounded-full flex items-center text-md justify-center hover:bg-red-500 text-red-500"}>
                        <FontAwesomeIcon icon={faClose}/>
                    </button>
                </div>

                <div className={"flex mt-6"}>
                    <div className={"flex flex-col w-1/4 gap-2"}>
                        {settingsPages.map((page) => (
                            <SidebarLink key={page.link} onClick={() => setSettings({
                                ...settings,
                                link: page.link
                            })} active={settings.link == page.link}>
                                <div className={"flex w-10 h-fit items-center justify-center"}>
                                    <FontAwesomeIcon icon={page.icon} className={"mr-2"}/>
                                </div>
                                {page.title}
                            </SidebarLink>
                        ))}
                        <SidebarLink onClick={() => {
                            setSettings({
                                link: "general",
                                active: false
                            });
                            setSecurity({
                                logged: false
                            })
                        }}>

                            <div className={"flex w-10 h-fit items-center justify-center"}>
                                <FontAwesomeIcon icon={faLock} className={"mr-2"}/>
                            </div>
                            Log out
                        </SidebarLink>
                    </div>

                    <div className={"w-3/4 px-8"}>
                        <h1 className={"text-xl font-bold mb-4"}>
                            {settingsPages.find((page) => page.link == settings.link)?.title}
                        </h1>
                        {settingsPages.find((page) => page.link == settings.link)?.component}
                    </div>
                </div>
            </div>
        </div>
    )
}