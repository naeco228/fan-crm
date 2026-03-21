import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await context.params

    const client = await prisma.client.findUnique({
      where: { id: clientId },
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
    console.error('GET error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении клиента' },
      { status: 500 }
    )
  }
}


export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await context.params
    const body = await request.json()
    
    const client = await prisma.client.update({
      where: { id: clientId },
      data: body
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении клиента' },
      { status: 500 }
    )
  }
}