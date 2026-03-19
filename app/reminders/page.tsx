import { prisma } from '@/lib/prisma'  
import { ReminderBoard } from '@/components/ReminderBoard'

export default async function RemindersPage() {
  const reminders = await prisma.reminder.findMany({
    where: { done: false },
    include: {
      client: {
        select: {
          id: true,
          displayName: true
        }
      }
    },
    orderBy: {
      dueAt: 'asc'
    }
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Напоминания</h1>
      <ReminderBoard reminders={reminders} />
    </div>
  )
}