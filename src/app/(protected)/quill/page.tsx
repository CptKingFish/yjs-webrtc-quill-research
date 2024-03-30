import React from "react";
import dynamic from "next/dynamic";

// Dynamically import QuillEditor as a client component
const QuillEditor = dynamic(() => import("./components/quill-editor"), {
  ssr: false,
});

export default function QuillPage() {
  return (
    <div>
      <h1>Collaborative Editing</h1>
      <QuillEditor />
    </div>
  );
}
