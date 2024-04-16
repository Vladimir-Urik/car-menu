import {SettingsPage} from "../SettingsSidebar.tsx";
import {faVolumeUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const AudioSettingsPage = () => {
    return (
        <div>
            <div className="mb-4">
                <div className={"flex items-center"}>
                    <div className={"w-1/12"}>
                        <FontAwesomeIcon icon={faVolumeUp} />
                    </div>
                    <input type="range" id="price-range"
                           className="w-11/12 outline-none focus:outline-none border-indigo-600 border-4 accent-indigo-600" min="0" max="100"/>
                </div>
            </div>
        </div>
    );
}

export const audioSettingsPageInfo: SettingsPage = {
    link: "audio",
    icon: faVolumeUp,
    title: "Audio",
    component: <AudioSettingsPage/>
}