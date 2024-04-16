import {SettingsPage} from "../SettingsSidebar.tsx";
import {faBluetoothB} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

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

export const LineItem = ({label, value, disabled = false, onClick = () => {}}: {
    label: React.ReactNode,
    value: React.ReactNode,
    disabled?: boolean,
    onClick?: () => void
}) => (
    <div onClick={onClick} className={"px-4 w-full py-2 cursor-pointer bg-white rounded-lg text-sm flex items-center justify-between "+ (disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "")}>
        <div>
            {label}
        </div>
        <div>
            {value}
        </div>
    </div>
);

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
            <p className={"text-sm mb-2"}>
                This device:
            </p>
            <div className={"flex flex-col gap-1"}>
                <LineItem label={<>Power</>} value={(
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                               checked={bluetoothInfo?.enabled || false} onChange={() => {
                            togglePower()
                        }}/>
                        <div
                            className="group text-xs text-black peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-12 h-6 peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95">
                        </div>
                    </label>
                )}/>
                <LineItem disabled={!bluetoothInfo?.enabled} label={(
                    <>
                        <FontAwesomeIcon icon={faBluetoothB} className={"text-blue-500 mr-2"}/>
                        {bluetoothInfo ? bluetoothInfo.name : <FontAwesomeIcon className={"animate-spin text-sm"} icon={faCircleNotch}/>}
                    </>
                )} value={<>{bluetoothInfo ? bluetoothInfo.address : <FontAwesomeIcon className={"animate-spin text-sm"} icon={faCircleNotch}/>}</>}/>
                <LineItem disabled={!bluetoothInfo?.enabled} label={<>Visible to other devices</>} value={(
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                               checked={bluetoothInfo?.visible || false} onChange={() => {
                            toogleVisibility();
                        }}/>
                        <div
                            className="group text-xs text-black peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-12 h-6 peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95">
                        </div>
                    </label>
                )}/>
            </div>

            {devices != undefined && devices.length > 0 && (
                <>
                    <p className={"text-sm mb-2 mt-4"}>
                        Trusted devices:
                    </p>

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
                    <p className={"text-sm mb-2 mt-4"}>
                        Other devices:
                    </p>
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