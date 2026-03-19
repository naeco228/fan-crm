import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/clients/[id]/contacts — добавить контакт
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const contact = await prisma.contactLog.create({
      data: {
        clientId: params.id,
        contactType: body.contactType,
        summary: body.summary,
        fullNote: body.fullNote,
        contactedAt: new Date(body.contactedAt),
        nextFollowUpAt: body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : null
      }
    })

    // Обновляем lastContactAt у клиента
    await prisma.client.update({
      where: { id: params.clientId },
      data: { lastContactAt: new Date() }
    })

    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при добавлении контакта' },
      { status: 500 }
    )
  }
}