"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useYDocument } from "../hooks/use-y-document";

type AwarenessStates = Map<
  number,
  {
    user: {
      name: string;
      color: string;
    };
  }
>;

const QuillWrapper = dynamic(() => import("./quill-wrapper"), {
  ssr: false,
});

export default function QuillEditor() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AwarenessStates>(new Map());

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
      console.log(newUsers);

      setUsers(newUsers);
    });
  }, [provider]);

  // Additional logic or state related to the editor can be managed here.
  // For example, handling editor content changes, user interactions, etc.

  return (
    <div>
      <QuillWrapper
        yText={doc?.getText("quill-demo-1")}
        awareness={provider?.awareness}
      />
      <QuillWrapper
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
        </ul>
      </div>
    </div>
  );
}
