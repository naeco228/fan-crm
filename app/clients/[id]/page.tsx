import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ClientDetails } from '@/components/ClientDetails'

export default async function ClientPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      contactLogs: {
        orderBy: {
          contactedAt: 'desc'
        }
      },
      reminders: {
        where: { done: false },
        orderBy: {
          dueAt: 'asc'
        }
      },
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  if (!client) {
    notFound()
  }

  return <ClientDetails client={client} />
}