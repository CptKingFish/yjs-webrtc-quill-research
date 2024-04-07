import React from "react";
import dynamic from "next/dynamic";
import { api } from "@/trpc/server";
import RoomsList from "./components/rooms-list";

// Dynamically import QuillEditor as a client component
const YjsQuillRoom = dynamic(() => import("./components/yjs-quill-room"), {
  ssr: false,
});

export default async function QuillPage() {
  const inputsList = await api.quill.getInputsByRoomId({
    roomId: "clufmx2ik0000wrfug653vlml",
  });

  const yDocument = await api.quill.getYDocumentByRoomId({
    roomId: "clufmx2ik0000wrfug653vlml",
  });

  return (
    <div className="flex">
      <div className="w-64">
        <RoomsList />
      </div>
      <div className="flex-auto">
        <h1>Room name: </h1>
        <YjsQuillRoom inputsList={inputsList} initialDocument={yDocument} />
      </div>
    </div>
  );
}
