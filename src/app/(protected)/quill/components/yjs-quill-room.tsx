"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useYDocument } from "../hooks/use-y-document";
import { Doc } from "yjs";

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
  // const [users, setUsers] = useState<
  //   {
  //     id: number;
  //     name: string;
  //     color: string;
  //   }[]
  // >([]);

  const { provider, doc } = useYDocument(
    "quill-demo-room",
    session?.user?.name ?? "Anonymous",
  );

  useEffect(() => {
    if (!provider) return;

    const awareness = provider.awareness;

    awareness.on("change", () => {
      const newUsers = new Map(
        awareness.getStates(),
      ) as unknown as AwarenessStates;
      console.log("neww", newUsers);

      // const newUsersArr = Array.from(newUsers, ([id, { user }]) => ({
      //   id,
      //   name: user.name,
      //   color: user.color,
      // }));

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
    };

    doc.on("update", update);

    return () => {
      doc.off("update", update);
    };
  }, [doc]);

  // Additional logic or state related to the editor can be managed here.
  // For example, handling editor content changes, user interactions, etc.

  return (
    <div>
      <YjsQuillEditor
        yText={doc?.getText("quill-demo-1")}
        awareness={provider?.awareness}
      />
      <YjsQuillEditor
        yText={doc?.getText("quill-demo-2")}
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
          {/* {users.map((user) => (
            <li key={user.id} style={{ color: user.color }}>
              {user.name}
              {user.id === provider?.awareness.clientID ? " (You)" : ""}
            </li>
          ))} */}
        </ul>
        <ul></ul>
      </div>
    </div>
  );
}
