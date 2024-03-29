"use client";

import { QuillBinding } from "y-quill";
import QuillCursors from "quill-cursors";
import type * as Y from "yjs";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ReactQuill from "react-quill";
import { type ReactQuillProps } from "react-quill";
import { type WebrtcProvider } from "y-webrtc";
import { useSession } from "next-auth/react";

ReactQuill.Quill.register("modules/cursors", QuillCursors);

const DynamicQuillWrapper = dynamic(() => import("./quill-wrapper"), {
  ssr: false,
});

const ForwardRefEditor = forwardRef(
  (
    props: ReactQuillProps & {
      setEditorReady: React.Dispatch<React.SetStateAction<boolean>>;
    },
    ref: React.Ref<ReactQuill>,
  ) => <DynamicQuillWrapper {...props} editorRef={ref} />,
);

ForwardRefEditor.displayName = "ForwardRefEditor";

type EditorProps = {
  yText: Y.Text;
  provider: WebrtcProvider;
};

export default function QuillEditor({ yText, provider }: EditorProps) {
  const [isClient, setIsClient] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const reactQuillRef = useRef<ReactQuill>(null);
  console.log("reactQuillRef", reactQuillRef);

  useEffect(() => {
    // This code runs only in the browser, enabling client-side rendering
    setIsClient(true);
  }, []);

  // Set up Yjs and Quill
  useEffect(() => {
    if (!editorReady || !reactQuillRef.current) {
      return;
    }

    const quill: ReturnType<ReactQuill["getEditor"]> =
      reactQuillRef.current.getEditor();
    const binding: QuillBinding = new QuillBinding(
      yText,
      quill,
      provider.awareness,
    );

    provider.awareness.setLocalStateField("user", {
      // Define a print name that should be displayed
      // generate random name
      name: "User " + Math.floor(Math.random() * 100),
      // Define a color that should be associated to the user:
      // generate random hex color
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });

    return () => {
      binding?.destroy?.();
    };
  }, [yText, provider, editorReady]);

  return (
    <>
      {isClient && (
        <ForwardRefEditor
          placeholder="Start typing here…"
          ref={reactQuillRef}
          theme="snow"
          modules={{
            cursors: true,
            toolbar: true,
            history: {
              // Local undo shouldn't undo changes from remote users
              userOnly: true,
            },
          }}
          setEditorReady={setEditorReady}
        />
      )}
    </>
  );
}
