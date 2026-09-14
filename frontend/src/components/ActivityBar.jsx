import { Bot, Files, Home, LogOut, Sparkles, SquareTerminal, User } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/logout'
import { setUserData } from '../redux/userSlice'

function ActivityIcon({ icon: Icon, label, active, onClick }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div className='relative'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={onClick}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg"
            >
                <AnimatePresence>
                    {active && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-white/10"
                        />
                    )}
                </AnimatePresence>

                <Icon
                    size={19}
                    className={`relative z-10 transition-colors ${active ? "text-sky-400" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                />

                <AnimatePresence>
                    {active && (
                        <motion.div
                            className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-gradient-to-b from-sky-400 to-violet-400"
                            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ duration: 0.12 }}
                            className="pointer-events-none absolute left-11 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-[#17171a] px-2 py-1 text-[11px] font-medium text-zinc-300 shadow-lg shadow-black/40"
                        >
                            {label}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}

function ActivityBar({ showAiChat, showExplorer, showTerminal, setShowAiChat, setShowExplorer, setShowTerminal }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const [profileOpen, setProfileOpen] = useState(false)
    const menuRef = useRef(null)

    const name = userData?.name || "User"
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    const handleLogout = async () => {
        await logout()
        dispatch(setUserData(null))
        navigate('/login')
    }

    // Close menu when clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setProfileOpen(false)
            }
        }
        if (profileOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [profileOpen])

    return (
        <div className='relative flex h-full w-14 shrink-0 flex-col items-center gap-2 border-r border-white/[0.06] bg-[#111113]/90 py-3 z-30'>
            {/* Top Navigation */}
            <ActivityIcon
                icon={Home}
                label={"Dashboard"}
                active={false}
                onClick={() => navigate('/')}
            />

            <div className='my-1 h-px w-6 bg-white/[0.06]' />

            <ActivityIcon
                icon={Files}
                label={"Explorer"}
                active={showExplorer}
                onClick={() => setShowExplorer(v => !v)}
            />

            <ActivityIcon
                icon={Bot}
                label={"AI Chat"}
                active={showAiChat}
                onClick={() => setShowAiChat(v => !v)}
            />

            {/* Bottom Actions */}
            <div className='mt-auto flex flex-col items-center gap-2'>
                <ActivityIcon
                    icon={SquareTerminal}
                    label={"Terminal"}
                    active={showTerminal}
                    onClick={() => setShowTerminal(v => !v)}
                />

                <div className='my-1 h-px w-6 bg-white/[0.06]' />

                {/* Profile Avatar / Menu at Left Bottom */}
                <div className='relative' ref={menuRef}>
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setProfileOpen(v => !v)}
                        title={name}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/20 hover:ring-sky-400/50 transition-all overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-900"
                    >
                        {userData?.avatar ? (
                            <img
                                src={userData.avatar}
                                alt={name}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        ) : (
                            <span className="text-[12px] font-bold text-white tracking-wider">
                                {initials}
                            </span>
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -8, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-0 left-12 z-50 w-60 rounded-xl border border-white/10 bg-[#151518]/95 p-3 shadow-2xl shadow-black/80 backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold ring-1 ring-white/20 overflow-hidden">
                                        {userData?.avatar ? (
                                            <img
                                                src={userData.avatar}
                                                alt={name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span>{initials}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-xs font-semibold text-white">
                                            {name}
                                        </div>
                                        <div className="truncate text-[11px] text-zinc-400">
                                            {userData?.email || "Signed in"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-1.5 border border-white/[0.05]">
                                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                                        <Sparkles size={12} className="text-amber-400" />
                                        <span>Credits</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-amber-400">
                                        {userData?.credits ?? 0}
                                    </span>
                                </div>

                                <div className="mt-2 space-y-1">
                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate('/');
                                        }}
                                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                                    >
                                        <Home size={14} />
                                        <span>Dashboard</span>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut size={14} />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default ActivityBar
