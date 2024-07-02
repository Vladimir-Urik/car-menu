import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {securityAtom} from "../../atoms/security.ts";
import {invoke} from "@tauri-apps/api/tauri";

interface PublicSecurityControllerProps {
    children: React.ReactNode;
}

interface PublicSecurity {
    pin_enabled: boolean;
}

export const PublicSecurityController = ({children}: PublicSecurityControllerProps) => {
    const [_,  setSecurity] = useRecoilState(securityAtom);

    useEffect(() => {
        invoke("security_public_settings").then((security) => {
            let ps = security as PublicSecurity;
            console.log(ps.pin_enabled);
            setSecurity((sec) => {
                return ({
                    ...sec,
                    pinEnabled: ps.pin_enabled
                })
            });
        })
    }, []);

    return children;
}