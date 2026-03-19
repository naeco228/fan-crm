'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface ClientDetailsProps {
  client: any // TODO: нормальный тип
}

export function ClientDetails({ client: initialClient }: ClientDetailsProps) {
  const router = useRouter()
  const [client, setClient] = useState(initialClient)
  const [newContact, setNewContact] = useState({
    contactType: 'message',
    summary: '',
    fullNote: '',
    contactedAt: new Date().toISOString().split('T')[0],
    nextFollowUpAt: ''
  })
  const [newReminder, setNewReminder] = useState({
    title: '',
    dueAt: new Date().toISOString().split('T')[0]
  })

  const addContact = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch(`/api/clients/${client.id}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      })

      if (res.ok) {
        const contact = await res.json()
        setClient({
          ...client,
          contactLogs: [contact, ...client.contactLogs],
          lastContactAt: new Date().toISOString()
        })
        setNewContact({
          contactType: 'message',
          summary: '',
          fullNote: '',
          contactedAt: new Date().toISOString().split('T')[0],
          nextFollowUpAt: ''
        })
        router.refresh()
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  const addReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch(`/api/clients/${client.id}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReminder)
      })

      if (res.ok) {
        const reminder = await res.json()
        setClient({
          ...client,
          reminders: [...client.reminders, reminder]
        })
        setNewReminder({
          title: '',
          dueAt: new Date().toISOString().split('T')[0]
        })
        router.refresh()
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  const completeReminder = async (reminderId: string) => {
    try {
      const res = await fetch(`/api/clients/${client.id}/reminders/${reminderId}`, {
        method: 'PATCH'
      })

      if (res.ok) {
        setClient({
          ...client,
          reminders: client.reminders.filter((r: any) => r.id !== reminderId)
        })
        router.refresh()
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        ← Назад
      </Button>

      <div className="grid grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{client.displayName}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Платформа</dt>
                  <dd>{client.platform || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Username</dt>
                  <dd>{client.username || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Страна</dt>
                  <dd>{client.country || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Язык</dt>
                  <dd>{client.language || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Статус</dt>
                  <dd>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      client.status === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                      client.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {client.status || 'active'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Потрачено всего</dt>
                  <dd>${client.totalSpent}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Последний контакт</dt>
                  <dd>{client.lastContactAt ? format(new Date(client.lastContactAt), 'dd MMM yyyy', { locale: ru }) : '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Теги</dt>
                  <dd>
                    <div className="flex gap-1 flex-wrap">
                      {client.tags.map((t: any) => (
                        <span key={t.tag.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {t.tag.name}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              </dl>
              {client.notes && (
                <div className="mt-4">
                  <dt className="text-sm text-gray-500">Заметки</dt>
                  <dd className="mt-1 p-3 bg-gray-50 rounded">{client.notes}</dd>
                </div>
              )}
            </CardContent>
          </Card>

          {/* История контактов */}
          <Card>
            <CardHeader>
              <CardTitle>История контактов</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4">Новый контакт</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить контакт</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={addContact} className="space-y-4">
                    <div>
                      <Label>Тип контакта</Label>
                      <Select
                        value={newContact.contactType}
                        onValueChange={(value) => setNewContact({ ...newContact, contactType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="message">Сообщение</SelectItem>
                          <SelectItem value="call">Звонок</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="meeting">Встреча</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="summary">Кратко</Label>
                      <Input
                        id="summary"
                        required
                        value={newContact.summary}
                        onChange={(e) => setNewContact({ ...newContact, summary: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fullNote">Подробно</Label>
                      <Textarea
                        id="fullNote"
                        value={newContact.fullNote}
                        onChange={(e) => setNewContact({ ...newContact, fullNote: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactedAt">Дата контакта</Label>
                      <Input
                        id="contactedAt"
                        type="date"
                        required
                        value={newContact.contactedAt}
                        onChange={(e) => setNewContact({ ...newContact, contactedAt: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nextFollowUp">Следующий контакт</Label>
                      <Input
                        id="nextFollowUp"
                        type="date"
                        value={newContact.nextFollowUpAt}
                        onChange={(e) => setNewContact({ ...newContact, nextFollowUpAt: e.target.value })}
                      />
                    </div>
                    <Button type="submit">Сохранить</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <div className="space-y-4">
                {client.contactLogs.map((contact: any) => (
                  <div key={contact.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{contact.contactType}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {format(new Date(contact.contactedAt), 'dd MMM yyyy', { locale: ru })}
                        </span>
                      </div>
                      {contact.nextFollowUpAt && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Follow-up: {format(new Date(contact.nextFollowUpAt), 'dd MMM yyyy', { locale: ru })}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-medium">{contact.summary}</p>
                    {contact.fullNote && (
                      <p className="mt-1 text-sm text-gray-600">{contact.fullNote}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Напоминания */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Напоминания</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4 w-full">Новое напоминание</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать напоминание</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={addReminder} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Заголовок</Label>
                      <Input
                        id="title"
                        required
                        value={newReminder.title}
                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueAt">Дата</Label>
                      <Input
                        id="dueAt"
                        type="date"
                        required
                        value={newReminder.dueAt}
                        onChange={(e) => setNewReminder({ ...newReminder, dueAt: e.target.value })}
                      />
                    </div>
                    <Button type="submit">Создать</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <div className="space-y-3">
                {client.reminders.map((reminder: any) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{reminder.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(reminder.dueAt), 'dd MMM yyyy', { locale: ru })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => completeReminder(reminder.id)}
                    >
                      ✓
                    </Button>
                  </div>
                ))}
                {client.reminders.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Нет активных напоминаний</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}