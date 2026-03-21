import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении клиентов' },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const client = await prisma.client.create({
      data: {
        displayName: body.displayName,
        platform: body.platform || null,
        username: body.username || null,
        country: body.country || null,
        language: body.language || null,
        interests: body.interests || null,
        notes: body.notes || null,
        status: body.status || 'active',
        totalSpent: body.totalSpent || 0,
      }
    })
    
    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании клиента' },
      { status: 500 }
    )
  }
}