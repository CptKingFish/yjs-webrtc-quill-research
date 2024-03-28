"use client";

import { QuillBinding } from "y-quill";
import type * as Y from "yjs";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type ReactQuill from "react-quill";

const DynamicQuillWrapper = dynamic(() => import("./quill-wrapper"), {
  ssr: false,
});

type EditorProps = {
  yText: Y.Text;
  provider: any;
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

  useEffect(() => {
    if (reactQuillRef.current) {
      setEditorReady(true);
    }
  });

  // Set up Yjs and Quill
  useEffect(() => {
    if (!editorReady || !reactQuillRef.current) {
      return;
    }

    console.log("reactQuillRef.current", reactQuillRef.current);

    const quill: ReturnType<ReactQuill["getEditor"]> =
      reactQuillRef.current.getEditor();
    const binding: QuillBinding = new QuillBinding(
      yText,
      quill,
      provider.awareness,
    );
    return () => {
      binding?.destroy?.();
    };
  }, [yText, provider, editorReady]);

  return (
    <>
      {isClient && (
        <DynamicQuillWrapper
          placeholder="Start typing here…"
          // ref={reactQuillRef}
          innerRef={reactQuillRef}
          theme="snow"
          modules={{
            toolbar: false,
            history: {
              // Local undo shouldn't undo changes from remote users
              userOnly: true,
            },
          }}
        />
      )}
    </>
  );
}
