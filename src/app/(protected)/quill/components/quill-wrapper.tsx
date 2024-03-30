"use client";

import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import QuillCursors from "quill-cursors";
import "react-quill/dist/quill.snow.css";
import { QuillBinding } from "y-quill";
import type * as Y from "yjs";
import { type Awareness } from "y-protocols/awareness";

ReactQuill.Quill.register("modules/cursors", QuillCursors);

type QuillWrapperProps = {
  yText?: Y.Text;
  awareness?: Awareness;
};

const QuillWrapper = ({ yText, awareness }: QuillWrapperProps) => {
  const quillRef = React.useRef<ReactQuill>(null);

  useEffect(() => {
    if (!quillRef.current || !yText || !awareness) {
      return;
    }

    const quill = quillRef.current.getEditor();

    const binding = new QuillBinding(yText, quill, awareness);

    // Cleanup
    return () => binding.destroy();
  }, [yText, awareness]);

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

export default QuillWrapper;
