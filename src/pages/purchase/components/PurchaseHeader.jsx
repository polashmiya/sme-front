// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

export default function PurchaseHeader({ title, right }) {
  return (
    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} className="flex items-center justify-between mb-4">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">{right}</div>
    </motion.div>
  )
}
