import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from 'framer-motion'
import {
  FaGithub,
  FaExternalLinkAlt,
  FaFolder,
} from 'react-icons/fa'

/* ================================================================== */
/*  1. DATA — keep content separate from presentation                  */
/* ================================================================== */

const PROJECTS = [
  {
    title: 'AI Smart Beauty and Fashion Advisor',
    category: 'AI / ML',
    tech: ['React', 'Flask', 'OpenCV', 'XGBoost', 'MongoDB'],
    points: [
      'Implemented ML and Computer Vision models for skin tone analysis and face shape classification.',
      'Integrated RESTful APIs to deliver personalized makeup, clothing, and hairstyle recommendations.',
      'Improved recommendation accuracy by 50%.',
    ],
    github: 'https://github.com/Mrunalivyas/AI-Smart-Beauty-Advisor',
    live: '#',
  },
  {
    title: 'Student Manager Application',
    category: 'Full-Stack',
    tech: ['Node.js', 'Express', 'MongoDB', 'React', 'Multer', 'Cloudinary'],
    points: [
      'Architected a full-stack web application with secure OTP authorization and CRUD workflows.',
      'Integrated document management pipelines using Multer and Cloudinary for PDF uploads.',
      'Boosted record management efficiency by 40%.',
    ],
    github:
      'https://github.com/Mrunalivyas/Student-Manger/tree/main/student-management-system-main',
    live: '#',
  },
  {
    title: 'House Maid Recruitment Platform',
    category: 'Full-Stack',
    tech: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript'],
    points: [
      'Implemented maid registration, client registration, search, booking, and scheduling functionalities.',
      'Integrated secure database management and input validation.',
      'Optimized online hiring workflows.',
    ],
    github: 'https://github.com/Mrunalivyas/House-maid-hiring-system',
    live: '#',
  },
  {
    title: 'Touch-Based Interactive Game (Boys vs Girls)',
    category: 'Web / Fun',
    tech: ['React.js', 'Tailwind CSS', 'JavaScript'],
    points: [
      'Developed a fun, touch-responsive web game designed for multiplayer interaction.',
      'Implemented smooth animations and responsive UI for mobile and tablet touch screens.',
      'Created a unique scoring system to engage both casual and competitive players.',
    ],
    github: 'https://github.com/Mrunalivyas/Child_Safety_Game-main',
    live: '#',
  },
  {
    title: 'Face Shape Detection System',
    category: 'AI / ML',
    tech: ['Python', 'OpenCV', 'Mediapipe', 'Machine Learning'],
    points: [
      'Detects and classifies different face shapes (Oval, Round, Square, Heart, etc.).',
      'Uses facial landmark detection to analyze geometric proportions of the face.',
      'Provides personalized grooming and styling suggestions based on the detected shape.',
    ],
    github: 'https://github.com/Mrunalivyas/face_shape_detection',
    live: '#',
  },
  {
    title: 'Online Course Registration System',
    category: 'Full-Stack',
    tech: ['HTML', 'CSS', 'JavaScript', 'Java', 'Spring Boot', 'Hibernate', 'MySQL'],
    points: [
      'Built a full-stack platform for students to register for online courses seamlessly.',
      'Features assignment submission, course completion tracking, and grading.',
      'Implemented secure authentication and role-based access for students and admins.',
    ],
    github: 'https://github.com/Mrunalivyas/Online_Course_Registration',
    live: '#',
  },
]

/* ================================================================== */
/*  2. ACCENT — single source of truth for colours                     */
/* ================================================================== */

const ACCENT = {
  cardBorder: 'border-white/[0.06] hover:border-cyan-400/50',
  cardBg: 'bg-white/[0.015]',
  cardGlow: 'group-hover:shadow-[0_0_45px_-8px_rgba(34,211,238,0.45)]',
  iconBg: 'bg-cyan-500/10 text-cyan-400',
  iconActive: 'bg-cyan-500/25 text-cyan-200',
  iconRing: 'ring-1 ring-cyan-500/25',
  titleHover: 'group-hover:text-cyan-300',
  spotlight: 'rgba(34,211,238,0.16)',
}

/* ================================================================== */
/*  3. STYLES — shimmer + shared keyframes                             */
/* ================================================================== */

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

/* ================================================================== */
/*  4. SHARED — cursor glow                                            */
/* ================================================================== */

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

/* ================================================================== */
/*  5. SECTION HEADER                                                  */
/* ================================================================== */

const SectionHeader = ({ label, titleHighlight, description }) => (
  <motion.div
    initial={{ opacity: 0, y: -30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
    className="z-10 mb-14 w-full max-w-2xl text-center"
  >
    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-400/80">
      {label}
    </p>

    <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
      My <span className="shimmer-text">{titleHighlight}</span>
    </h2>

    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      className="mx-auto mb-5 h-px w-48 origin-center bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
    />

    <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-500 md:text-base">
      {description}
    </p>
  </motion.div>
)

/* ================================================================== */
/*  6. PROJECT CARD — 3D tilt + spotlight + staggered content          */
/* ================================================================== */

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)

  const rotateX = useSpring(rx, { stiffness: 140, damping: 18 })
  const rotateY = useSpring(ry, { stiffness: 140, damping: 18 })

  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, ${ACCENT.spotlight}, transparent 72%)`

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
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        type: 'spring',
        stiffness: 70,
        damping: 16,
        delay: index * 0.06,
      }}
      className="group h-full [perspective:1200px]"
    >
      <motion.article
        ref={cardRef}
        onPointerMove={handleMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY }}
        className={`relative flex h-full flex-col overflow-hidden rounded-2xl border ${ACCENT.cardBorder} ${ACCENT.cardBg} p-6 backdrop-blur-sm transition-all duration-300 ${ACCENT.cardGlow}`}
      >
        {/* pointer spotlight */}
        <motion.div
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* glowing top edge on hover */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-500 group-hover:via-cyan-400/80" />

        <div className="relative z-10 flex flex-1 flex-col">
          {/* --- HEADER: icon + title + category --- */}
          <div className="mb-4 flex items-start gap-3">
            <motion.div
              animate={{
                boxShadow: hovered
                  ? '0 0 26px rgba(34,211,238,0.6)'
                  : '0 0 12px rgba(34,211,238,0.25)',
              }}
              transition={{ duration: 0.35 }}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-base transition-colors duration-300 ${
                hovered ? ACCENT.iconActive : ACCENT.iconBg
              } ${ACCENT.iconRing}`}
            >
              <FaFolder size={15} />
            </motion.div>

            <div className="min-w-0 flex-1">
              <h3
                className={`text-base font-semibold leading-snug text-gray-100 transition-colors duration-300 ${ACCENT.titleHover}`}
              >
                {project.title}
              </h3>
              <span className="mt-1.5 inline-block rounded-full border border-cyan-500/25 bg-cyan-500/[0.06] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">
                {project.category}
              </span>
            </div>
          </div>

          {/* --- TECH PILLS --- */}
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.tech.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.04 + i * 0.04,
                  type: 'spring',
                  stiffness: 240,
                }}
                className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 font-mono text-[10px] text-gray-400"
              >
                {t}
              </motion.span>
            ))}
          </div>

          {/* --- BULLET POINTS --- */}
          <ul className="mb-6 flex-grow space-y-2.5">
            {project.points.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.04 + 0.15 + i * 0.07,
                  duration: 0.4,
                }}
                className="flex gap-2.5 text-sm leading-relaxed text-gray-400"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>

          {/* --- LINKS --- */}
          <div className="flex items-center gap-3 border-t border-white/[0.06] pt-4">
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg border border-cyan-500/25 bg-cyan-500/[0.05] px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:border-cyan-400 hover:bg-cyan-500/15 hover:text-cyan-200"
            >
              <FaGithub size={13} /> Code
            </motion.a>

            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
            >
              <FaExternalLinkAlt size={11} /> Live
            </motion.a>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}

/* ================================================================== */
/*  7. PAGE                                                            */
/* ================================================================== */

const Projects = () => {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center overflow-hidden px-6 py-24 text-white">
      <style>{styles}</style>
      <CursorGlow />

      <SectionHeader
        label="my.work"
        titleHighlight="Projects"
        description="A collection of my work in full-stack development, AI, computer vision, and interactive apps."
      />

      <motion.div
        layout
        className="z-10 grid w-full max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Projects