import React from "react";
import dynamic from "next/dynamic";

// Dynamically import QuillEditor as a client component
const YjsQuillRoom = dynamic(() => import("./components/yjs-quill-room"), {
  ssr: false,
});

export default function QuillPage() {
  return (
    <div>
      <h1>Collaborative Editing</h1>
      <YjsQuillRoom />
    </div>
  );
}
