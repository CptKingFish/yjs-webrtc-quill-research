import { useMemo } from "react";
import { Doc } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import useYjsAwareness, { type User } from "./use-yjs-awareness";

function useWebRtcProvider(user: User, documentId: string) {
  const ydoc = useMemo(() => new Doc({ guid: documentId }), [documentId]);
  const awareness = useYjsAwareness(user, ydoc);

  return useMemo(() => {
    const roomName = `yjs-webrtc-room-${documentId}`;
    return new WebrtcProvider(roomName, ydoc, {
      awareness,
    });
  }, [awareness, ydoc, documentId]);
}

export default useWebRtcProvider;
