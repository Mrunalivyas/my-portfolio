import { Link } from 'react-scroll'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const navItems = [
  { name: 'About', to: 'about' },
  { name: 'Journey', to: 'journey' },
  { name: 'Skills', to: 'skills' },
  { name: 'Projects', to: 'projects' },
  { name: 'Publications', to: 'publications' },
  { name: 'Certifications', to: 'certifications' },
  { name: 'Contact', to: 'contact' },
]

/* ------------------------------------------------------------------ */
/*  ACCENT (matches all sections)                                      */
/* ------------------------------------------------------------------ */

const ACCENT = {
  pillBg: 'bg-cyan-500/[0.12]',
  pillBorder: 'border-cyan-400/40',
  text: 'text-gray-400 hover:text-cyan-300',
  textActive: 'text-cyan-300',
  logoGlow: 'shadow-[0_0_22px_rgba(34,211,238,0.4)]',
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
/*  NAVBAR                                                             */
/* ------------------------------------------------------------------ */

const Navbar = () => {
  const [active, setActive] = useState('about')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 20)
  })

  /* ---- scroll spy using IntersectionObserver ---- */
  useEffect(() => {
    const sections = navItems
      .map((i) => document.getElementById(i.to))
      .filter(Boolean)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /* ---- lock body scroll while drawer is open ---- */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleNavClick = () => setOpen(false)

  return (
    <>
      <style>{styles}</style>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/[0.06] bg-[#0B0F19]/70 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          {/* ---- LOGO ---- */}
          <Link
            to="hero"
            smooth
            duration={500}
            offset={-70}
            className="group flex cursor-pointer items-center gap-2.5"
          >
            <motion.span
              whileHover={{ rotate: 8, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-[11px] font-bold text-white shadow-[0_0_18px_rgba(34,211,238,0.45)]"
            >
              MP
            </motion.span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/80 group-hover:text-cyan-300 sm:block">
              mrunali.patil
            </span>
          </Link>

          {/* ---- DESKTOP NAV ---- */}
          <ul className="relative hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.to
              return (
                <li key={item.to} className="relative">
                  <Link
                    to={item.to}
                    smooth
                    duration={500}
                    offset={-70}
                    className={`relative block cursor-pointer rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${
                      isActive ? ACCENT.textActive : ACCENT.text
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navPill"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                        className={`absolute inset-0 -z-10 rounded-full border ${ACCENT.pillBorder} ${ACCENT.pillBg}`}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* ---- MOBILE TOGGLE ---- */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-cyan-400 transition-colors hover:border-cyan-400/50 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <FaTimes size={14} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <FaBars size={14} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ---- MOBILE DRAWER ---- */}
      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed right-0 top-0 z-50 flex h-full w-64 flex-col border-l border-white/[0.06] bg-[#0B0F19]/95 backdrop-blur-xl md:hidden"
            >
              {/* top accent line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

              <div className="flex items-center justify-between px-5 py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/80">
                  navigation
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-8 w-8 place-items-center rounded-md border border-white/[0.06] text-gray-400 hover:border-cyan-400/50 hover:text-cyan-400"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              <ul className="flex flex-col gap-1 px-3 pt-2">
                {navItems.map((item, i) => {
                  const isActive = active === item.to
                  return (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.05,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      <Link
                        to={item.to}
                        smooth
                        duration={500}
                        offset={-70}
                        onClick={handleNavClick}
                        className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? 'border-cyan-400/40 bg-cyan-500/[0.12] text-cyan-200'
                            : 'border-transparent text-gray-400 hover:border-white/[0.06] hover:bg-white/[0.02] hover:text-cyan-300'
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className="font-mono text-[10px] text-cyan-400/50">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>

              <div className="mt-auto px-5 py-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-600">
                  © {new Date().getFullYear()} mrunali
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar