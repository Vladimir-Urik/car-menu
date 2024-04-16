import {FastActionButton} from "./FastActionButton.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faExpand, faMinimize, faPowerOff} from "@fortawesome/free-solid-svg-icons";
import {invoke} from "@tauri-apps/api/tauri";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {settingsAtom} from "../atoms/settings.ts";
import {CodeVerifyModal} from "./CodeVerifyModal.tsx";

export const FastActionMenu = () => {
    const [fullScreen, setFullScreen] = useState(true);
    const [_, setSettings] = useRecoilState(settingsAtom);
    const [requireCode, setRequireCode] = useState({
        active: false,
        action: () => {}
    });

    useEffect(() => {
        invoke("fullscreen", { flag: fullScreen }).then(() => console.log("Fullscreen toggled!"));
    }, [fullScreen])

    return (
        <>
            <div className={"flex items-center h-fit gap-3"}>
                <FastActionButton onClick={() => {
                    setSettings((settings) => ({
                        ...settings,
                        active: !settings.active
                    }));
                }}>
                    <FontAwesomeIcon icon={faCogs}/>
                </FastActionButton>

                <FastActionButton onClick={() => {
                    const opposite = !fullScreen;
                    if(!opposite) {
                        setRequireCode({
                            active: true,
                            action: () => {
                                setFullScreen(opposite);
                            }
                        });
                        return;
                    }

                    setFullScreen(opposite);
                }}>
                    <FontAwesomeIcon icon={fullScreen ? faMinimize : faExpand}/>
                </FastActionButton>

                <FastActionButton onClick={() => {
                    setRequireCode({
                        active: true,
                        action: () => {
                            invoke("kill")
                        }
                    });
                }} color={"danger"}>
                    <FontAwesomeIcon icon={faPowerOff}/>
                </FastActionButton>
            </div>
            {requireCode.active && (
                <CodeVerifyModal onCodeVerified={() => {
                    requireCode.action();
                    setRequireCode({
                        active: false,
                        action: () => {
                        }
                    });
                }} canClose onClose={() => {
                    setRequireCode({
                        active: false,
                        action: () => {}
                    });
                }} />
            )}
        </>
    )
}