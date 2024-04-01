"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useYDocument } from "../hooks/use-y-document";
import { type Doc } from "yjs";
import { api } from "@/trpc/react";

type AwarenessStates = Map<
  number,
  {
    user: {
      name: string;
      color: string;
    };
  }
>;

const YjsQuillEditor = dynamic(() => import("./yjs-quill-editor"), {
  ssr: false,
});

export default function YjsQuillRoom() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AwarenessStates>(new Map());

  const { provider, doc } = useYDocument(
    "quill-demo-room",
    session?.user?.name ?? "Anonymous",
  );

  // const { mutate: bulkUpdateInputs } = api.quill.bulkUpdateInputs.useMutation();
  const { mutate: updateInput } = api.quill.updateInput.useMutation();

  useEffect(() => {
    if (!provider) return;

    const awareness = provider.awareness;

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
    const update = (update: Uint8Array, origin: unknown, doc: Doc) => {
      console.log("update", update, origin);
      console.log("ydoc", doc);
      console.log("ydocJSON", doc.toJSON());

      const text = doc.getText("clufmxnw10001wrfu85clrruv").toJSON();
      console.log("text", text);
    };

    doc.on("update", update);

    return () => {
      doc.off("update", update);
    };
  }, [doc, updateInput]);

  // Additional logic or state related to the editor can be managed here.
  // For example, handling editor content changes, user interactions, etc.

  return (
    <div>
      <YjsQuillEditor
        yText={doc?.getText("clufmxnw10001wrfu85clrruv")}
        awareness={provider?.awareness}
      />
      <YjsQuillEditor
        yText={doc?.getText("clufmxuh80002wrfu15eq3gu1")}
        awareness={provider?.awareness}
      />
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
