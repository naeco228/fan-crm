import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await context.params
    const body = await request.json()
    
    const contact = await prisma.contactLog.create({
      data: {
        clientId,
        contactType: body.contactType,
        summary: body.summary,
        fullNote: body.fullNote,
        contactedAt: new Date(body.contactedAt),
        nextFollowUpAt: body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : null
      }
    })

    await prisma.client.update({
      where: { id: clientId },
      data: { lastContactAt: new Date() }
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'Ошибка при добавлении контакта' },
      { status: 500 }
    )
  }
}