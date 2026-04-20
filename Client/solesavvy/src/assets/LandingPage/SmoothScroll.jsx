import { ReactLenis } from 'lenis/react'
import { useEffect } from 'react'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Scroll to top on load optionally, or handle history restoration
  }, [])

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
      {children}
    </ReactLenis>
  )
}
