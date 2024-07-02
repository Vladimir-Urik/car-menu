import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import {invoke} from "@tauri-apps/api/tauri";
import {useRecoilState} from "recoil";
import {securityAtom} from "../atoms/security.ts";

const Button = ({children, onClick, disabled = false}: { children: React.ReactNode, onClick: () => void, disabled?: boolean }) => (
    <button
        onClick={onClick}
        className={"bg-indigo-700 w-14 h-14 rounded-full flex items-center justify-center text-xl text-white font-bold disabled:opacity-50"} disabled={disabled}>
        {children}
    </button>
)

const CodeCircle = ({state}: { state: "inputed" | "inputing" | "empty" }) => {
    let className = "";
    switch (state) {
        case "inputed":
            className = "bg-indigo-600 border-indigo-600";
            break;
        case "inputing":
            className = "bg-indigo-300 border-indigo-600";
            break;
        case "empty":
            className = "bg-white border-indigo-300";
            break;
    }

    return (
        <dív className={"border-2 w-4 h-4 rounded-full "+ className}>
        </dív>
    )
}

interface CodeVerifyModalProps {
    onCodeVerified: () => void;
    canClose?: boolean;
    onClose?: () => void;
}

export const CodeVerifyModal = ({onCodeVerified, canClose = false, onClose = () => {} }: CodeVerifyModalProps) => {
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [security, _] = useRecoilState(securityAtom);

    const CodeView = () => {
        const codeLength = code.length;
        let codeView = [];
        for (let i = 0; i < 4; i++) {
            if((codeLength) == i) {
                codeView.push(<CodeCircle state={"inputing"} />);
            } else if (codeLength > i) {
                codeView.push(<CodeCircle state={"inputed"} />);
            } else {
                codeView.push(<CodeCircle state={"empty"} />);
            }
        }

        return (
            <>
                {codeView}
            </>
        )
    }

    const inputCode = (input: string) => {
        if (code.length < 4) {
            setCode(code + input);
        }
    }

    const removeLast = () => {
        setCode(code.slice(0, -1));
    }

    const checkCode = () => {
        invoke("verify", {code}).then((verified) => {
            if (verified) {
                onCodeVerified();
                setErrorMessage('');
            } else {
                setCode('');
                setErrorMessage("Invalid code");
            }
        });
    }

    useEffect(() => {
        if (!security.pinEnabled) {
            onCodeVerified();
        }
    }, []);

    if(!security.pinEnabled) {
        return <></>;
    }

    return (
        <div tabIndex={0} className={"absolute top-0 left-0 w-full h-screen z-9"} onKeyDown={(e) => {
            if (e.key == "Escape" && canClose) {
                onClose();
            }

            if (e.key >= '0' && e.key <= '9') {
                inputCode(e.key);
            }

            if (e.key == "Backspace") {
                removeLast();
            }

            if (e.key == "Enter") {
                checkCode();
            }
        }}>
            <div className={"absolute top-0 left-0 w-full h-screen z-9 bg-black/40"}>
            </div>
            <div className={"absolute z-100 top-0 left-0 w-full h-screen flex items-center justify-center"}>
                <div className={"p-4 relative bg-white dark:bg-gray-800 rounded-lg w-[350px]"}>
                    {canClose && (
                        <button
                            onClick={() => {
                                onClose();
                            }}
                            className={"absolute top-3 right-3 hover:text-red-500 w-8 h-8 rounded-full flex items-center text-md justify-center text-gray-500"}>
                            <FontAwesomeIcon icon={faClose}/>
                        </button>
                    )}
                    <h1 className={"text-xl font-bold text-center text-black dark:text-white"}>
                        Enter the code
                    </h1>
                    <div className={"w-full flex items-center mt-8 justify-center gap-8 h-[100px]"}>
                        <CodeView/>
                    </div>

                    {errorMessage.length > 0 && (
                        <p className={"text-red-500 mt-4 text-sm text-center"}>
                            {errorMessage}
                        </p>
                    )}

                    <div className="grid grid-cols-3 grid-rows-4 gap-2 p-8 w-fit mx-auto">
                        <Button onClick={() => inputCode('1')}>1</Button>
                        <Button onClick={() => inputCode('2')}>2</Button>
                        <Button onClick={() => inputCode('3')}>3</Button>
                        <Button onClick={() => inputCode('4')}>4</Button>
                        <Button onClick={() => inputCode('5')}>5</Button>
                        <Button onClick={() => inputCode('6')}>6</Button>
                        <Button onClick={() => inputCode('7')}>7</Button>
                        <Button onClick={() => inputCode('8')}>8</Button>
                        <Button onClick={() => inputCode('9')}>9</Button>
                        <Button onClick={() => removeLast()}>
                            <FontAwesomeIcon icon={faArrowLeft}/>
                        </Button>
                        <Button onClick={() => inputCode('0')}>0</Button>
                        <Button onClick={() => checkCode()} disabled={code.length != 4}><FontAwesomeIcon icon={faCheck}/></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}