import { z } from "zod";

export const todoListItemSchema = z.object({
  id: z.uuidv7(),
  title: z.string().min(1),
  description: z.string().optional(),
})

export const todoListSchema = z.object({
  todos: z.array(todoListItemSchema)
})
