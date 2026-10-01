import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import {
  FaBook,
  FaAward,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaGraduationCap,
} from 'react-icons/fa'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const publications = [
  {
    title:
      'Smart Beauty and Fashion Advisor Using Computer Vision and Machine Learning',
    conference:
      'International Conference on Responsible, Risk-Aware and Regulated AI (RRRAI-2026)',
    year: '2026',
    tag: 'AI / Computer Vision',
    description:
      'Published and presented research on integrating Machine Learning and Computer Vision models for real-time skin tone analysis and personalized fashion recommendations.',
    link: '/assets/publication.pdf',
  },
]

/* ------------------------------------------------------------------ */
/*  STYLES                                                             */
/* ------------------------------------------------------------------ */

const styles = `
  @keyframes shimmer {
    to { background-position: 200% center; }
  }
  .shimmer-text {
    background-image: linear-gradient(90deg, #22d3ee 0%, #a5f3fc 25%, #818cf8 50%, #a5f3fc 75%, #22d3ee 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shimmer 4s linear infinite;
  }
`

/* ------------------------------------------------------------------ */
/*  CURSOR GLOW                                                        */
/* ------------------------------------------------------------------ */

const CursorGlow = () => {
  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, { stiffness: 110, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 110, damping: 20, mass: 0.4 })

  if (typeof window !== 'undefined') {
    window.addEventListener?.('pointermove', (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    })
  }

  return (
    <motion.div
      aria-hidden
      style={{ left: sx, top: sy }}
      className="pointer-events-none fixed z-0 hidden h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.10),transparent_60%)] blur-2xl" />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  WORD REVEAL                                                        */
/* ------------------------------------------------------------------ */

const WordReveal = ({ text, delay = 0, className = '' }) => {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ delay: delay + i * 0.03, duration: 0.5, ease: 'easeOut' }}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  PUBLICATION ENTRY — open editorial layout, no box                  */
/* ------------------------------------------------------------------ */

const PublicationEntry = ({ pub, index }) => {
  const entryRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const y = useMotionValue(0)
  const sy = useSpring(y, { stiffness: 120, damping: 20 })

  const handleMove = (e) => {
    const rect = entryRef.current?.getBoundingClientRect()
    if (!rect) return
    const py = e.clientY - rect.top
    y.set((0.5 - py / rect.height) * 6)
  }

  const handleLeave = () => {
    y.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 60, damping: 16, delay: index * 0.15 }}
      className="group relative"
    >
      {/* ---------------- TIMELINE ACCENT ---------------- */}
      <div className="absolute left-0 top-2 hidden h-full w-px bg-gradient-to-b from-cyan-500/40 via-cyan-500/10 to-transparent md:block" />

      {/* glowing node */}
      <motion.span
        animate={{
          boxShadow: hovered
            ? '0 0 20px rgba(34,211,238,1)'
            : '0 0 10px rgba(34,211,238,0.5)',
        }}
        transition={{ duration: 0.3 }}
        className="absolute -left-[5px] top-3 hidden h-2.5 w-2.5 rounded-full bg-cyan-400 md:block"
      />

      {/* ---------------- CONTENT ---------------- */}
      <motion.div
        ref={entryRef}
        onPointerMove={handleMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={handleLeave}
        style={{ y: sy }}
        className="md:pl-12"
      >
        {/* Top meta row */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-400"
          >
            {pub.year}
          </motion.span>

          <span className="h-px w-8 bg-cyan-500/40" />

          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.28, duration: 0.4 }}
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-purple-300/90"
          >
            <FaAward className="text-[10px]" /> {pub.tag}
          </motion.span>
        </div>

        {/* Icon + title row */}
        <div className="mb-5 flex items-start gap-4">
          <motion.div
            animate={{
              boxShadow: hovered
                ? '0 0 30px rgba(34,211,238,0.85)'
                : '0 0 12px rgba(34,211,238,0.35)',
              rotate: hovered ? 6 : 0,
            }}
            transition={{ duration: 0.4 }}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg text-white"
          >
            <FaBook />
          </motion.div>

          <h3 className="text-2xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-cyan-400 md:text-3xl">
            <WordReveal text={pub.title} delay={0.35} />
          </h3>
        </div>

        {/* Conference */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-6 flex items-start gap-2.5 text-sm font-medium text-cyan-300/90 md:pl-16"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"
          />
          <span className="flex items-start gap-2">
            <FaGraduationCap className="mt-0.5 text-cyan-400/70" />
            {pub.conference}
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mb-7 max-w-3xl leading-relaxed text-gray-400 md:pl-16"
        >
          {pub.description}
        </motion.p>

        {/* Action row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-wrap items-center gap-4 md:pl-16"
        >
          <motion.a
            href={pub.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-200"
          >
            <FaBook size={13} />
            <span className="relative">
              Read Paper
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-cyan-400 transition-transform duration-300 group-hover/btn:scale-x-100" />
            </span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FaExternalLinkAlt size={11} />
            </motion.span>
          </motion.a>

          <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600 sm:flex">
            <span className="h-px w-6 bg-gray-700" />
            peer-reviewed
          </span>
        </motion.div>
      </motion.div>

      {/* divider at bottom */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        className="mt-14 h-px w-full origin-left bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent md:pl-12"
      />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const Publications = () => {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-white">
      <style>{styles}</style>
      <CursorGlow />

      {/* ---------------- HEADER ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        viewport={{ once: true }}
        className="z-10 mb-20 w-full max-w-4xl"
      >
        

        <h2 className="mb-5 text-4xl font-bold md:text-6xl">
          <span className="shimmer-text">Publications</span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          className="mb-6 h-px w-56 origin-left bg-gradient-to-r from-cyan-400 to-transparent"
        />

        <p className="max-w-2xl text-gray-400">
          Peer-reviewed research work published in international conferences.
        </p>
      </motion.div>

      {/* ---------------- PUBLICATIONS ---------------- */}
      <div className="z-10 w-full max-w-4xl space-y-14">
        {publications.map((pub, index) => (
          <PublicationEntry key={pub.title} pub={pub} index={index} />
        ))}
      </div>
    </div>
  )
}

export default Publications