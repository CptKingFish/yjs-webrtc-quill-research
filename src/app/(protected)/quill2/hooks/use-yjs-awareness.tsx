import { useMemo } from "react";
import { type Doc } from "yjs";
import * as awarenessProtocol from "y-protocols/awareness.js";

export interface User {
  name: string;
}

function useYjsAwareness(user: User, doc: Doc): awarenessProtocol.Awareness {
  return useMemo(() => {
    const awareness = new awarenessProtocol.Awareness(doc);
    awareness.setLocalStateField("user", {
      name: user.name,
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
    });
    return awareness;
  }, [user.name, doc]);
}

export default useYjsAwareness;
