'use client'

import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"

export function AuthButton() {
  const { data: session } = useSession()
  
  if (!session) return null

  return (
    <Button variant="ghost" onClick={() => signOut()}>
      Выйти
    </Button>
  )
}