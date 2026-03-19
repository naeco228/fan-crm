'use client'

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"

export function AuthButton() {
  return (
    <Button variant="ghost" onClick={() => signOut()}>
      Выйти
    </Button>
  )
}