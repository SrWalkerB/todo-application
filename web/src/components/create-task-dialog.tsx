import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useForm } from  "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/http/api-client";
import { toast } from "sonner"
import { useState } from "react";

const taskSchema = z.object({
  title: z.string().min(1, {
    message: "Task name is required"
  }),
  description: z.string().optional()
})

type TaskSchema = z.infer<typeof taskSchema>

export function CreateTaskDialog(){
  const [opengDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema)
  });

  function StructBaseInput({ children }: { children: React.ReactNode }) {
    return (
      <div className="grid flex-1 gap-2">
        {children}
      </div>
    );
  }

  const mutation = useMutation({
    mutationFn: async (newTask: TaskSchema) => {
      try {
        return await api.post("/todo", newTask)
      } catch(error){
        console.log("error",error)
        toast.error("Failed to create task")
      }
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["todos"]
      })
      setOpenDialog(false)
      toast.success("Task created successfully")
    }
  })

  async function handledFormSubmit(data: TaskSchema){
    try {
      mutation.mutate(data)
    } catch(error){
      console.log(error)
    }
  }

  return (
    <Dialog open={opengDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button>Create Task</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handledFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill in the information below to create a new task.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 mt-4">
            <StructBaseInput>
              <Label>
                Task Name
                <span className="text-destructive">*</span>
              </Label>

              <Input
                placeholder="Buy coffee"
                {...register("title")}
              />

              <p className="text-sm text-destructive">{errors.title?.message}</p>
            </StructBaseInput>

            <StructBaseInput>
              <Label>
                Description
              </Label>

              <Input
                placeholder="Need to buy coffee"
                {...register("description")}
              />

              <p className="text-sm text-destructive">{errors.description?.message}</p>
            </StructBaseInput>
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button className="cursor-pointer" variant={"destructive"}>Cancel</Button>
            </DialogClose>

            <Button className="cursor-pointer" type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
