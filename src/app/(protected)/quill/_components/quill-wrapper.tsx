import React, { useEffect } from "react";
import ReactQuill, { type ReactQuillProps } from "react-quill"; // Import ReactQuillProps if you need to pass any specific props to ReactQuill
import "react-quill/dist/quill.snow.css";

type QuillWrapperProps = {
  editorRef: React.Ref<ReactQuill>;
  setEditorReady: React.Dispatch<React.SetStateAction<boolean>>;
} & ReactQuillProps;

const QuillWrapper = ({
  editorRef,
  setEditorReady,
  ...props
}: QuillWrapperProps) => {
  useEffect(() => {
    setEditorReady(true);
    return () => {
      console.log("QuillWrapper unmounted");
    };
  }, [setEditorReady]);
  return <ReactQuill {...props} ref={editorRef} />;
};

export default QuillWrapper;
