import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {SettingsSidebar} from "./SettingsSidebar.tsx";
import {CodeVerifyModal} from "./CodeVerifyModal.tsx";
import {securityAtom} from "../atoms/security.ts";
import {FastActionMenu} from "./FastActionMenu.tsx";

export const MainScreen = () => {
    const [time, setTime] = useState("00:00:00")
    const [security, setSecurity] = useRecoilState(securityAtom);

    useEffect(() => {
        const interval = setInterval(() => {
            let minutes = new Date().getMinutes();
            let seconds = new Date().getSeconds();
            let hours = new Date().getHours();

            let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
            let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
            let formattedHours = hours < 10 ? "0" + hours : hours;

            setTime(formattedHours + ":" + formattedMinutes + ":" + formattedSeconds);
        }, 500)

        return () => clearInterval(interval)
    }, []);


    return (
        <div className="flex w-full h-screen p-4">
            <div className="flex w-full p-4 h-fit justify-between items-center">
                <h1 className={"text-xl"}>
                    {time}
                </h1>
                <FastActionMenu />
            </div>
            <SettingsSidebar />
            {!security.logged && (
                <CodeVerifyModal onCodeVerified={() => {
                    setSecurity({
                        ...security,
                        logged: true
                    })
                }} />
            )}
        </div>
    )
}