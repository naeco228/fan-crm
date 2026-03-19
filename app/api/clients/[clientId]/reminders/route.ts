import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await context.params
    const body = await request.json()
    
    const reminder = await prisma.reminder.create({
      data: {
        clientId: clientId,
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