import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useInView,
} from 'framer-motion'
import {
  FaCode,
  FaReact,
  FaServer,
  FaDatabase,
  FaBrain,
  FaUsers,
  FaCloud,
  FaChevronDown,
} from 'react-icons/fa'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const skillCategories = [
  {
    title: 'Programming Languages',
    icon: <FaCode />,
    level: 90,
    skills: ['Java', 'JavaScript', 'Python', 'SQL'],
  },
  {
    title: 'Frontend Development',
    icon: <FaReact />,
    level: 88,
    skills: ['React.js', 'HTML5', 'CSS3', 'TailwindCSS'],
  },
  {
    title: 'Backend Development',
    icon: <FaServer />,
    level: 82,
    skills: ['Node.js', 'Express.js', 'REST APIs', 'Spring Boot', 'Hibernate'],
  },
  {
    title: 'Databases & Cloud',
    icon: <FaDatabase />,
    level: 78,
    skills: ['MongoDB', 'MySQL', 'AWS', 'Cloudinary'],
  },
  {
    title: 'AI & Machine Learning',
    icon: <FaBrain />,
    level: 75,
    skills: [
      'XGBoost',
      'Logistic Regression',
      'SVM',
      'K-Means',
      'KNN',
      'OpenCV',
      'Vector DB',
    ],
  },
  {
    title: 'Tools & Concepts',
    icon: <FaCloud />,
    level: 85,
    skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'DSA', 'DBMS', 'OOP', 'SDLC'],
  },
]

const softSkills = [
  { name: 'Problem Solving', emoji: '🧩' },
  { name: 'Analytical Thinking', emoji: '🧠' },
  { name: 'Communication', emoji: '💬' },
  { name: 'Team Work', emoji: '🤝' },
  { name: 'Time Management', emoji: '⏱️' },
]

const marqueeSkills = [
  'Java', 'JavaScript', 'Python', 'SQL', 'React.js', 'Node.js',
  'Express.js', 'Spring Boot', 'Hibernate', 'MongoDB', 'MySQL', 'AWS',
  'TailwindCSS', 'OpenCV', 'XGBoost', 'SVM', 'K-Means', 'Vector DB',
  'Git', 'Postman',
]

/* ------------------------------------------------------------------ */
/*  ACCENT                                                             */
/* ------------------------------------------------------------------ */

const ACCENT = {
  cardBorder: 'border-white/[0.06] hover:border-cyan-400/50',
  cardBg: 'bg-white/[0.015]',
  iconBg: 'bg-cyan-500/10 text-cyan-400',
  iconActive: 'bg-cyan-500/25 text-cyan-200',
  titleHover: 'group-hover:text-cyan-300',
  spotlight: 'rgba(34,211,238,0.18)',
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

  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .animate-marquee { animation: marquee 32s linear infinite; }
  .marquee-wrap:hover .animate-marquee { animation-play-state: paused; }

  @keyframes pulse-ring {
    0%   { transform: scale(0.9); opacity: 0.7; }
    100% { transform: scale(1.8); opacity: 0; }
  }
  .pulse-ring::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: rgba(34,211,238,0.5);
    animation: pulse-ring 2.4s cubic-bezier(0.22,1,0.36,1) infinite;
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
      className="pointer-events-none fixed z-0 hidden h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.13),transparent_60%)] blur-2xl" />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  ANIMATED COUNTER                                                   */
/* ------------------------------------------------------------------ */

const Counter = ({ to, suffix = '', duration = 1.4 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  PROGRESS RING                                                      */
/* ------------------------------------------------------------------ */

const ProgressRing = ({ value, size = 44, stroke = 3 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  return (
    <div
      ref={ref}
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: inView ? c - (c * value) / 100 : c }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-mono text-[10px] font-semibold text-cyan-300">
        <Counter to={value} />
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SKILL PILL — magnetic hover                                        */
/* ------------------------------------------------------------------ */

const SkillPill = ({ label, index, baseDelay = 0 }) => {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18 })
  const sy = useSpring(y, { stiffness: 260, damping: 18 })

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    x.set(relX * 0.25)
    y.set(relY * 0.35)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handleLeave}
      style={{ x: sx, y: sy }}
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 16,
        delay: baseDelay + index * 0.045,
      }}
      whileTap={{ scale: 0.94 }}
      className={`relative cursor-default overflow-hidden rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-300 ${
        hovered
          ? 'border-cyan-400/70 bg-cyan-500/15 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.45)]'
          : 'border-white/[0.06] bg-white/[0.02] text-gray-300'
      }`}
    >
      {hovered && (
        <span className="pulse-ring pointer-events-none absolute inset-0 rounded-lg" />
      )}
      <span className="relative z-10">{label}</span>
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */
/*  SKILL CARD — 3D tilt + spotlight + collapsible + ring              */
/* ------------------------------------------------------------------ */

const SkillCard = ({ category, index }) => {
  const [open, setOpen] = useState(true)
  const cardRef = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(0.5)
  const gy = useMotionValue(0.5)

  const rotateX = useSpring(rx, { stiffness: 140, damping: 18 })
  const rotateY = useSpring(ry, { stiffness: 140, damping: 18 })
  const sheenX = useTransform(gx, [0, 1], ['0%', '100%'])
  const sheenY = useTransform(gy, [0, 1], ['0%', '100%'])

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, ${ACCENT.spotlight}, transparent 72%)`
  const sheen = useMotionTemplate`radial-gradient(220px circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.08), transparent 60%)`

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    mx.set(px)
    my.set(py)
    gx.set(px / rect.width)
    gy.set(py / rect.height)
    ry.set((px / rect.width - 0.5) * 12)
    rx.set((0.5 - py / rect.height) * 12)
  }

  const handleLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        type: 'spring',
        stiffness: 70,
        damping: 16,
        delay: index * 0.08,
      }}
      className="group h-full [perspective:1200px]"
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative flex h-full flex-col overflow-hidden rounded-2xl border ${ACCENT.cardBorder} ${ACCENT.cardBg} p-6 backdrop-blur-sm transition-colors duration-300 group-hover:shadow-[0_0_45px_-8px_rgba(34,211,238,0.45)]`}
      >
        <motion.div
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <motion.div
          style={{ background: sheen }}
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-500 group-hover:via-cyan-400/80" />

        <div className="relative z-10 flex flex-1 flex-col">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center gap-4 border-b border-white/[0.06] pb-4 text-left"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 10px rgba(34,211,238,0.25)',
                  '0 0 26px rgba(34,211,238,0.65)',
                  '0 0 10px rgba(34,211,238,0.25)',
                ],
              }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ rotate: 12, scale: 1.12 }}
              whileTap={{ scale: 0.94 }}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg transition-colors duration-300 ${
                ACCENT.iconBg
              } ring-1 ring-cyan-500/25`}
            >
              {category.icon}
            </motion.div>

            <div className="min-w-0 flex-1">
              <h3
                className={`truncate text-base font-semibold text-gray-100 transition-colors duration-300 sm:text-lg ${ACCENT.titleHover}`}
              >
                {category.title}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-400/70">
                {category.skills.length} skills
              </p>
            </div>

            <ProgressRing value={category.level} />

            <motion.span
              animate={{ rotate: open ? 0 : -90 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-sm text-cyan-400/70"
            >
              <FaChevronDown />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-5">
                  {category.skills.map((skill, i) => (
                    <SkillPill
                      key={skill}
                      label={skill}
                      index={i}
                      baseDelay={index * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  MARQUEE                                                            */
/* ------------------------------------------------------------------ */

const SkillMarquee = () => (
  <div
    className="marquee-wrap relative z-10 w-full overflow-hidden border-y border-white/[0.06] py-5"
    style={{
      maskImage:
        'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      WebkitMaskImage:
        'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
    }}
  >
    <div className="animate-marquee flex w-max">
      {[0, 1].map((half) => (
        <div key={half} className="flex gap-3 pr-3">
          {marqueeSkills.map((skill) => (
            <motion.span
              key={`${half}-${skill}`}
              whileHover={{ scale: 1.08, y: -3 }}
              className="whitespace-nowrap rounded-full border border-cyan-500/15 bg-cyan-500/[0.04] px-4 py-1.5 font-mono text-xs tracking-wide text-cyan-300/70 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/*  SOFT SKILL CHIP                                                    */
/* ------------------------------------------------------------------ */

const SoftSkillChip = ({ skill, index }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.span
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 220, delay: 0.2 + index * 0.08 }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.94 }}
      className={`relative flex cursor-default items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
        hovered
          ? 'border-cyan-400/70 bg-cyan-500/15 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.5)]'
          : 'border-cyan-500/25 bg-white/[0.02] text-cyan-300/90'
      }`}
    >
      {hovered && (
        <span className="pulse-ring pointer-events-none absolute inset-0 rounded-full" />
      )}
      <motion.span
        animate={hovered ? { rotate: [0, -14, 14, 0] } : { rotate: 0 }}
        transition={{ duration: 0.6 }}
        className="text-base"
      >
        {skill.emoji}
      </motion.span>
      <span className="relative z-10">{skill.name}</span>
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const Skills = () => {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center overflow-hidden px-6 py-24 text-white">
      <style>{styles}</style>
      <CursorGlow />

      {/* ---------------- HEADER ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
        className="z-10 mb-12 w-full max-w-2xl text-center"
      >
        <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
          Technical <span className="shimmer-text">Skills</span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mx-auto mb-5 h-px w-48 origin-center bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        />

        <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-500 md:text-base">
          The technologies and tools I use to build scalable, intelligent, and modern
          web applications.
        </p>
      </motion.div>

      {/* ---------------- MARQUEE ---------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="mb-16 w-full max-w-6xl"
      >
        <SkillMarquee />
      </motion.div>

      {/* ---------------- SKILL GRID ---------------- */}
      <div className="z-10 mb-16 grid w-full max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category, index) => (
          <SkillCard key={category.title} category={category} index={index} />
        ))}
      </div>

      {/* ---------------- SOFT SKILLS ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="z-10 w-full max-w-4xl"
      >
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-cyan-500/25 pb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                boxShadow: [
                  '0 0 8px rgba(34,211,238,0.3)',
                  '0 0 22px rgba(34,211,238,0.7)',
                  '0 0 8px rgba(34,211,238,0.3)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-500/10 text-base text-cyan-400 ring-1 ring-cyan-500/25"
            >
              <FaUsers />
            </motion.div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/90">
                beyond.code
              </p>
              <h3 className="mt-0.5 text-lg font-semibold text-white">
                Soft Skills
              </h3>
            </div>
          </div>
          <span className="shrink-0 font-mono text-[11px] text-cyan-400/60">
            {String(softSkills.length).padStart(2, '0')} traits
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {softSkills.map((skill, i) => (
            <SoftSkillChip key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Skills