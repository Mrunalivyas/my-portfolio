import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from 'framer-motion'
import {
  FaGraduationCap,
  FaLaptopCode,
  FaJava,
  FaAws,
  FaCertificate,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaTrophy,
} from 'react-icons/fa'
import { SiHackerrank } from 'react-icons/si'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const achievements = [
  {
    title: 'Top 50 Finalist — Mercer Mettl StackHack 2.0',
    issuer: 'Mercer Mettl',
    phase: 'Hackathon · 2024',
    icon: <FaTrophy />,
    link: 'public/assets/1729107394117.jpg',
    badge: 'Finalist',
  },
  {
    title: 'AICTE IDE Bootcamp',
    issuer: 'AICTE',
    phase: 'Phase I & II',
    icon: <FaGraduationCap />,
    link: '#',
  },
  {
    title: 'Infosys Pragati — Path to Future',
    issuer: 'Infosys',
    phase: 'Cohort 3',
    icon: <FaLaptopCode />,
    link: 'public/assets/image.png',
  },
  {
    title: 'Fuel — Java Full Stack Development',
    issuer: 'Fuel Training Program',
    phase: 'Training Program',
    icon: <FaJava />,
    link: '#',
  },
  {
    title: 'Java Spoken Tutorial',
    issuer: 'Spoken Tutorial · IIT Bombay',
    phase: 'Certified Course',
    icon: <FaJava />,
    link: 'public/assets/java.pdf',
  },
]

const certifications = [
  {
    title: 'Java Certification',
    issuer: 'HackerRank',
    phase: 'Verified Skill',
    icon: <SiHackerrank />,
    link: 'public/assets/hackerjava.png',
  },
  {
    title: 'Problem Solving Certification',
    issuer: 'HackerRank',
    phase: 'Verified Skill',
    icon: <SiHackerrank />,
    link: 'public/assets/problems.png',
  },
  {
    title: 'Amazon Web Services (AWS)',
    issuer: 'AWS',
    phase: 'Cloud Fundamentals',
    icon: <FaAws />,
    link: 'https://www.credly.com/earner/earned/badge/8a2eaa1a-f754-4734-ad0b-7274202e9ac3',
  },
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    phase: 'Course Completion',
    icon: <FaShieldAlt />,
    link: 'public/assets/cyber.pdf',
  },
  {
    title: 'Infosys Pragati — Python',
    issuer: 'Infosys Springboard',
    phase: 'Skill Track',
    icon: <FaJava />,
    link: 'public/assets/1709639629793.jpg',
  },
]

/* ------------------------------------------------------------------ */
/*  SINGLE UNIFIED ACCENT — used by BOTH sections                      */
/* ------------------------------------------------------------------ */

const ACCENT = {
  headerBorder: 'border-cyan-500/25',
  headerIcon: 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/25',
  headerLabel: 'text-cyan-400/90',
  headerCount: 'text-cyan-400/60',
  dot: 'bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]',
  row: 'border-white/[0.06] hover:border-cyan-400/50',
  iconBg: 'bg-cyan-500/10 text-cyan-400',
  iconActive: 'bg-cyan-500/25 text-cyan-200',
  titleHover: 'group-hover:text-cyan-300',
  phase: 'text-cyan-400/80',
  arrow: 'group-hover:text-cyan-400',
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
`

/* ------------------------------------------------------------------ */
/*  SUBTLE CURSOR GLOW                                                 */
/* ------------------------------------------------------------------ */

const CursorGlow = () => {
  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, { stiffness: 100, damping: 24, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 100, damping: 24, mass: 0.5 })

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
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08),transparent_65%)] blur-2xl" />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  CREDENTIAL ROW                                                     */
/* ------------------------------------------------------------------ */

const CredentialRow = ({ item, index }) => {
  const rowRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const a = ACCENT

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, ${a.spotlight}, transparent 70%)`

  const handleMove = (e) => {
    const rect = rowRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  return (
    <motion.a
      ref={rowRef}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={handleMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-lg border bg-white/[0.015] px-4 py-3.5 transition-colors duration-300 ${a.row}`}
    >
      {/* pointer spotlight */}
      <motion.div
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* icon */}
      <div
        className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm transition-colors duration-300 ${
          hovered ? a.iconActive : a.iconBg
        }`}
      >
        {item.icon}
      </div>

      {/* content */}
      <div className="relative z-10 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4
            className={`truncate text-[15px] font-medium text-gray-100 transition-colors duration-300 ${a.titleHover}`}
          >
            {item.title}
          </h4>

          {item.badge && (
            <span className="shrink-0 rounded border border-amber-400/30 bg-amber-400/[0.08] px-1.5 py-px font-mono text-[9px] font-semibold uppercase tracking-wider text-amber-300/90">
              {item.badge}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <span className="truncate">{item.issuer}</span>
          <span className="h-3 w-px shrink-0 bg-gray-700" />
          <span className={`shrink-0 font-mono text-[10px] uppercase tracking-wider ${a.phase}`}>
            {item.phase}
          </span>
        </div>
      </div>

      {/* arrow */}
      <motion.span
        animate={hovered ? { x: 2, opacity: 1 } : { x: 0, opacity: 0.5 }}
        transition={{ duration: 0.25 }}
        className={`relative z-10 shrink-0 text-gray-600 transition-colors duration-300 ${a.arrow}`}
      >
        <FaExternalLinkAlt size={10} />
      </motion.span>
    </motion.a>
  )
}

/* ------------------------------------------------------------------ */
/*  GROUP HEADER                                                       */
/* ------------------------------------------------------------------ */

const GroupHeader = ({ icon, label, title, count }) => {
  const a = ACCENT

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`mb-6 flex items-end justify-between gap-4 border-b pb-4 ${a.headerBorder}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`grid h-10 w-10 place-items-center rounded-lg text-base ${a.headerIcon}`}
        >
          {icon}
        </span>

        <div>
          <p
            className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] ${a.headerLabel}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
            {label}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>

      <span className={`shrink-0 font-mono text-[11px] ${a.headerCount}`}>
        {String(count).padStart(2, '0')} items
      </span>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const Certifications = () => {
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
        className="z-10 mb-14 w-full max-w-2xl text-center"
      >
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-400/80">
          my.credentials
        </p>

        <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
          Achievements & <span className="shimmer-text">Certifications</span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mx-auto mb-5 h-px w-48 origin-center bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        />

        <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-500">
          Hackathons, bootcamps, and certifications that shaped my technical foundation.
        </p>
      </motion.div>

      {/* ---------------- TWO VERTICAL COLUMNS (NO BOX) ---------------- */}
      <div className="z-10 grid w-full max-w-5xl gap-12 md:grid-cols-2 md:gap-10">
        {/* SECTION 01 */}
        <section>
          <GroupHeader
            icon={<FaGraduationCap />}
            label="section.01"
            title="Bootcamps & Achievements"
            count={achievements.length}
          />

          <div className="flex flex-col gap-2.5">
            {achievements.map((item, i) => (
              <CredentialRow key={item.title} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* SECTION 02 */}
        <section>
          <GroupHeader
            icon={<FaCertificate />}
            label="section.02"
            title="Certifications"
            count={certifications.length}
          />

          <div className="flex flex-col gap-2.5">
            {certifications.map((item, i) => (
              <CredentialRow key={item.title} item={item} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Certifications