import { motion, AnimatePresence } from 'motion/react';
import type {Project} from '../interfaces/Project';

import { 
  ArrowUpRight, 
} from 'lucide-react';


export const ProjectCard = ({ project }: { project: Project }) => (
  <motion.div
    layout
    className="group relative glass-card overflow-hidden rounded-xl"
  >
    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-zinc-900/40 p-6">
      <img
        src={project.image}
        alt={project.title}
        referrerPolicy="no-referrer"
        className="max-h-24 w-auto max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>

    <div className="p-6">
      <div className="mb-4 flex justify-between items-start gap-4">
        <div>
          <span className="font-mono text-[10px] text-blue-500 uppercase tracking-widest mb-1 block">
            {project.category}
          </span>
          <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
        </div>
        <a href={project.link} className="p-2 bg-zinc-800 hover:bg-blue-500 transition-colors shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <p className="text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <span
            key={tag}
            className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);