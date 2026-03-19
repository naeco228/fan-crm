import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { reminderId: string } }
) {
  try {
    const body = await request.json()
    
    const reminder = await prisma.reminder.update({
      where: { id: params.reminderId },
      data: { done: body.done }
    })

    return NextResponse.json(reminder)
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении напоминания' },
      { status: 500 }
    )
  }
}