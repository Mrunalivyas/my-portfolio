import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useInView,
  animate,
} from 'framer-motion'
import {
  FaCode,
  FaBrain,
  FaTools,
  FaAws,
  FaUser,
  FaRocket,
  FaStar,
  FaMapMarkerAlt,
  FaBolt,
} from 'react-icons/fa'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const HIGHLIGHTS = [
  {
    icon: <FaCode />,
    title: 'Full Stack Development',
    desc: 'Building scalable web applications from frontend to backend using React, Node.js, and MongoDB.',
  },
  {
    icon: <FaBrain />,
    title: 'AI & Machine Learning',
    desc: 'Integrating intelligent solutions like computer vision and predictive models into real-world apps.',
  },
  {
    icon: <FaTools />,
    title: 'Problem Solving',
    desc: 'Optimizing workflows, debugging complex issues, and delivering clean, maintainable code.',
  },
  {
    icon: <FaAws />,
    title: 'Cloud Solutions (AWS)',
    desc: 'Deploying secure, scalable applications and managing cloud infrastructure using Amazon Web Services.',
  },
]

const STATS = [
  { value: 10, suffix: '+', label: 'Projects', icon: <FaCode /> },
  { value: 9, suffix: '+', label: 'Certifications', icon: <FaStar /> },
  { value: 3, suffix: '+', label: 'Years Coding', icon: <FaRocket /> },
]

/* ------------------------------------------------------------------ */
/*  SINGLE UNIFIED ACCENT (matches all other sections)                 */
/* ------------------------------------------------------------------ */

const ACCENT = {
  cardBorder: 'border-white/[0.06] hover:border-cyan-400/50',
  cardBg: 'bg-white/[0.015]',
  cardGlow: 'group-hover:shadow-[0_0_45px_-8px_rgba(34,211,238,0.45)]',
  iconBg: 'bg-cyan-500/10 text-cyan-400',
  iconActive: 'bg-cyan-500/25 text-cyan-200',
  iconRing: 'ring-1 ring-cyan-500/25',
  titleHover: 'group-hover:text-cyan-300',
  badge: 'border-cyan-500/30 bg-cyan-500/[0.08] text-cyan-300',
  dot: 'bg-cyan-400',
  glow: 'rgba(34,211,238,0.55)',
  line: '#22d3ee',
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
/*  ANIMATED COUNTER                                                   */
/* ------------------------------------------------------------------ */

const Counter = ({ from = 0, to, duration = 2, suffix = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!inView) return
    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.floor(v)),
    })
    return () => controls.stop()
  }, [inView, from, to, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  HIGHLIGHT CARD — 3D tilt + spotlight + magnetic icon               */
/* ------------------------------------------------------------------ */

const HighlightCard = ({ item, index }) => {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)

  const rotateX = useSpring(rx, { stiffness: 140, damping: 18 })
  const rotateY = useSpring(ry, { stiffness: 140, damping: 18 })

  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mx}px ${my}px, ${ACCENT.spotlight}, transparent 72%)`

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    mx.set(px)
    my.set(py)
    ry.set((px / rect.width - 0.5) * 10)
    rx.set((0.5 - py / rect.height) * 10)
  }

  const handleLeave = () => {
    rx.set(0)
    ry.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: index * 0.1,
      }}
      className="group h-full [perspective:1200px]"
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handleMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -6 }}
        className={`relative h-full overflow-hidden rounded-2xl border ${ACCENT.cardBorder} ${ACCENT.cardBg} p-6 backdrop-blur-sm transition-all duration-300 ${ACCENT.cardGlow}`}
      >
        {/* pointer spotlight */}
        <motion.div
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* glowing top edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-500 group-hover:via-cyan-400/80" />

        {/* corner glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-500/[0.06] blur-2xl transition-colors duration-500 group-hover:bg-cyan-500/[0.14]" />

        <div className="relative z-10">
          {/* icon */}
          <motion.div
            animate={{
              boxShadow: hovered
                ? '0 0 26px rgba(34,211,238,0.65)'
                : '0 0 12px rgba(34,211,238,0.25)',
            }}
            transition={{ duration: 0.35 }}
            whileHover={{ rotate: 12, scale: 1.12 }}
            className={`mb-4 grid h-12 w-12 place-items-center rounded-xl text-xl transition-colors duration-300 ${
              hovered ? ACCENT.iconActive : ACCENT.iconBg
            } ${ACCENT.iconRing}`}
          >
            {item.icon}
          </motion.div>

          {/* title */}
          <h4
            className={`mb-2 text-base font-semibold text-gray-100 transition-colors duration-300 ${ACCENT.titleHover}`}
          >
            {item.title}
          </h4>

          {/* desc */}
          <p className="text-sm leading-relaxed text-gray-400">{item.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FLOATING BADGE (magnetic, orbiting rings)                          */
/* ------------------------------------------------------------------ */

const FloatingBadge = () => {
  const wrapRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 160, damping: 18 })
  const sy = useSpring(my, { stiffness: 160, damping: 18 })

  const handleMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    mx.set(relX * 0.15)
    my.set(relY * 0.15)
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex justify-center md:col-span-4"
    >
      <div
        ref={wrapRef}
        onPointerMove={handleMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={handleLeave}
        className="relative h-52 w-52"
        style={{ perspective: 1000 }}
      >
        {/* rotating rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-cyan-500/25"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border border-cyan-500/15"
        />

        {/* orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
        </motion.div>

        {/* center badge */}
        <motion.div
          style={{ x: sx, y: sy }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-8 grid place-items-center rounded-full border ${ACCENT.iconRing} ${ACCENT.iconBg} backdrop-blur-sm transition-shadow duration-300`}
          // note: shadow handled by hovered state
          onAnimationStart={undefined}
        >
          <div className="text-center">
            <FaUser className="mx-auto mb-1 text-2xl text-cyan-400" />
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-gray-500">
              Developer
            </p>
            <p className="text-sm font-semibold text-white">Since 2021</p>
          </div>
        </motion.div>

        {/* floating chip: available */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-2 -top-1 flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-white/[0.02] px-2.5 py-1.5 font-mono text-[10px] text-cyan-300 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.3)]"
        >
          <span className="pulse-ring relative inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 text-cyan-400" />
          Available
        </motion.div>

        {/* floating chip: location */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-1 -left-2 flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[10px] text-gray-400 backdrop-blur-sm"
        >
          <FaMapMarkerAlt size={9} className="text-cyan-400/70" />
          Mumbai, IN
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  STAT CARD                                                          */
/* ------------------------------------------------------------------ */

const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.12 }}
    whileHover={{ y: -4, borderColor: 'rgba(34,211,238,0.5)' }}
    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 text-center backdrop-blur-sm transition-colors duration-300"
  >
    {/* top accent line */}
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-500 group-hover:via-cyan-400/70" />

    {/* icon */}
    <div className="mb-2 flex justify-center">
      <div
        className={`grid h-10 w-10 place-items-center rounded-lg text-base transition-colors duration-300 ${ACCENT.iconBg} ${ACCENT.iconRing} group-hover:bg-cyan-500/20 group-hover:text-cyan-200`}
      >
        {stat.icon}
      </div>
    </div>

    {/* value */}
    <p className="text-3xl font-bold text-white md:text-4xl">
      <Counter to={stat.value} suffix={stat.suffix} />
    </p>

    {/* label */}
    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
      {stat.label}
    </p>
  </motion.div>
)

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const About = () => {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center overflow-hidden px-6 py-24 text-white">
      <style>{styles}</style>
      <CursorGlow />

      {/* ambient orbs (single cyan accent) */}
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
        className="z-10 mb-14 w-full max-w-2xl text-center"
      >
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-400/80">
          about.me
        </p>

        <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
          About <span className="shimmer-text">Me</span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mx-auto mb-5 h-px w-48 origin-center bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        />

        <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-500 md:text-base">
          A short story about who I am, what I build, and what drives me forward.
        </p>
      </motion.div>

      {/* ---------------- BIO (2 columns) ---------------- */}
      <div className="z-10 mb-20 grid w-full max-w-5xl items-center gap-10 md:grid-cols-12">
        <FloatingBadge />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="md:col-span-8"
        >
          <h3 className="mb-5 text-2xl font-bold leading-snug text-white">
            A passionate developer building the{' '}
            <span className="shimmer-text">future of the web.</span>
          </h3>

          <p className="mb-4 leading-relaxed text-gray-400">
            I'm a Software Developer experienced in Full Stack Development, Artificial
            Intelligence, Machine Learning, and Cloud Solutions. Proficient in Java,
            Python, JavaScript, React.js, Node.js, Express.js, MongoDB, MySQL, and AWS.
          </p>

          <p className="leading-relaxed text-gray-400">
            I have a proven track record in building scalable RESTful APIs, computer
            vision models, and secure full-stack web applications through internships and
            hands-on projects. I thrive on solving complex problems and creating
            meaningful digital experiences.
          </p>

          {/* quick tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['Full Stack', 'AI/ML', 'Cloud', 'Open to Work'].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${ACCENT.badge}`}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---------------- STATS ---------------- */}
      <div className="z-10 mb-16 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ---------------- HIGHLIGHTS GRID ---------------- */}
      <div className="z-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((item, i) => (
          <HighlightCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}

export default About