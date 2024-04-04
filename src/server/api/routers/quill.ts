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
});
