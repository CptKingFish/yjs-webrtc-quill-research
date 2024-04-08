import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { env } from "@/env";

const useYDocument = (
  roomName: string,
  username: string,
  initialState?: Uint8Array,
) => {
  const [doc, setDoc] = useState<Y.Doc | undefined>(undefined);
  const [provider, setProvider] = useState<WebrtcProvider | undefined>(
    undefined,
  );

  useEffect(() => {
    const yDoc = new Y.Doc();
    if (initialState) {
      Y.applyUpdate(yDoc, initialState);
    }

    const yProvider = new WebrtcProvider(roomName, yDoc, {
      signaling: [env.NEXT_PUBLIC_SIGNALING_SERVER_URL],
    });

    yProvider.awareness.setLocalStateField("user", {
      name: username,
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
    });

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yProvider.disconnect();
      yDoc.destroy();
      yProvider.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, username]);

  return { provider, doc };
};

export default useYDocument;
