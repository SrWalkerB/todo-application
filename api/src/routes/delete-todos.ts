import { db } from "@/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod"

export const deleteTodos: FastifyPluginAsyncZod = async(app) => {
  app.delete(
    "/api/todos/:id",
    {
      schema: {
        summary: "Delete TODOs",
        tags: ["CRUD"],
        params: z.object({
          id: z.uuidv7()
        }),
        response: {
          404: z.object({
            message: z.string()
          }),
          201: z.object({
            message: z.string()
          })
        }
      },
    },
    async (request, reply) => {
      const response = await db
        .delete(todos)
        .where(eq(todos.id, request.params.id))
        .returning({
          id: todos.id
        })

      if(!response.length){
        return reply.status(404).send({
          message: "not found"
        })
      }

      return reply.send({
        message: response[0].id
      })
    }
  )
}
