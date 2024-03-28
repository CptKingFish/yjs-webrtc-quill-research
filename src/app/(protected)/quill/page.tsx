"use client";

import QuillEditor from "./_components/quill-editor";

import * as Y from "yjs";

import { useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";

export default function QuillPage() {
  const [text, setText] = useState<Y.Text>();
  const [provider, setProvider] = useState<any>();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yText = yDoc.getText("quill");
    const yProvider = new WebrtcProvider("kingfish", yDoc, {
      //Remember the other tab or
      //other user should be in same room for seeing real-time changes
      signaling: [
        "wss://04yc9jtapd.execute-api.ap-southeast-1.amazonaws.com/dev",
      ],
    });
    setText(yText);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, []);

  if (!text || !provider) {
    return null;
  }

  return <QuillEditor yText={text} provider={provider} />;
}
