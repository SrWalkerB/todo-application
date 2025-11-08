import { db } from "@/db";
import { todos } from "@/db/schema";
import { desc } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listTodos: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/todos",
    {
      schema: {
        summary: "List TODOs",
        tags: ["CRUD"],
        querystring: z.object({
          limit: z.coerce.number().max(100).default(10),
        }),
        response: {
          200: z.object({
            todos: z.array(
              createSelectSchema(todos).omit({
                createdAt: true,
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit } = request.query;

      const response = await db
        .select()
        .from(todos)
        .orderBy(desc(todos.createdAt))
        .limit(limit);

      return reply.send({
        todos: response,
      });
    },
  );
};
