"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useYDocument } from "../hooks/use-y-document";
import { type Transaction, type Doc } from "yjs";
import { useDebouncedCallback } from "use-debounce";
import { type QuillBinding } from "y-quill";
import { type inferRouterOutputs } from "@trpc/server";
import { type quillRouter } from "@/server/api/routers/quill";
import YjsQuillEditorList from "./yjs-quill-editor-list";
import { api } from "@/trpc/react";
import * as Y from "yjs";

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
  roomDetails: inferRouterOutputs<typeof quillRouter>["getRoomDetailsByRoomId"];
};

export default function YjsQuillRoom({ roomDetails }: YjsQuillRoomProps) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AwarenessStates>(new Map());

  const { mutate: updateYDocumentState, error } =
    api.quill.updateYDocumentState.useMutation();

  const { provider, doc } = useYDocument(
    roomDetails.id!,
    session?.user?.name ?? "Anonymous",
    roomDetails.ydocument.state
      ? Uint8Array.from(atob(roomDetails.ydocument.state), (c) =>
          c.charCodeAt(0),
        )
      : undefined,
  );

  useEffect(() => {
    if (!provider) return;

    const awareness = provider.awareness;

    awareness.on("change", () => {
      const newUsers = new Map(
        awareness.getStates(),
      ) as unknown as AwarenessStates;
      console.log("users changed", newUsers);

      setUsers(newUsers);
    });
  }, [provider]);

  // debounce the updateYDocumentState call
  const debouncedYDocUpdate = useDebouncedCallback(
    async (state: Uint8Array) => {
      console.log("debounced update", state);
      if (!doc || !state) return;
      updateYDocumentState({
        yDocumentId: roomDetails.ydocument.id!,
        state,
      });
    },
    1000,
  );

  // listen for updates to the ydoc

  useEffect(() => {
    if (!doc) return;

    // on update, log out update and ydoc
    const update = (
      update: Uint8Array,
      origin: QuillBinding,
      doc: Doc,
      transaction: Transaction,
    ) => {
      doc.share.forEach((_, key) => {
        console.log(doc.getText(key).toDelta());
      });

      void debouncedYDocUpdate(Y.encodeStateAsUpdate(doc));
    };

    doc.on("update", update);

    return () => {
      doc.off("update", update);
    };
  }, [debouncedYDocUpdate, doc]);

  return (
    <div>
      {provider && (
        <YjsQuillEditorList
          inputsList={roomDetails.inputs}
          provider={provider}
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
