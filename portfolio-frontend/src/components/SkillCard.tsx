import { motion, AnimatePresence } from 'motion/react';

export const SkillCard = ({ icon: Icon, title, skills }: { icon: any; title: string; skills: string[] }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 rounded-none group"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-zinc-800/50 group-hover:bg-blue-500/10 transition-colors">
        <Icon className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
      </div>
      <h3 className="font-mono text-sm uppercase tracking-wider font-bold">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span key={skill} className="px-3 py-1 bg-zinc-800/30 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          {skill}
        </span>
      ))}
    </div>
  </motion.div>
);
