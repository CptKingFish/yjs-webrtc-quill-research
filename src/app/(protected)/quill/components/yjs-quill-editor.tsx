"use client";

import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import QuillCursors from "quill-cursors";
import "react-quill/dist/quill.snow.css";
import { QuillBinding } from "y-quill";
import type * as Y from "yjs";
import { type Awareness } from "y-protocols/awareness";
import { type Delta } from "quill";

ReactQuill.Quill.register("modules/cursors", QuillCursors);

type YjsQuillEditorProps = {
  yText: Y.Text;
  awareness: Awareness;
  initialDelta: Delta;
  userCount: number;
};

const YjsQuillEditor = ({
  yText,
  awareness,
  initialDelta,
  userCount,
}: YjsQuillEditorProps) => {
  const quillRef = React.useRef<ReactQuill>(null);

  useEffect(() => {
    if (!quillRef.current || !yText || !awareness) {
      return;
    }

    const quill = quillRef.current.getEditor();

    const binding = new QuillBinding(yText, quill, awareness);

    // const fetchFallback = () => {
    //   if (userCount < 2) {
    //     quill.setContents(initialDelta);
    //   }
    // };

    // const timeoutId = window.setTimeout(fetchFallback, 1000);

    return () => {
      binding.destroy();
      // window.clearTimeout(timeoutId);
    };
  }, [yText, awareness, userCount, initialDelta]);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      modules={{
        cursors: true,
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        history: {
          userOnly: true,
        },
      }}
    />
  );
};

export default YjsQuillEditor;
