import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await context.params
    const { tagId, action } = await request.json()

    if (action === 'add') {
      await prisma.clientTag.create({
        data: {
          clientId,
          tagId
        }
      })
    } else if (action === 'remove') {
      await prisma.clientTag.delete({
        where: {
          clientId_tagId: {
            clientId,
            tagId
          }
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tags error:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении тегов' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await context.params
    const tags = await prisma.clientTag.findMany({
      where: { clientId },
      include: { tag: true }
    })
    return NextResponse.json(tags.map(t => t.tag.name))
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении тегов' },
      { status: 500 }
    )
  }
}