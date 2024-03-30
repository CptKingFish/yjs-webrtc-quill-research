"use client";

import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import ReactQuill from "react-quill";
import QuillCursors from "quill-cursors";
import "react-quill/dist/quill.snow.css";
import { QuillBinding } from "y-quill";
import type { ReactQuillProps } from "react-quill";
import type * as Y from "yjs";
import type { WebrtcProvider } from "y-webrtc";

ReactQuill.Quill.register("modules/cursors", QuillCursors);

type QuillWrapperProps = {
  yText?: Y.Text;
  provider?: WebrtcProvider;
  setEditorReady: React.Dispatch<React.SetStateAction<boolean>>;
} & ReactQuillProps;

const QuillWrapper = forwardRef<ReactQuill, QuillWrapperProps>(
  ({ yText, provider, setEditorReady, ...props }, ref) => {
    const quillRef = React.useRef<ReactQuill>(null);

    // Expose ReactQuill's methods to the parent component through forwarded ref
    useImperativeHandle(ref, () => quillRef.current!);

    useEffect(() => {
      if (!quillRef.current || !yText || !provider) {
        setEditorReady(false);
        return;
      }

      const quill = quillRef.current.getEditor();

      // Initialize Y.js Quill binding
      const binding = new QuillBinding(yText, quill, provider.awareness);

      setEditorReady(true);

      // Cleanup
      return () => binding.destroy();
    }, [yText, provider, setEditorReady]);

    return <ReactQuill ref={quillRef} {...props} />;
  },
);

QuillWrapper.displayName = "QuillWrapper";

export default QuillWrapper;
