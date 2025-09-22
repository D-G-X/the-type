import { Gamepad2, Keyboard } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function Menu(props: {
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="flex justify-center mt-1 pt-8">
      <button
        onClick={() => props.setCurrentTab(1)}
        title="Type"
        disabled={props.currentTab == 1}
        className={`text-xl rounded-md px-2 py-1 mx-3 cursor-pointer ${
          props.currentTab == 1
            ? "bg-[#7972ff] text-white"
            : " bg-white text-black"
        }`}
      >
        <Keyboard size={32} />
      </button>
      <button
        title="Multiplayer"
        onClick={() => props.setCurrentTab(2)}
        disabled={props.currentTab == 2}
        className={`text-xl rounded-md  px-2 py-1 mx-3 hidden cursor-pointer ${
          props.currentTab == 2
            ? "bg-[#7972ff] text-white"
            : "bg-white text-black"
        }`}
      >
        <Gamepad2 size={32} />
      </button>
    </div>
  );
}
