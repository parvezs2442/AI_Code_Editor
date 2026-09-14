import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from "motion/react"
import { ArrowLeft, Code2, Eye, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function TopBar({ showPreview, setShowPreview }) {
    const { currentProject } = useSelector(state => state.project)
    const navigate = useNavigate()

    return (
        <div className='relative z-30 flex h-12 items-center justify-between border-b border-white/[0.06] bg-[#111113]/90 px-3 sm:px-4 backdrop-blur-xl'>
            <div className='flex items-center gap-2 sm:gap-3'>
                <motion.button
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/')}
                    title="Return to Dashboard"
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span className='text-sm sm:text-base font-bold text-white tracking-tight'>
                        VertexAI
                    </span>
                </motion.button>

                <div className='h-4 w-px bg-white/10' />

                <div className='flex items-center gap-2'>
                    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[13px]'>
                        📁
                    </div>
                    <div className='max-w-[140px] sm:max-w-[240px] truncate text-xs sm:text-sm font-medium text-zinc-300' title={currentProject?.name}>
                        {currentProject?.name || "project"}
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-2'>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/')}
                    title="Go to Dashboard"
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                    <Home size={14} />
                    <span className="hidden sm:inline">Dashboard</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPreview?.((v) => !v)}
                    title={showPreview ? "Show Editor" : "Show Preview"}
                    className={`relative flex items-center justify-center rounded-lg p-2 transition-colors ${
                        showPreview ? "text-sky-400" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    <motion.div
                        className="absolute inset-0 rounded-lg bg-white/[0.06]"
                        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                    />
                    {showPreview ? <Eye size={16} className='relative' /> : <Code2 size={16} className='relative' />}
                </motion.button>
            </div>
        </div>
    )
}

export default TopBar
