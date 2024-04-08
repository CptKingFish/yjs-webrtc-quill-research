import React from "react";
import dynamic from "next/dynamic";
import { api } from "@/trpc/server";

// Dynamically import QuillEditor as a client component
const YjsQuillRoom = dynamic(() => import("./components/yjs-quill-room"), {
  ssr: false,
});

type QuillRoomPageProps = {
  params: {
    roomId: string;
  };
};

const QuillRoomPage = async ({ params }: QuillRoomPageProps) => {
  const roomDetails = await api.quill.getRoomDetailsByRoomId({
    roomId: params.roomId,
  });

  // check if roomDetails.id or roomDetails.ydocument is null, if so, reroute to /quill
  if (!roomDetails.id || !roomDetails.ydocument) {
    return <div>Room not found</div>;
  }

  return (
    <div>
      <h1>Room name: {roomDetails.name}</h1>
      <YjsQuillRoom roomDetails={roomDetails} />
    </div>
  );
};

export default QuillRoomPage;
