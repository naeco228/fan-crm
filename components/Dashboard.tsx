'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Users, 
  Crown, 
  Clock, 
  Bell, 
  AlertCircle,
  UserPlus
} from 'lucide-react'

interface DashboardProps {
  stats: {
    totalClients: number
    vipClients: number
    inactiveClients: number
    todayReminders: number
    overdueReminders: number
    recentClients: Array<{
      id: string
      displayName: string
      platform: string | null
      createdAt: string
      tags: Array<{
        tag: { name: string }
      }>
    }>
  }
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">приветик-минетик
		
		дэшборд</h1>
        <Link href="/clients">
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Новый клиент
          </Button>
        </Link>
      </div>

      {/* Карточки со статистикой */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Всего клиентов</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">VIP клиенты</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vipClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Неактивные 7+ дней</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactiveClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Напоминания</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayReminders}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.overdueReminders} просрочено
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Предупреждение о просроченных */}
      {stats.overdueReminders > 0 && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">
              У вас {stats.overdueReminders} просроченных напоминаний.
              {' '}
              <Link href="/reminders" className="underline font-medium">
                Перейти к напоминаниям
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Последние клиенты */}
      <Card>
        <CardHeader>
          <CardTitle>Последние добавленные клиенты</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentClients.length > 0 ? (
            <div className="divide-y">
              {stats.recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 -mx-2 rounded"
                >
                  <div>
                    <p className="font-medium">{client.displayName}</p>
                    <p className="text-sm text-gray-500">
                      {client.platform || 'Нет платформы'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {client.tags.map((t, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {t.tag.name}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Пока нет клиентов. 
              <Link href="/clients" className="text-blue-500 hover:underline ml-1">
                Создать первого
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}