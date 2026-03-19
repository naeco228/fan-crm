import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/clients/[id] — получить одного клиента с его контактами и напоминаниями
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        contactLogs: {
          orderBy: {
            contactedAt: 'desc'
          }
        },
        reminders: {
          where: { done: false },
          orderBy: {
            dueAt: 'asc'
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Клиент не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении клиента' },
      { status: 500 }
    )
  }
}

// PATCH /api/clients/[id] — обновить клиента
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const client = await prisma.client.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении клиента' },
      { status: 500 }
    )
  }
}