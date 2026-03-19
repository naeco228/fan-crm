import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/clients/[id]/reminders — создать напоминание
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const reminder = await prisma.reminder.create({
      data: {
        clientId: params.clientId,
        title: body.title,
        dueAt: new Date(body.dueAt)
      }
    })

    return NextResponse.json(reminder)
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при создании напоминания' },
      { status: 500 }
    )
  }
}

// PATCH /api/clients/[id]/reminders/[reminderId] — отметить выполненным
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; reminderId: string } }
) {
  try {
    const reminder = await prisma.reminder.update({
      where: { id: params.clientId },
      data: { done: true }
    })

    return NextResponse.json(reminder)
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении напоминания' },
      { status: 500 }
    )
  }
}