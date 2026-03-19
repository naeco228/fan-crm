import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const body = await request.json()
    
    const contact = await prisma.contactLog.create({
      data: {
        clientId: params.clientId,
        contactType: body.contactType,
        summary: body.summary,
        fullNote: body.fullNote,
        contactedAt: new Date(body.contactedAt),
        nextFollowUpAt: body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : null
      }
    })

  
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