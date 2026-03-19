'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import Link from 'next/link'

interface Reminder {
  id: string
  title: string
  dueAt: string
  client: {
    id: string
    displayName: string
  }
}

export function ReminderBoard({ reminders: initialReminders }: { reminders: Reminder[] }) {
  const router = useRouter()
  const [reminders, setReminders] = useState(initialReminders)

  const completeReminder = async (reminderId: string) => {
    try {
      const res = await fetch(`/api/reminders/${reminderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: true })
      })

      if (res.ok) {
        setReminders(reminders.filter(r => r.id !== reminderId))
        router.refresh()
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  // Группируем напоминания по датам
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const overdue = reminders.filter(r => new Date(r.dueAt) < today)
  const todayReminders = reminders.filter(r => {
    const date = new Date(r.dueAt)
    return date >= today && date < tomorrow
  })
  const future = reminders.filter(r => new Date(r.dueAt) >= tomorrow)

  return (
    <div className="space-y-8">
      {overdue.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Просрочено ({overdue.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {overdue.map(reminder => (
                <ReminderItem 
                  key={reminder.id} 
                  reminder={reminder} 
                  onComplete={completeReminder}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Сегодня ({todayReminders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {todayReminders.length > 0 ? (
            <div className="space-y-3">
              {todayReminders.map(reminder => (
                <ReminderItem 
                  key={reminder.id} 
                  reminder={reminder} 
                  onComplete={completeReminder}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">На сегодня нет напоминаний</p>
          )}
        </CardContent>
      </Card>

      {future.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Предстоящие ({future.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {future.map(reminder => (
                <ReminderItem 
                  key={reminder.id} 
                  reminder={reminder} 
                  onComplete={completeReminder}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ReminderItem({ reminder, onComplete }: { reminder: Reminder, onComplete: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
      <div>
        <Link 
          href={`/clients/${reminder.client.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          {reminder.client.displayName}
        </Link>
        <p className="font-medium">{reminder.title}</p>
        <p className="text-sm text-gray-500">
          {format(new Date(reminder.dueAt), 'dd MMM yyyy', { locale: ru })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onComplete(reminder.id)}
        className="text-green-600 hover:text-green-800"
      >
        ✓ Готово
      </Button>
    </div>
  )
}