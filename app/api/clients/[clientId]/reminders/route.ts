import { NextRequest, NextResponse } from 'next/server'

// УДАЛЯЕМ POST НАХРЕН, ЕСЛИ ОН НЕ НУЖЕН
// Оставляем только PATCH

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ reminderId: string }> }
) {
  try {
    const { reminderId } = await context.params
    const body = await request.json()
    
    return NextResponse.json({ 
      id: reminderId,
      done: body.done,
      message: 'Temporary response' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error' },
      { status: 500 }
    )
  }
}

// ЕСЛИ POST ВООБЩЕ НЕ ИСПОЛЬЗУЕТСЯ — УДАЛИ ЕГО ПОЛНОСТЬЮ
// export async function POST(...) { ... } // <-- УДАЛИ ЭТУ ФУНКЦИЮ