import {SettingsPage} from "../SettingsSidebar.tsx";
import {faBluetoothB} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {LineHeader} from "./Components/LineHeader.tsx";
import {LineItem} from "./Components/LineItem.tsx";
import {Toggle} from "./Components/Toggle.tsx";

interface BluetoothInfo {
    name: string;
    address: string;
    visible: boolean;
    enabled: boolean;
}

interface DeviceInfo {
    address: string;
    name: string;
    trusted: boolean;
    connected: boolean;
}

const BluetoothSettingsPage = () => {
    const [bluetoothInfo, setBluetoothInfo] = useState<BluetoothInfo | undefined>();
    const [devices, setDevices] = useState<DeviceInfo[] | undefined>();
    const [loading, setLoading] = useState(true);
    const [loadingAddreses, setLoadingAddresses] = useState<string[]>([]);

    const updateInfo = () => {
        invoke("bluetooth_info").then((info) => {
            setBluetoothInfo(info as BluetoothInfo)
        })
    };

    const loadTrustedDevices = () => {
        invoke("bluetooth_devices").then((devices) => {
            setDevices(devices as DeviceInfo[])
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(!loading) {
                return;
            }

            updateInfo()
            loadTrustedDevices()
        }, 500)

        const scanInterval = setInterval(() => {
            invoke("bluetooth_scan")
        }, 9000)

        return () => {
            clearInterval(interval)
            clearInterval(scanInterval)
        }
    }, [])

    const toogleVisibility = () => {
        invoke("bluetooth_toggle_visibility", {state: !bluetoothInfo?.visible}).then((info) => {
            setBluetoothInfo(info as BluetoothInfo)
        })
    }

    const togglePower = () => {
        invoke("bluetooth_power", {state: !bluetoothInfo?.enabled}).then((info) => {
            setBluetoothInfo(info as BluetoothInfo)
        })
    }

    const connectToDevice = (device: DeviceInfo) => {
        setLoading(false)
        setLoadingAddresses([...loadingAddreses, device.address])
        invoke("bluetooth_connect", {device: device.address}).then(() => {
            loadTrustedDevices()
        }).finally(() => {
            setLoading(true)
            setLoadingAddresses(loadingAddreses.filter((address) => address != device.address))
        });
    }

    const disconnectFromDevice = (device: DeviceInfo) => {
        setLoading(false)
        setLoadingAddresses([...loadingAddreses, device.address])
        invoke("bluetooth_disconnect", {device: device.address}).then(() => {
            loadTrustedDevices()
        }).finally(() => {
            setLoading(true)
            setLoadingAddresses(loadingAddreses.filter((address) => address != device.address))
        });
    }

    return (
        <div>
            <LineHeader>
                This device:
            </LineHeader>
            <div className={"flex flex-col gap-1"}>
                <LineItem label={<>Power</>} value={(
                    <Toggle value={bluetoothInfo?.enabled || false} onChange={() => togglePower()}/>
                )}/>
                <LineItem disabled={!bluetoothInfo?.enabled} label={(
                    <>
                        <FontAwesomeIcon icon={faBluetoothB} className={"text-blue-500 mr-2"}/>
                        {bluetoothInfo ? bluetoothInfo.name : <FontAwesomeIcon className={"animate-spin text-sm"} icon={faCircleNotch}/>}
                    </>
                )} value={<>{bluetoothInfo ? bluetoothInfo.address : <FontAwesomeIcon className={"animate-spin text-sm"} icon={faCircleNotch}/>}</>}/>
                <LineItem disabled={!bluetoothInfo?.enabled} label={<>Visible to other devices</>} value={(
                    <Toggle value={bluetoothInfo?.visible || false} onChange={() => toogleVisibility()}/>
                )}/>
            </div>

            {devices != undefined && devices.length > 0 && (
                <>
                    <LineHeader>
                        Trusted devices:
                    </LineHeader>

                    <div className={"flex flex-col gap-1"}>
                        {devices.filter((device) => device.trusted).map((device) => (
                            <LineItem
                                onClick={() => {
                                    if(loadingAddreses.includes(device.address)) {
                                        return;
                                    }

                                    if (device.connected) {
                                        disconnectFromDevice(device)
                                    } else {
                                        connectToDevice(device)
                                    }
                                }}
                                key={device.address} label={(
                                <div className={"flex items-center"}>
                                    <div className={"h-6 w-1 rounded-full mr-2 "+ (device.connected ? "bg-green-500" : "bg-red-500")}/>
                                    {device.name}
                                </div>
                            )} value={loadingAddreses.includes(device.address) ? <FontAwesomeIcon className={"animate-spin text-sm"} icon={faCircleNotch}/> : (device.connected ? "Disconnect" : "Connect")}/>
                        ))}
                    </div>
                </>
            )}

            {bluetoothInfo?.enabled && (
                <>
                <div className={"flex items-center justify-between w-full"}>
                    <LineHeader>
                        Other devices:
                    </LineHeader>
                    <FontAwesomeIcon className={"animate-spin text-sm"} icon={faCircleNotch}/>
                </div>

                    <div className={"flex flex-col gap-1"}>
                        {devices?.filter((device) => !device.trusted).map((device) => (
                            <LineItem label={device.name} value={<>Set-up</>}/>
                        ))}
                    </div>
                </>
                )}
                </div>
            );
            }

export const bluetoothSettingsPageInfo: SettingsPage = {
            link: "bluetooth",
            icon: faBluetoothB,
            title: "Bluetooth",
            component: <BluetoothSettingsPage/>
}