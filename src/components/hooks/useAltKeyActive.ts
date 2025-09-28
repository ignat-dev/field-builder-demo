import { useEffect, useState } from "react"

export function useAltKeyActive() {
  const [altActive, setAltActive] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        setAltActive(true)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) {
        setAltActive(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return altActive
}
