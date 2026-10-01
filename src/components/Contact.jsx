import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from 'framer-motion'
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaPaperPlane,
  FaCheck,
  FaCopy,
  FaUser,
  FaCommentDots,
} from 'react-icons/fa'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const contactInfo = [
  {
    label: 'Email',
    value: 'patilmrunali631@gmail.com',
    icon: <FaEnvelope />,
    link: 'mailto:patilmrunali631@gmail.com',
    copyable: true,
  },
  {
    label: 'LinkedIn',
    value: 'Mrunali Patil',
    icon: <FaLinkedin />,
    link: 'https://www.linkedin.com/in/mrunali-pati1222/',
  },
  {
    label: 'GitHub',
    value: 'MrunaliPatil',
    icon: <FaGithub />,
    link: 'https://github.com/Mrunalivyas',
  },
]

/* ------------------------------------------------------------------ */
/*  SHARED ACCENT (matches Certifications section)                     */
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
`

/* ------------------------------------------------------------------ */
/*  CURSOR GLOW                                                        */
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
/*  CONTACT CARD (with spotlight + copy)                               */
/* ------------------------------------------------------------------ */

const ContactCard = ({ info, index }) => {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, ${ACCENT.spotlight}, transparent 70%)`

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  const handleCopy = async (e) => {
    if (!info.copyable) return
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(info.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch (_) {}
  }

  return (
    <motion.a
      ref={cardRef}
      href={info.link}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={handleMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ scale: 1.015 }}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-xl border ${ACCENT.cardBorder} ${ACCENT.cardBg} px-4 py-4 transition-colors duration-300`}
    >
      {/* spotlight */}
      <motion.div
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* icon */}
      <div
        className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-lg transition-colors duration-300 ${
          hovered ? ACCENT.iconActive : ACCENT.iconBg
        }`}
      >
        {info.icon}
      </div>

      {/* content */}
      <div className="relative z-10 min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
          {info.label}
        </p>
        <p
          className={`mt-0.5 truncate text-[15px] font-medium text-gray-100 transition-colors duration-300 ${ACCENT.titleHover}`}
        >
          {info.value}
        </p>
      </div>

      {/* copy button (email only) */}
      {info.copyable && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy email"
          className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/[0.06] text-gray-500 transition-colors hover:border-cyan-400/50 hover:text-cyan-400"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <FaCheck size={11} />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <FaCopy size={11} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}
    </motion.a>
  )
}

/* ------------------------------------------------------------------ */
/*  FORM FIELD                                                         */
/* ------------------------------------------------------------------ */

const Field = ({ label, icon, ...props }) => {
  const [focused, setFocused] = useState(false)
  const isTextarea = props.type === 'textarea'

  const commonProps = {
    ...props,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      'w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all resize-none',
  }

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-400/90">
        <span className="text-cyan-400">{icon}</span>
        {label}
      </label>

      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 3px rgba(34,211,238,0.10)'
            : '0 0 0 0px rgba(34,211,238,0)',
        }}
        transition={{ duration: 0.25 }}
        className="rounded-xl"
      >
        {isTextarea ? (
          <textarea rows={5} {...commonProps} />
        ) : (
          <input {...commonProps} />
        )}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => {
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 2600)
    }, 1200)
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-white">
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
        <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-6xl">
          Get In <span className="shimmer-text">Touch</span>
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mx-auto mb-5 h-px w-48 origin-center bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        />

        <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-500 md:text-base">
          Have a project in mind? Let's connect and build something amazing together.
        </p>
      </motion.div>

      {/* ---------------- GRID ---------------- */}
      <div className="z-10 grid w-full max-w-5xl gap-12 md:grid-cols-2 md:gap-10">
        {/* LEFT: contact info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col justify-center"
        >
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-cyan-500/25 pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/90">
                reach.out
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                Let's Connect
              </h2>
            </div>
            <span className="shrink-0 font-mono text-[11px] text-cyan-400/60">
              {String(contactInfo.length).padStart(2, '0')} channels
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {contactInfo.map((info, i) => (
              <ContactCard key={info.label} info={info} index={i} />
            ))}
          </div>
        </motion.div>

        {/* RIGHT: form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 md:p-8"
        >
          {/* top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              label="Name"
              icon={<FaUser size={10} />}
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Field
              label="Email"
              icon={<FaEnvelope size={10} />}
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Field
              label="Message"
              icon={<FaCommentDots size={10} />}
              name="message"
              type="textarea"
              placeholder="Your message..."
              value={form.message}
              onChange={handleChange}
              required
            />

            <motion.button
              whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
              whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
              type="submit"
              disabled={status !== 'idle'}
              className={`relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl py-4 font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all ${
                status === 'sent'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === 'idle' && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-3"
                  >
                    <FaPaperPlane /> Send Message
                  </motion.span>
                )}
                {status === 'sending' && (
                  <motion.span
                    key="sending"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-3"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                    />
                    Sending...
                  </motion.span>
                )}
                {status === 'sent' && (
                  <motion.span
                    key="sent"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-3"
                  >
                    <FaCheck /> Message Sent
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <p className="text-center font-mono text-[10px] uppercase tracking-[0.24em] text-gray-600">
              or email directly · patilmrunali631@gmail.com
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact