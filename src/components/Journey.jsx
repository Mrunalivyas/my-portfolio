import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useScroll,
} from 'framer-motion'
import {
  FaGraduationCap,
  FaBookOpen,
  FaUniversity,
  FaLaptopCode,
  FaCode,
  FaCertificate,
  FaFilter,
  FaBriefcase,
  FaLightbulb,
} from 'react-icons/fa'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const timelineData = [
  {
    year: '2020',
    title: 'SSC (10th Standard)',
    desc: 'Completed SSC with flying colors, laying the foundation for my academic journey.',
    icon: <FaGraduationCap />,
    node: 'node_0',
    type: 'Education',
  },
  {
    year: '2021 - 2023',
    title: 'Diploma in Computer Engineering',
    desc: 'Pursued diploma, diving deeper into technical concepts and practical applications.',
    icon: <FaBookOpen />,
    node: 'node_1',
    type: 'Education',
  },
  {
    year: '2022',
    title: 'Java Internship @ Sumago Infotech',
    desc: 'Gained industry experience as a Java Intern, building robust applications and working on client-based projects.',
    icon: <FaLaptopCode />,
    node: 'node_2',
    type: 'Experience',
  },
  {
    year: '2023 - 2026',
    title: 'B.Tech in IT @ SVKM-IOT',
    desc: 'Currently pursuing B.Tech in Information Technology with a CGPA of 8.50/10.',
    icon: <FaUniversity />,
    node: 'node_3',
    type: 'Education',
  },
  {
    year: '2025',
    title: 'Python Developer Intern @ Codveda',
    desc: 'Developed Python applications, automated web scrapers, and strengthened debugging skills.',
    icon: <FaCode />,
    node: 'node_4',
    type: 'Experience',
  },
  {
    year: '2025',
    title: 'Infosys Pragati Path to Future',
    desc: 'Selected for Cohort 3, enhancing skills in emerging technologies and professional development.',
    icon: <FaCertificate />,
    node: 'node_5',
    type: 'Training',
  },
]

const FILTERS = [
  { key: 'All', label: 'All', icon: <FaFilter size={10} /> },
  { key: 'Education', label: 'Education', icon: <FaGraduationCap size={10} /> },
  { key: 'Experience', label: 'Experience', icon: <FaBriefcase size={10} /> },
  { key: 'Training', label: 'Training', icon: <FaLightbulb size={10} /> },
]

/* ------------------------------------------------------------------ */
/*  SINGLE UNIFIED ACCENT (matches all other sections)                 */
/* ------------------------------------------------------------------ */

const ACCENT = {
  // card
  cardBorder: 'border-white/[0.06] hover:border-cyan-400/50',
  cardBg: 'bg-white/[0.015]',
  cardGlow: 'group-hover:shadow-[0_0_45px_-8px_rgba(34,211,238,0.45)]',
  // icon
  iconBg: 'bg-cyan-500/10 text-cyan-400',
  iconActive: 'bg-cyan-500/25 text-cyan-200',
  iconRing: 'ring-1 ring-cyan-500/25',
  // text
  titleHover: 'group-hover:text-cyan-300',
  // badge
  badge: 'border-cyan-500/30 bg-cyan-500/[0.08] text-cyan-300',
  // node dot
  dot: 'bg-cyan-400',
  glow: 'rgba(34,211,238,0.55)',
  line: '#22d3ee',
  // spotlight
  spotlight: 'rgba(34,211,238,0.16)',
}

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

  @keyframes pulse-ring {
    0%   { transform: scale(0.85); opacity: 0.7; }
    100% { transform: scale(2);    opacity: 0; }
  }
  .pulse-ring::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: currentColor;
    animation: pulse-ring 2.2s cubic-bezier(0.22,1,0.36,1) infinite;
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

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [x, y])

  return (
    <motion.div
      aria-hidden
      style={{ left: sx, top: sy }}
      className="pointer-events-none fixed z-0 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.10),transparent_65%)] blur-2xl" />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  PULSE DOT                                                          */
/* ------------------------------------------------------------------ */

const PulseDot = ({ side }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ type: 'spring', stiffness: 240, damping: 14 }}
    className={`absolute top-1/2 z-20 hidden -translate-y-1/2 md:block ${
      side === 'left' ? '-right-[3.4rem]' : '-left-[3.4rem]'
    }`}
  >
    {/* outer glow ring */}
    <span
      className="absolute inset-0 -m-1 rounded-full"
      style={{ boxShadow: `0 0 18px 4px ${ACCENT.glow}` }}
    />
    {/* pulse ring */}
    <span
      className={`pulse-ring relative block h-3.5 w-3.5 rounded-full ${ACCENT.dot}`}
      style={{ color: ACCENT.glow }}
    />
    {/* core */}
    <span
      className={`absolute inset-0 m-auto h-1.5 w-1.5 rounded-full ${ACCENT.dot}`}
    />
  </motion.div>
)

/* ------------------------------------------------------------------ */
/*  TIMELINE CARD                                                      */
/* ------------------------------------------------------------------ */

const TimelineCard = ({ item, index, isLeft }) => {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)

  const rotateX = useSpring(rx, { stiffness: 140, damping: 18 })
  const rotateY = useSpring(ry, { stiffness: 140, damping: 18 })

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, ${ACCENT.spotlight}, transparent 72%)`

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    mx.set(px)
    my.set(py)
    ry.set((px / rect.width - 0.5) * 8)
    rx.set((0.5 - py / rect.height) * 8)
  }

  const handleLeave = () => {
    rx.set(0)
    ry.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -12 }}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 16,
        delay: index * 0.08,
      }}
      className={`group relative z-10 [perspective:1200px] ${
        isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:mt-16 md:text-left'
      }`}
    >
      <motion.article
        ref={cardRef}
        onPointerMove={handleMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -6 }}
        className={`relative overflow-hidden rounded-2xl border ${ACCENT.cardBorder} ${ACCENT.cardBg} p-6 backdrop-blur-sm transition-all duration-300 ${ACCENT.cardGlow}`}
      >
        {/* pointer spotlight */}
        <motion.div
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* top accent line on hover */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT.line}, transparent)`,
          }}
        />

        {/* corner glow */}
        <div
          className={`pointer-events-none absolute -top-16 ${
            isLeft ? '-right-16' : '-left-16'
          } h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-80`}
          style={{ background: ACCENT.glow }}
        />

        {/* node dot on the center line */}
        <PulseDot side={isLeft ? 'left' : 'right'} />

        {/* floating icon */}
        <motion.div
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: 'spring',
            stiffness: 220,
            damping: 14,
            delay: index * 0.08 + 0.15,
          }}
          whileHover={{ rotate: 12, scale: 1.12 }}
          className={`absolute -top-5 ${
            isLeft ? 'right-6 md:-right-5' : 'left-6 md:-left-5'
          } z-20 grid h-11 w-11 place-items-center rounded-xl text-base transition-colors duration-300 ${
            hovered ? ACCENT.iconActive : ACCENT.iconBg
          } ${ACCENT.iconRing}`}
        >
          {item.icon}
        </motion.div>

        {/* --- CONTENT --- */}
        <div className="relative z-10">
          {/* type badge + year */}
          <div
            className={`mb-3 flex items-center gap-2 ${
              isLeft ? 'md:justify-end' : 'md:justify-start'
            }`}
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 + 0.1 }}
              className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${ACCENT.badge}`}
            >
              {item.type}
            </motion.span>

            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 + 0.15 }}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500"
            >
              {item.year}
            </motion.span>
          </div>

          {/* title */}
          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 + 0.2 }}
            className={`text-lg font-semibold leading-snug text-gray-100 transition-colors duration-300 md:text-xl ${ACCENT.titleHover}`}
          >
            {item.title}
          </motion.h3>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 + 0.28 }}
            className="mt-2.5 text-sm leading-relaxed text-gray-400"
          >
            {item.desc}
          </motion.p>

          {/* node tag */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 + 0.35 }}
            className={`mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-gray-600 ${
              isLeft ? 'md:justify-end' : 'md:justify-start'
            }`}
          >
            <span className="h-px w-6 bg-gray-700" />
            {item.node}
          </motion.div>
        </div>
      </motion.article>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FILTER TABS                                                        */
/* ------------------------------------------------------------------ */

const FilterTabs = ({ filters, active, onChange, counts }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="z-10 mb-14 flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.015] p-1.5 backdrop-blur-sm"
  >
    {filters.map((f) => {
      const isActive = active === f.key
      return (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className="relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
        >
          {isActive && (
            <motion.span
              layoutId="journeyFilter"
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_22px_-4px_rgba(34,211,238,0.7)]"
            />
          )}
          <span
            className={`relative z-10 flex items-center gap-2 ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            {f.icon}
            <span className="font-mono uppercase tracking-[0.18em]">{f.label}</span>
            <span
              className={`ml-1 rounded-md px-1.5 py-px font-mono text-[10px] ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-white/[0.04] text-gray-500'
              }`}
            >
              {counts[f.key] ?? 0}
            </span>
          </span>
        </button>
      )
    })}
  </motion.div>
)

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const Journey = () => {
  const [filter, setFilter] = useState('All')
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  })

  const filtered =
    filter === 'All'
      ? timelineData
      : timelineData.filter((i) => i.type === filter)

  const counts = {
    All: timelineData.length,
    Education: timelineData.filter((i) => i.type === 'Education').length,
    Experience: timelineData.filter((i) => i.type === 'Experience').length,
    Training: timelineData.filter((i) => i.type === 'Training').length,
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center overflow-hidden px-6 py-24 text-white">
      <style>{styles}</style>
      <CursorGlow />

      {/* ambient orbs (both cyan now) */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 80, 0, -80, 0], y: [0, -60, 0, 60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute left-10 top-20 -z-10 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[100px]"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -80, 0, 80, 0], y: [0, 60, 0, -60, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute bottom-20 right-10 -z-10 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-[100px]"
      />

      {/* ---------------- HEADER ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
        className="z-10 mb-12 w-full max-w-2xl text-center"
      >
        

        <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
          My <span className="shimmer-text">Journey</span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mx-auto mb-5 h-px w-48 origin-center bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        />

        
      </motion.div>

      {/* ---------------- FILTERS ---------------- */}
      <FilterTabs
        filters={FILTERS}
        active={filter}
        onChange={setFilter}
        counts={counts}
      />

      {/* ---------------- TIMELINE ---------------- */}
      <div ref={containerRef} className="relative w-full max-w-5xl">
        {/* dashed background line */}
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 border-l-2 border-dashed border-white/[0.06] md:block" />

        {/* animated scroll progress line (cyan only) */}
        <motion.div
          style={{ scaleY: smoothProgress, originY: 0 }}
          className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-gradient-to-b from-cyan-400 to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.7)] md:block"
        />

        <motion.div layout className="grid gap-12 md:grid-cols-2 md:gap-y-16">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <TimelineCard
                key={item.node}
                item={item}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* empty state */}
        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 mt-8 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-gray-500"
          >
            no entries in this category
          </motion.p>
        )}
      </div>
    </div>
  )
}

export default Journey