import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileDownload,
  FaArrowRight,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCode,
  FaBriefcase,
  FaGraduationCap,
} from 'react-icons/fa'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const ROLES = [
  'Full Stack Developer',
  'Problem Solver',
  'AI & ML Enthusiast',
  'Cloud Developer',
]

const HIGHLIGHTS = [
  { icon: <FaCode />, text: '10+ Projects Built' },
  { icon: <FaBriefcase />, text: '2 Internships' },
  { icon: <FaGraduationCap />, text: 'B.Tech IT Student' },
]

const SOCIALS = [
  { href: 'https://github.com/Mrunalivyas', icon: <FaGithub />, label: 'GitHub' },
  {
    href: 'https://www.linkedin.com/in/mrunali-pati1222/',
    icon: <FaLinkedin />,
    label: 'LinkedIn',
  },
  {
    href: 'mailto:patilmrunali631@gmail.com',
    icon: <FaEnvelope />,
    label: 'Email',
  },
]

/* ------------------------------------------------------------------ */
/*  SINGLE UNIFIED ACCENT (matches all other sections)                 */
/* ------------------------------------------------------------------ */

const ACCENT = {
  cardBorder: 'border-white/[0.06] hover:border-cyan-400/50',
  cardBg: 'bg-white/[0.015]',
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
    100% { transform: scale(2.2);  opacity: 0; }
  }
  .pulse-ring::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: currentColor;
    animation: pulse-ring 2.2s cubic-bezier(0.22,1,0.36,1) infinite;
  }

  @keyframes caret-blink {
    0%, 49%   { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  .caret { animation: caret-blink 1s steps(1) infinite; }
`

/* ------------------------------------------------------------------ */
/*  TYPEWRITER                                                         */
/* ------------------------------------------------------------------ */

const TypewriterText = () => {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const role = ROLES[roleIndex]
    const typingSpeed = isDeleting ? 40 : 70
    const pauseTime = isDeleting ? 40 : 1600

    if (!isDeleting && displayText === role) {
      const t = setTimeout(() => setIsDeleting(true), pauseTime)
      return () => clearTimeout(t)
    }
    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setRoleIndex((p) => (p + 1) % ROLES.length)
      return
    }
    const t = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? role.substring(0, displayText.length - 1)
          : role.substring(0, displayText.length + 1)
      )
    }, typingSpeed)
    return () => clearTimeout(t)
  }, [displayText, isDeleting, roleIndex])

  return (
    <span className="font-mono text-cyan-300">
      {displayText}
      <span className="caret ml-1 inline-block h-5 w-[2px] translate-y-[3px] bg-cyan-400" />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  CURSOR SPOTLIGHT                                                   */
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
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.10),transparent_65%)] blur-2xl" />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  FLOATING BADGE (orbit + magnetic)                                  */
/* ------------------------------------------------------------------ */

const FloatingBadge = ({
  label,
  value,
  className = '',
  delay = 0,
  direction = 'left',
}) => (
  <motion.div
    initial={{ opacity: 0, x: direction === 'left' ? -20 : 20, y: 10 }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    transition={{ delay, duration: 0.6, type: 'spring', stiffness: 120 }}
    className={`absolute z-20 flex flex-col gap-0.5 rounded-xl border ${ACCENT.cardBorder} ${ACCENT.cardBg} px-3.5 py-2.5 backdrop-blur-md ${className}`}
  >
    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-cyan-400/80">
      {label}
    </p>
    <p className="text-xs font-semibold text-white">{value}</p>
  </motion.div>
)

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

const Hero = () => {
  /* profile image spotlight (tracks pointer over the image) */
  const imgX = useMotionValue(0)
  const imgY = useMotionValue(0)
  const [imgHovered, setImgHovered] = useState(false)

  const imgRef = (node) => {
    if (!node) return
    node.onpointermove = (e) => {
      const rect = node.getBoundingClientRect()
      imgX.set(e.clientX - rect.left)
      imgY.set(e.clientY - rect.top)
    }
  }

  const imgSpotlight = useMotionTemplate`radial-gradient(220px circle at ${imgX}px ${imgY}px, rgba(34,211,238,0.18), transparent 70%)`

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-24 text-white">
      <style>{styles}</style>
      <CursorGlow />

      {/* subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse at center, black 25%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 25%, transparent 72%)',
        }}
      />

      {/* ambient orbs */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 60, 0, -60, 0], y: [0, -40, 0, 40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute -left-10 top-20 -z-10 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[100px]"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -60, 0, 60, 0], y: [0, 40, 0, -40, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute -right-10 bottom-20 -z-10 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-[100px]"
      />

      {/* ---------------- MAIN GRID ---------------- */}
      <div className="z-10 grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* ============ LEFT: CONTENT ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col space-y-7"
        >
          {/* availability badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className={`inline-flex self-start items-center gap-2.5 rounded-full border ${ACCENT.badge} px-3.5 py-1.5 backdrop-blur-sm`}
          >
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inset-0 rounded-full bg-cyan-400 text-cyan-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300/90">
              Available for work
            </span>
          </motion.div>

          {/* greeting + name */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mb-2 font-mono text-[11px] uppercase tracking-[0.32em] text-cyan-400/80"
            >
              hi, my name is
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              <span className="text-white">Mrunali</span>{' '}
              <span className="shimmer-text">Patil</span>
            </motion.h1>
          </div>

          {/* typewriter role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex h-8 items-center text-lg md:text-xl"
          >
            <TypewriterText />
          </motion.div>

          {/* description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="max-w-lg text-[15px] leading-relaxed text-gray-400"
          >
            Building innovative web applications with modern technologies. Passionate
            about problem-solving and creating meaningful digital experiences.
          </motion.p>

          {/* highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-x-6 gap-y-3 pt-1"
          >
            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.08 }}
                className="flex items-center gap-2 text-sm text-gray-400"
              >
                <span className="grid h-6 w-6 place-items-center rounded-md bg-cyan-500/10 text-[10px] text-cyan-400 ring-1 ring-cyan-500/20">
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center gap-4 pt-3"
          >
            <motion.a
              href="/assets/resume.pdf"
              download
              whileHover={{ y: -2, boxShadow: '0 10px 40px rgba(34,211,238,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all"
            >
              <FaFileDownload />
              Download Resume
            </motion.a>

            <motion.a
              href="#projects"
              whileHover={{ y: -2, backgroundColor: 'rgba(34,211,238,0.08)' }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2.5 rounded-lg border border-cyan-500/40 px-6 py-3.5 font-semibold text-cyan-400 transition-all"
            >
              View My Work
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>

          {/* socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-5 border-t border-white/[0.06] pt-4"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gray-600">
              find me on
            </span>
            <div className="flex items-center gap-4">
              {SOCIALS.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, color: '#22d3ee', scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-lg text-gray-500 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ============ RIGHT: IMAGE ============ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* decorative frames */}
            <div className="pointer-events-none absolute -inset-4 rounded-3xl border border-cyan-500/10" />
            <div className="pointer-events-none absolute -inset-2 rounded-3xl border border-cyan-500/20" />

            {/* image container */}
            <motion.div
              ref={imgRef}
              onPointerEnter={() => setImgHovered(true)}
              onPointerLeave={() => setImgHovered(false)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative h-[380px] w-72 overflow-hidden rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.15)] md:h-[420px] md:w-80"
            >
              <img
                src="/assets/profile.jpeg"
                alt="Mrunali Patil"
                className="h-full w-full object-cover"
              />

              {/* spotlight follows pointer over image */}
              <motion.div
                style={{ background: imgSpotlight }}
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
                animate={{ opacity: imgHovered ? 1 : 0 }}
              />

              {/* bottom gradient */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

              {/* name badge on image */}
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/90">
                    developer
                  </p>
                  
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-sm">
                  <FaCheckCircle className="text-[10px] text-cyan-400" />
                  <span className="font-mono text-[10px] text-white/90">2026</span>
                </div>
              </div>
            </motion.div>

            {/* floating badges */}
            <FloatingBadge
              label="degree"
              value="B.Tech IT"
              className="-right-6 top-10"
              delay={1.15}
              direction="right"
            />
            
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero