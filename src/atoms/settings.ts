import {atom} from "recoil";

interface Settings {
    active: boolean;
    link: string;
}

export const settingsAtom = atom<Settings>({
    key: 'settings',
    default: {
        active: false,
        link: 'general'
    }
});