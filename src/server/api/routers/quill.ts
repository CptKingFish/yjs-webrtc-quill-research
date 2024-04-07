import { z } from "zod";
import * as Y from "yjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const quillRouter = createTRPCRouter({
  getInputsByRoomId: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const inputs = await ctx.db.input.findMany({
        where: { roomId: input.roomId },
      });

      return inputs;
    }),
  getYDocumentByRoomId: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const yDocumentRaw = await ctx.db.yDocument.findFirst({
        where: { roomId: input.roomId },
      });

      const yDocument = {
        ...yDocumentRaw,
        state: yDocumentRaw?.state?.toString("base64"),
      };

      return yDocument;
    }),
  updateYDocumentState: protectedProcedure
    .input(
      z.object({
        yDocumentId: z.string(),
        state: z.instanceof(Uint8Array),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { yDocumentId, state } = input;

      const newDoc = new Y.Doc();
      Y.applyUpdate(newDoc, state);

      const inputUpdates = Array.from(newDoc.share.keys()).map((key) => {
        return ctx.db.input.update({
          where: { id: key },
          data: {
            delta: JSON.stringify(newDoc.getText(key).toDelta()),
          },
        });
      });

      // update inputs with the new state and ydocument in a prisma transaction
      const updateTransaction = await ctx.db.$transaction([
        // update delta for each input
        ...inputUpdates,
        ctx.db.yDocument.update({
          where: { id: yDocumentId },
          data: { state: Buffer.from(state) },
        }),
      ]);

      return true;
    }),
});
