import React, { useState } from 'react'
import { motion } from "motion/react"
import { Star, Trash2 } from 'lucide-react'
import { deleteProject, toggleStar } from '../features/project'
import { useDispatch } from 'react-redux'
import { setCurrentProject, setDeleteProject, starProject } from '../redux/projectSlice'
import { useNavigate } from 'react-router-dom'
function ProjectCard({ project }) {
    const [loadingStar, setLoadingStar] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleToggleStar = async (e) => {
        e?.stopPropagation?.()
        if (loadingStar) return
        setLoadingStar(true)
        try {
            await toggleStar(project?._id)
            dispatch(starProject(project?._id))
        } catch (err) {
            console.error("Failed to toggle star:", err)
        } finally {
            setLoadingStar(false)
        }
    }

    const handleDelete = async (e) => {
        e?.stopPropagation?.()
        setLoadingDelete(true)
        try {
            await deleteProject(project?._id)
            dispatch(setDeleteProject(project?._id))
        } catch (err) {
            console.error("Failed to delete project:", err)
        } finally {
            setLoadingDelete(false)
        }
    }

    const handleOpenProject = (e) => {
        e?.stopPropagation?.()
        navigate(`/project/${project?._id}`)
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                scale: 0.97,
            }}
            whileHover={{
                y: -3,
            }}
            transition={{
                duration: 0.18,
                ease: "easeOut",
            }}
            className="group relative rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:border-white/[0.07] dark:bg-white/[0.03] dark:shadow-none dark:hover:border-white/[0.14] dark:hover:bg-white/[0.045]"
        >
            <motion.button
                type="button"
                whileTap={{
                    scale: 0.88,
                }}
                disabled={loadingStar}
                onClick={handleToggleStar}
                title={project.starred ? "Unstar project" : "Star project"}
                className={`absolute right-4 top-4 z-10 rounded-md p-1.5 transition-all hover:text-amber-400 ${
                    project.starred
                        ? "opacity-100 text-amber-400"
                        : "opacity-40 text-zinc-400 hover:opacity-100 dark:text-zinc-500"
                } ${loadingStar ? "cursor-wait opacity-60" : ""}`}
            >
                <Star
                    size={16}
                    className={
                        project.starred
                            ? "fill-amber-400 text-amber-400"
                            : ""
                    }
                />
            </motion.button>

            <h3
                onClick={handleOpenProject}
                title="Click to open project"
                className='mb-1.5 inline-block max-w-[85%] cursor-pointer truncate text-[14.5px] font-semibold tracking-tight text-zinc-900 hover:text-sky-500 dark:text-white dark:hover:text-sky-400 transition-colors'
            >
                {project.name}
            </h3>
            <p className='line-clamp-2 min-h-[2.5em] text-[12.5px] leading-snug text-zinc-500'>
                {project.description || "No Description"}
            </p>

            <div className='mt-4 flex items-center justify-between border-t border-black/[0.05] pt-3 dark:border-white/[0.06]'>
                <button
                    onClick={handleOpenProject}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.04] px-2.5 py-1 text-[11.5px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-500/10 dark:hover:text-sky-400 transition-colors"
                >
                    <span>Open Project</span>
                    <span className="text-[12px] opacity-70">→</span>
                </button>

                <div onClick={(e) => e.stopPropagation()}>
                    {confirmDelete ? (
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            className="flex items-center gap-2"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDelete(false);
                                }}
                                className="rounded-md px-2 py-1 text-[11px] text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loadingDelete}
                                onClick={handleDelete}
                                className="rounded-md bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-500/20 dark:text-red-400 disabled:cursor-wait disabled:opacity-50"
                            >
                                Yes
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            type="button"
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(true);
                            }}
                            title="Delete project"
                            className="flex items-center gap-1 rounded-md p-1.5 text-zinc-400 opacity-60 transition-opacity hover:opacity-100 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400"
                        >
                            <Trash2 size={14} />
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectCard
