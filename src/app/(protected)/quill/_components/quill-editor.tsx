"use client";

import ReactQuill from "react-quill";
import { QuillBinding } from "y-quill";
import * as Y from "yjs";

import { useEffect, useRef, useState } from "react";

type EditorProps = {
  yText: Y.Text;
  provider: any;
};

export default function QuillEditor({ yText, provider }: EditorProps) {
  const reactQuillRef = useRef<ReactQuill>(null);

  // Set up Yjs and Quill
  useEffect(() => {
    if (!reactQuillRef.current) {
      return;
    }

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
  }, [yText, provider]);

  return (
    <div>
      <div>
        <ReactQuill
          placeholder="Start typing here…"
          ref={reactQuillRef}
          theme="snow"
          modules={{
            toolbar: false,
            history: {
              // Local undo shouldn't undo changes from remote users
              userOnly: true,
            },
          }}
        />
      </div>
    </div>
  );
}
