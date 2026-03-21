import { ClientList } from '@/components/ClientList'

export default async function ClientsPage() {
  const clients = []
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Клиенты</h1>
      <ClientList clients={clients} />
    </div>
  )
}