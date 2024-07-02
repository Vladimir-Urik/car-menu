import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {SettingsSidebar} from "./SettingsSidebar.tsx";
import {CodeVerifyModal} from "./CodeVerifyModal.tsx";
import {securityAtom} from "../atoms/security.ts";
import {FastActionMenu} from "./FastActionMenu.tsx";
import {ApplicationShortcut} from "./Applications/ApplicationShortcut.tsx";

export const MainScreen = () => {
    const [time, setTime] = useState("00:00")
    const [security, setSecurity] = useRecoilState(securityAtom);

    useEffect(() => {
        const interval = setInterval(() => {
            let minutes = new Date().getMinutes();
            let hours = new Date().getHours();

            let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
            let formattedHours = hours < 10 ? "0" + hours : hours;

            setTime(formattedHours + ":" + formattedMinutes);
        }, 500)

        return () => clearInterval(interval)
    }, []);

    const getDay = (day: number) => {
        switch (day) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
        }
    }


    return (
        <div className="flex flex-col w-full h-screen p-12 bg-white dark:bg-gray-900">
            <div className="flex w-full h-fit justify-between items-center">
                <div>
                    <h1 className={"text-5xl font-normal text-black dark:text-white"}>
                        {time}
                    </h1>
                    <p className={"mt-3 text-black dark:text-white"}>
                        {getDay(new Date().getDay())} | {new Date().toLocaleDateString()}
                    </p>
                </div>
                <FastActionMenu/>
            </div>
            <div className={"w-full flex mt-10 gap-8 h-full"}>
                <div className={"w-1/4 h-full flex flex-col gap-8"}>
                    <div className={"bg-gray-100 p-4 rounded-2xl"}>
                        <div className="grid grid-cols-4 grid-rows-2 gap-3">
                            <ApplicationShortcut icon={"https://play-lh.googleusercontent.com/1oDcB2qSsz1iht4R0A9pRL5C-xXg7bUvPX2wH16szOUAgNB_hwIKz3ckuYvXHLf1BHo"} title={"Music"} onClick={() => {} }/>
                            <ApplicationShortcut icon={"https://static-00.iconduck.com/assets.00/spotify-icon-2048x2048-3js5gsei.png"} title={"Spotify"} onClick={() => {} }/>
                            <ApplicationShortcut icon={"https://www.cnet.com/a/img/resize/5607505c549e0d5d7f2b5d0a9bb40ce4581c3534/hub/2019/06/05/644162fd-5f99-4a9c-becf-37ebcf2d97ea/firefox-new-icon-2019-06.jpg?auto=webp&fit=crop&height=1200&width=1200"} title={"Browser"} onClick={() => {} }/>
                            <ApplicationShortcut icon={"https://static-00.iconduck.com/assets.00/youtube-icon-2048x2048-wiwalbpx.png"} title={"YouTube"} onClick={() => {} }/>
                        </div>
                    </div>
                </div>
                <div className={"w-3/4 bg-gray-100 rounded-2xl h-full"}>
                    <iframe src="http://www.openstreetmap.org/export/embed.html?bbox=79.84942674636841%2C6.899900944350287%2C79.85650777816772%2C6.90436374803887&amp;layers=ND"
                            width="100%" height="100%" style={{
                                borderRadius: "1rem"
                    }}></iframe>
                </div>
            </div>
            <SettingsSidebar/>
            {!security.logged && (
                <CodeVerifyModal onCodeVerified={() => {
                    setSecurity({
                        ...security,
                        logged: true
                    })
                }}/>
            )}
        </div>
    )
}