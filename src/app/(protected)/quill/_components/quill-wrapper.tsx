import React from "react";
import ReactQuill, { type ReactQuillProps } from "react-quill"; // Import ReactQuillProps if you need to pass any specific props to ReactQuill
import "react-quill/dist/quill.snow.css";

const QuillWrapper = React.forwardRef<
  ReactQuill,
  ReactQuillProps & {
    innerRef?: React.Ref<ReactQuill>;
  }
>((props, ref) => {
  console.log("innerRef", ref);

  return <ReactQuill ref={props.innerRef} {...props} />;
  //   return <ReactQuill ref={ref} {...props} />;
});

QuillWrapper.displayName = "QuillWrapper"; // Providing a display name

export default QuillWrapper;
