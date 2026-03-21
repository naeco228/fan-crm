'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const AVAILABLE_TAGS = [
  { id: 'vip', name: 'VIP' },
  { id: 'warm', name: 'Warm' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'gamer', name: 'Gamer' },
  { id: 'gym', name: 'Gym' },
  { id: 'talkative', name: 'Talkative' },
]

interface TagSelectorProps {
  clientId: string
  initialTags: string[]
  onTagsChange?: () => void
}

export function TagSelector({ clientId, initialTags, onTagsChange }: TagSelectorProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [loading, setLoading] = useState(false)

  const handleTagToggle = async (tagId: string, checked: boolean) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/clients/${clientId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId, action: checked ? 'add' : 'remove' })
      })

      if (res.ok) {
        setSelectedTags(prev =>
          checked ? [...prev, tagId] : prev.filter(t => t !== tagId)
        )
        onTagsChange?.()
      }
    } catch (error) {
      console.error('Ошибка:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Теги</Label>
      <div className="flex flex-wrap gap-3">
        {AVAILABLE_TAGS.map(tag => (
          <div key={tag.id} className="flex items-center space-x-2">
            <Checkbox
              id={`tag-${tag.id}`}
              checked={selectedTags.includes(tag.id)}
              onCheckedChange={(checked) => handleTagToggle(tag.id, checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor={`tag-${tag.id}`} className="text-sm cursor-pointer">
              {tag.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}