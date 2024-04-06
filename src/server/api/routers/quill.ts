import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const quillRouter = createTRPCRouter({
  // updateInput: protectedProcedure
  //   .input(z.object({ inputId: z.string(), text: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const { inputId, text } = input;

  //     const updatedInput = await ctx.db.input.update({
  //       where: { id: inputId },
  //       data: { text },
  //     });

  //     return updatedInput;
  //   }),
  // bulkUpdateInputs: protectedProcedure
  //   .input(
  //     z.object({
  //       inputs: z.array(z.object({ id: z.string(), text: z.string() })),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const updatedInputs = await Promise.all(
  //       input.inputs.map(({ id, text }) =>
  //         ctx.db.input.update({
  //           where: { id },
  //           data: { text },
  //         }),
  //       ),
  //     );

  //     return updatedInputs;
  //   }),
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
        // Expect a base64 encoded string instead of a Uint8Array
        // state: z.string(),
        state: z.instanceof(Uint8Array),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { yDocumentId, state } = input;

      // Decode the base64 string to a Buffer before saving it
      // const buffer = Buffer.from(state, "base64");

      const updatedYDocumentState = await ctx.db.yDocument.update({
        where: { id: yDocumentId },
        data: { state: Buffer.from(state) },
      });

      return true;

      // return updatedYDocumentState;
    }),
});
