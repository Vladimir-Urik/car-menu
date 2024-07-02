import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {themeAtom} from "../../atoms/theme.ts";
import {invoke} from "@tauri-apps/api/tauri";

interface DarkModeControllerProps {
    children: React.ReactNode;

}

export const DarkModeController = ({children}: DarkModeControllerProps) => {
    const [theme, setTheme] = useRecoilState(themeAtom);

    useEffect(() => {
        if (theme.darkmode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    useEffect(() => {
        invoke("theme_settings").then((settings) => {
            const parsed = settings as {
                darkmode: boolean
            }

            setTheme({
                darkmode: parsed.darkmode
            })
        })
    }, []);

    return children;
}