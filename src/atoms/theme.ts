import {atom} from "recoil";

interface Theme {
    darkmode: boolean;
}

export const themeAtom = atom<Theme>({
    key: 'theme',
    default: {
        darkmode: false
    }
});
