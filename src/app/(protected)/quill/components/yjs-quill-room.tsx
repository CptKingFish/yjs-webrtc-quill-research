"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useYDocument } from "../hooks/use-y-document";
import { type Transaction, type Doc } from "yjs";

import { type QuillBinding } from "y-quill";
import { type inferRouterOutputs } from "@trpc/server";
import { type quillRouter } from "@/server/api/routers/quill";
import YjsQuillEditorList from "./yjs-quill-editor-list";

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
};

export default function YjsQuillRoom({ inputsList }: YjsQuillRoomProps) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AwarenessStates>(new Map());
  const [clientCount, setClientCount] = useState<number>(0);

  const { provider, doc } = useYDocument(
    "quill-demo-room",
    session?.user?.name ?? "Anonymous",
  );

  useEffect(() => {
    if (!provider) return;

    const awareness = provider.awareness;

    provider.on("peers", (peers) => {
      setClientCount(peers.webrtcPeers.length);
    });

    awareness.on("change", () => {
      const newUsers = new Map(
        awareness.getStates(),
      ) as unknown as AwarenessStates;
      console.log("neww", newUsers);

      setUsers(newUsers);
    });
  }, [provider]);

  // listen for updates to doc

  useEffect(() => {
    if (!doc) return;

    // on update, log out update and ydoc
    const update = (
      update: Uint8Array,
      origin: QuillBinding,
      doc: Doc,
      transaction: Transaction,
    ) => {
      console.log("update", update);
      console.log("origin", origin);
      console.log("ydoc", doc);
      console.log("ydocJSON", doc.toJSON());
      console.log("transaction", transaction);

      const text = doc.getText("clufmxnw10001wrfu85clrruv");
      console.log("text", text);

      console.log("textJSON", text.toJSON());
    };

    doc.on("update", update);

    return () => {
      doc.off("update", update);
    };
  }, [doc]);

  return (
    <div>
      {provider && (
        <YjsQuillEditorList
          inputsList={inputsList}
          provider={provider}
          users={users}
          // peers={clientCount}
        />
      )}
      <div>
        <span>Users in room:</span>
        <ul>
          {Array.from(users).map(([clientID, state]) => (
            <li key={clientID} style={{ color: state.user.color }}>
              {state.user.name}
              {clientID === provider?.awareness.clientID ? " (You)" : ""}
            </li>
          ))}
        </ul>
        <ul></ul>
      </div>
    </div>
  );
}
