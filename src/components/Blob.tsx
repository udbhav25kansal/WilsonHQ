import { motion } from 'framer-motion'

type BlobProps = {
  color: 'sage' | 'coral' | 'lavender'
  size?: number
  className?: string
  style?: React.CSSProperties
  delay?: number
}

const colorMap = {
  sage: '#dce6d5',
  coral: '#f2d9cc',
  lavender: '#e3dced',
}

export default function Blob({ color, size = 280, className = '', style, delay = 0 }: BlobProps) {
  return (
    <motion.div
      aria-hidden
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: colorMap[color],
        opacity: 0.55,
        filter: 'blur(2px)',
        zIndex: 0,
        ...style,
      }}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.55 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
    />
  )
}

export function Leaf({ className = '', style, rotate = -35 }: { className?: string; style?: React.CSSProperties; rotate?: number }) {
  return (
    <div
      aria-hidden
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: 14,
        height: 14,
        background: '#8fa882',
        borderRadius: '50% 0 50% 50%',
        transform: `rotate(${rotate}deg)`,
        opacity: 0.6,
        zIndex: 0,
        ...style,
      }}
    />
  )
}
