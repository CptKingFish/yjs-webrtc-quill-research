"use client";

import dynamic from "next/dynamic";

import { type inferRouterOutputs } from "@trpc/server";
import { type quillRouter } from "@/server/api/routers/quill";
import { type WebrtcProvider } from "y-webrtc";

const YjsQuillEditor = dynamic(() => import("./yjs-quill-editor"), {
  ssr: false,
});

type YjsQuillRoomProps = {
  inputsList: inferRouterOutputs<
    typeof quillRouter
  >["getRoomDetailsByRoomId"]["inputs"];
  provider: WebrtcProvider;
};

export default function YjsQuillEditorList({
  inputsList,
  provider,
}: YjsQuillRoomProps) {
  return (
    <>
      {provider.connected &&
        inputsList?.map((input) => {
          const yText = provider.doc.getText(input.id);
          // yText.setAttribute("id", input.id);

          return (
            <YjsQuillEditor
              key={input.id}
              yText={yText}
              awareness={provider.awareness}
            />
          );
        })}
    </>
  );
}
