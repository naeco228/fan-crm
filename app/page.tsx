import { prisma } from '@/lib/prisma'
import { Dashboard } from '@/components/Dashboard'

export default async function DashboardPage() {
  // Получаем статистику напрямую из БД (можно и через API, но так проще)
  const totalClients = await prisma.client.count()
  
  const vipClients = await prisma.client.count({
    where: { status: 'vip' }
  })

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const inactiveClients = await prisma.client.count({
    where: {
      OR: [
        { lastContactAt: null },
        { lastContactAt: { lt: sevenDaysAgo } }
      ]
    }
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayReminders = await prisma.reminder.count({
    where: {
      done: false,
      dueAt: {
        gte: today,
        lt: tomorrow
      }
    }
  })

  const overdueReminders = await prisma.reminder.count({
    where: {
      done: false,
      dueAt: { lt: today }
    }
  })

  const recentClients = await prisma.client.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      tags: {
        include: { tag: true }
      }
    }
  })

  const stats = {
    totalClients,
    vipClients,
    inactiveClients,
    todayReminders,
    overdueReminders,
    recentClients
  }

  return <Dashboard stats={stats} />
}