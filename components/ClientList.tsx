


'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ClientForm } from './ClientForm'   

interface Client {
  id: string
  displayName: string
  platform: string | null
  username: string | null
  country: string | null
  status: string | null
  totalSpent: number
  tags: Array<{
    tag: {
      name: string
    }
  }>
}

export function ClientList({ clients: initialClients }: { clients: Client[] }) {
  const [clients, setClients] = useState(initialClients)
  const [search, setSearch] = useState('')

  const filteredClients = clients.filter(client =>
    client.displayName.toLowerCase().includes(search.toLowerCase()) ||
    client.username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Поиск клиентов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>Новый клиент</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать нового клиента</DialogTitle>
            </DialogHeader>
            <ClientForm onClientAdded={(newClient) => {
              setClients([newClient, ...clients])
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Имя</TableHead>
            <TableHead>Платформа</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Страна</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Потрачено</TableHead>
            <TableHead>Теги</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
  <Link href={`/clients/${client.id}`} className="hover:underline">
    {client.displayName}
  </Link>
</TableCell>
              <TableCell>{client.platform || '-'}</TableCell>
              <TableCell>{client.username || '-'}</TableCell>
              <TableCell>{client.country || '-'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  client.status === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                  client.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {client.status || 'active'}
                </span>
              </TableCell>
              <TableCell>${client.totalSpent}</TableCell>
              <TableCell>
  <div className="flex gap-1 flex-wrap">
    {client.tags && client.tags.length > 0 ? (
      client.tags.map((t: any, i: number) => (
        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {t.tag.name}
        </span>
      ))
    ) : (
      <span className="text-gray-400 text-xs">—</span>
    )}
  </div>
</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}