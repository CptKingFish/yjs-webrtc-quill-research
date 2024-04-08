"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { type Transaction, type Doc } from "yjs";
import { useDebouncedCallback } from "use-debounce";
import { type QuillBinding } from "y-quill";
import { type inferRouterOutputs } from "@trpc/server";
import * as Y from "yjs";
import type quillRouter from "@/server/api/routers/quill";
import YjsQuillEditorList from "./yjs-quill-editor-list";
import { api } from "@/trpc/react";
import useYDocument from "../hooks/use-y-document";

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

const YjsQuillRoom = ({ roomDetails }: YjsQuillRoomProps) => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AwarenessStates>(new Map());

  const { mutate: updateYDocumentState } =
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

    const { awareness } = provider;

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
      updateData: Uint8Array,
      origin: QuillBinding,
      updatedDoc: Doc,
      transaction: Transaction,
    ) => {
      updatedDoc.share.forEach((_, key) => {
        console.log(updatedDoc.getText(key).toDelta());
      });

      void debouncedYDocUpdate(Y.encodeStateAsUpdate(updatedDoc));
    };

    doc.on("update", update);

    // eslint-disable-next-line consistent-return
    return () => {
      doc.off("update", update);
    };
  }, [debouncedYDocUpdate, doc]);

  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      if (!doc) return;
      updateYDocumentState({
        yDocumentId: roomDetails.ydocument.id!,
        state: Y.encodeStateAsUpdate(doc),
      });
    }

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [doc, roomDetails.ydocument.id, updateYDocumentState]);
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
        <ul />
      </div>
    </div>
  );
};

export default YjsQuillRoom;
