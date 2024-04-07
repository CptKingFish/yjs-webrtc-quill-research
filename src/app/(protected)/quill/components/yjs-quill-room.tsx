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
  inputsList: inferRouterOutputs<typeof quillRouter>["getInputsByRoomId"];
  initialDocument: inferRouterOutputs<
    typeof quillRouter
  >["getYDocumentByRoomId"];
};

export default function YjsQuillRoom({
  inputsList,
  initialDocument,
}: YjsQuillRoomProps) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AwarenessStates>(new Map());
  // const { data: initialDocument, isLoading: initialDocumentLoading } =
  //   api.quill.getYDocumentByRoomId.useQuery({
  //     roomId: "clufmx2ik0000wrfug653vlml",
  //   });
  const { mutate: updateYDocumentState, error } =
    api.quill.updateYDocumentState.useMutation();

  const { provider, doc } = useYDocument(
    "quill-demo-room",
    session?.user?.name ?? "Anonymous",
    initialDocument?.state
      ? Uint8Array.from(atob(initialDocument.state), (c) => c.charCodeAt(0))
      : undefined,
  );

  // set the initial document state
  // useEffect(() => {
  //   if (!initialDocument?.state) return;

  //   const state = Uint8Array.from(atob(initialDocument.state), (c) =>
  //     c.charCodeAt(0),
  //   );

  //   if (state && doc && !initialDocumentLoading) {
  //     console.log("initial state", state);
  //     Y.applyUpdate(doc, state);
  //   }
  // }, [doc, initialDocument, initialDocumentLoading]);

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
      // state is expecting base 64 encoded string
      updateYDocumentState({
        yDocumentId: "cluo879o40000wh342lxrt4vc",
        // state: Buffer.from(state).toString("base64"),
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
      // console.log("update", update);
      // console.log("origin", origin);
      console.log("ydoc", doc);
      doc.share.forEach((value, key) => {
        console.log(doc.getText(key).toDelta());
      });
      // console.log("ydocJSON", doc.toJSON());
      // console.log("transaction", transaction);
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
