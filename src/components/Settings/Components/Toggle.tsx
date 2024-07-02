export const Toggle = ({value, onChange}: {
    value: boolean,
    onChange: () => void
}) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer"
                   checked={value} onChange={() => {
                onChange()
            }}/>
            <div
                className="group text-xs text-black peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-12 h-6  shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95">
            </div>
        </label>
    )
}