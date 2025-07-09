import { RootState } from "@/state/store";
import { setDark, setLight } from "@/state/theme/themeSlice";
import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function DarkLightToggleButton() {
  const theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  return (
    <div className="relative flex w-fit items-center rounded-full ">
      <button
        className="text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10 text-white"
        onClick={() => {
          dispatch(setLight());
        }}
      >
        <FiMoon className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Light</span>
      </button>
      <button
        className="text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10 text-white"
        onClick={() => {
          dispatch(setDark());
        }}
      >
        <FiSun className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Dark</span>
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${
          theme === "dark" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
        />
      </div>
    </div>
  );
};
