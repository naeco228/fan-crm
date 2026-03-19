import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/reminders/[reminderId] — обновить напоминание (отметить выполненным)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ reminderId: string }> }
) {
  try {
    const { reminderId } = await context.params
    const body = await request.json()
    
    const reminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: { done: body.done }
    })

    return NextResponse.json(reminder)
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении напоминания' },
      { status: 500 }
    )
  }
}