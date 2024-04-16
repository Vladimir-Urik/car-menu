import {atom} from "recoil";

interface Security {
    logged: boolean
}

export const securityAtom = atom<Security>({
    key: "security",
    default: {
        logged: false
    }
})