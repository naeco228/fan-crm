'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ClientForm({ onClientAdded }: { onClientAdded: (client: any) => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    platform: '',
    username: '',
    country: '',
    language: '',
    interests: '',
    notes: '',
    status: 'active',
    totalSpent: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const newClient = await res.json()
        onClientAdded(newClient)
        // Очистить форму
        setFormData({
          displayName: '',
          platform: '',
          username: '',
          country: '',
          language: '',
          interests: '',
          notes: '',
          status: 'active',
          totalSpent: 0,
        })
      }
    } catch (error) {
      console.error('Ошибка:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="displayName">Имя *</Label>
        <Input
          id="displayName"
          required
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="platform">Платформа</Label>
          <Input
            id="platform"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Страна</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="language">Язык</Label>
          <Input
            id="language"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="interests">Интересы</Label>
        <Input
          id="interests"
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="notes">Заметки</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="status">Статус</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Активный</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="inactive">Неактивный</SelectItem>
          </SelectContent>
        </Select>
      </div>

     <div>
  <Label htmlFor="totalSpent">Потрачено всего ($)</Label>
  <Input
    id="totalSpent"
    type="number"
    step="0.01"
    min="0"
    value={formData.totalSpent}
    onChange={(e) => {
      const value = e.target.value === '' ? 0 : parseFloat(e.target.value)
      setFormData({ ...formData, totalSpent: value })
    }}
  />
</div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : 'Создать клиента'}
      </Button>
    </form>
  )
}