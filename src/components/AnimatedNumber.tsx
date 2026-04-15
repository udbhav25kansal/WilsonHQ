import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

type AnimatedNumberProps = {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
  prefix?: string
  suffix?: string
  delay?: number
}

export default function AnimatedNumber({
  value,
  duration = 1.0,
  format,
  className = '',
  prefix = '',
  suffix = '',
  delay = 0,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) =>
    format ? format(latest) : Math.round(latest).toString()
  )
  const [display, setDisplay] = useState(format ? format(0) : '0')

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    })
    const unsub = rounded.on('change', (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsub()
    }
  }, [value, duration, delay, motionValue, rounded])

  return (
    <motion.span className={`tabular ${className}`}>
      {prefix}
      {display}
      {suffix}
    </motion.span>
  )
}
