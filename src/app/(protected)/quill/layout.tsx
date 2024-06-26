import "@/styles/globals.css";

import { api } from "@/trpc/server";
import RoomsList from "./components/rooms-list";

export const metadata = {
  title: "INC UMS",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const QuillLayout = async ({ children }: { children: React.ReactNode }) => {
  const roomsList = await api.quill.getRooms();
  return (
    <div className="flex">
      <div className="w-64">
        <RoomsList roomsList={roomsList} />
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};

export default QuillLayout;
