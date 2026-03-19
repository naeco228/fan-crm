import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Общее количество клиентов
    const totalClients = await prisma.client.count()

    // Количество VIP клиентов
    const vipClients = await prisma.client.count({
      where: { status: 'vip' }
    })

    // Неактивные (7+ дней без контакта)
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

    // Напоминания на сегодня
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

    // Просроченные напоминания
    const overdueReminders = await prisma.reminder.count({
      where: {
        done: false,
        dueAt: { lt: today }
      }
    })

    // Активные напоминания всего
    const activeReminders = await prisma.reminder.count({
      where: { done: false }
    })

    // Последние добавленные клиенты
    const recentClients = await prisma.client.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        tags: {
          include: { tag: true }
        }
      }
    })

    // Статистика по платформам
    const platforms = await prisma.client.groupBy({
      by: ['platform'],
      _count: true,
      where: {
        platform: { not: null }
      }
    })

    return NextResponse.json({
      totalClients,
      vipClients,
      inactiveClients,
      todayReminders,
      overdueReminders,
      activeReminders,
      recentClients,
      platforms
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении статистики' },
      { status: 500 }
    )
  }
}