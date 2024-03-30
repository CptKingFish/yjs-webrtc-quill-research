"use client";

import React, { useState, useRef, useEffect } from "react";
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

// Since QuillWrapper now handles more initialization, dynamically import it
const QuillWrapper = dynamic(() => import("./quill-wrapper"), {
  ssr: false,
});

export default function QuillEditor() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AwarenessStates>(new Map());
  const [editorReady, setEditorReady] = useState(false);
  const editorRef = useRef(null);

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
      {editorReady ? <p>Editor is ready!</p> : <p>Loading editor...</p>}
      <QuillWrapper
        ref={editorRef}
        yText={doc?.getText("quill-demo")}
        provider={provider}
        setEditorReady={setEditorReady}
        theme="snow" // Example prop; you can pass additional ReactQuill props as needed
        modules={{
          cursors: true,
          toolbar: [
            ["bold", "italic", "underline"], // Example toolbar options
            [{ list: "ordered" }, { list: "bullet" }],
          ],
          history: {
            userOnly: true,
          },
        }}
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
