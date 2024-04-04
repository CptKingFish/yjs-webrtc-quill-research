"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const YjsQuillEditor = dynamic(() => import("./yjs-quill-editor"), {
  ssr: false,
});

export default function YjsQuillRoom() {
  const { data: session } = useSession();

  return (
    <div>
      <YjsQuillEditor />
    </div>
  );
}
