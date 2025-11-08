import { TitlePage } from '@/components/title-page'
import { api } from '@/http/api-client'
import { todoListSchema } from '@/http/schemas/todos'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await api.get("/todos");
      const data = response.data;
      return todoListSchema.parse(data);
    },
  })

  return (
    <div>
      <TitlePage>
        Tasks
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </TitlePage>
    </div>
  )
}
