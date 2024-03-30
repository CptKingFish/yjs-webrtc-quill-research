import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { env } from "@/env";

export const useYDocument = (roomName: string, username: string) => {
  const [doc, setDoc] = useState<Y.Doc | undefined>(undefined);
  const [provider, setProvider] = useState<WebrtcProvider | undefined>(
    undefined,
  );

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new WebrtcProvider(roomName, yDoc, {
      signaling: [env.NEXT_PUBLIC_SIGNALING_SERVER_URL],
    });

    yProvider.awareness.setLocalStateField("user", {
      name: username,
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
    });

    console.log("yProvider", yProvider);

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [roomName, username]);

  return { provider, doc };
};
