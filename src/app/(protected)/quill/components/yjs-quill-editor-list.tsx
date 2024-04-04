"use client";

import dynamic from "next/dynamic";

import { type inferRouterOutputs } from "@trpc/server";
import { type quillRouter } from "@/server/api/routers/quill";
import { type WebrtcProvider } from "y-webrtc";
import { Delta } from "quill";

const YjsQuillEditor = dynamic(() => import("./yjs-quill-editor"), {
  ssr: false,
});

type AwarenessStates = Map<
  number,
  {
    user: {
      name: string;
      color: string;
    };
  }
>;

type YjsQuillRoomProps = {
  inputsList: inferRouterOutputs<typeof quillRouter>["getInputsByRoomId"];
  provider: WebrtcProvider;
  users: AwarenessStates;
  // peers: number;
};

export default function YjsQuillEditorList({
  inputsList,
  provider,
  users,
  // peers,
}: YjsQuillRoomProps) {
  return (
    <>
      {provider.connected &&
        inputsList.map((input) => {
          const yText = provider.doc.getText(input.id);
          yText.setAttribute("id", input.id);
          console.log("provider", provider);

          // if (peers === 0) {
          //   yText.applyDelta(input.delta ?? []);
          // }
          return (
            <YjsQuillEditor
              key={input.id}
              yText={yText}
              initialDelta={input.delta as unknown as Delta}
              awareness={provider.awareness}
              userCount={users.size}
            />
          );
        })}
    </>
  );
}
