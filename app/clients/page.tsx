import { ClientList } from '@/components/ClientList'

export default async function ClientsPage() {
  // Временно возвращаем пустой массив, пока не настроим БД
  const clients = []
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Клиенты</h1>
      <ClientList clients={clients} />
    </div>
  )
}