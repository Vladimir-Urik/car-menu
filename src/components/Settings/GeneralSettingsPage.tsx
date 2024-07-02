import {SettingsPage} from "../SettingsSidebar.tsx";
import {faCogs} from "@fortawesome/free-solid-svg-icons";
import {themeAtom} from "../../atoms/theme.ts";
import {useRecoilState} from "recoil";
import {LineHeader} from "./Components/LineHeader.tsx";
import {LineItem} from "./Components/LineItem.tsx";
import {invoke} from "@tauri-apps/api/tauri";

const GeneralSettingsPage = () => {
    const [theme, setTheme] = useRecoilState(themeAtom);

    return (
        <div>
            <LineHeader>
                Theme:
            </LineHeader>
            <div className={"flex flex-col gap-1"}>
                <LineItem label={<>Dark mode</>} value={(
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                               checked={theme.darkmode || false} onChange={() => {
                                   invoke("theme_change_darkmode", {state: !theme.darkmode}).then(() => {
                                        setTheme({
                                             darkmode: !theme.darkmode
                                        })
                                      })
                        }}/>
                        <div
                            className="group text-xs text-black peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-12 h-6 peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95">
                        </div>
                    </label>
                )}/>
            </div>
        </div>
    );
}

export const generalSettingsPageInfo: SettingsPage = {
    link: "general",
    icon: faCogs,
    title: "General",
    component: <GeneralSettingsPage />
}