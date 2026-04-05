import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Terminal,
  Cpu,
  Globe,
  Database,
  Layers,
  ChevronRight,
  Github,
  Linkedin,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { api } from './api';
import { SkillCard } from './components/SkillCard';
import { SectionHeader } from './components/SectionHeader';
import { ProjectCard } from './components/ProjectCard';
import { PostCard } from './components/PostCard';

import type { Project } from './interfaces/Project';
import type { Experience } from './interfaces/Experience';
import type { UserProfile } from './interfaces/UserProfile';
import type { Skill } from './interfaces/Skill';
import type { Stat } from './interfaces/Stat';
import type { Education } from './interfaces/Education';
import type { UIConfig } from './interfaces/UIConfig';
import type { Post } from './interfaces/Post';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [uiConfig, setUIConfig] = useState<UIConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projData, expData, profData, postData, skillData, statData, eduData, uiData] =
          await Promise.all([
            api.projects(),
            api.experience(),
            api.profile(),
            api.posts(),
            api.skills(),
            api.stats(),
            api.education(),
            api.uiConfig(),
          ]);
        setProjects(projData as Project[]);
        setExperience(expData as Experience[]);
        setProfile(profData as UserProfile);
        setPosts(postData as Post[]);
        setSkills(skillData as Skill[]);
        setStats(statData as Stat[]);
        setEducation(eduData as Education[]);
        setUIConfig(uiData as UIConfig);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Skills Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen technical-editorial-grid selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white flex items-center justify-center">
              <span className="text-black font-bold text-sm">AB</span>
            </div>
            <span className="font-mono text-xs tracking-widest uppercase hidden sm:block">
              {uiConfig?.version}
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              {JSON.parse(uiConfig?.nav_items || '[]').map((item: string) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-zinc-800 hidden md:block" />
            <div className="flex items-center gap-4">
              <a href={profile?.github_url} target="_blank" rel="noreferrer">
                <Github className="w-4 h-4 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              </a>
              <a href={profile?.linkedin_url} target="_blank" rel="noreferrer">
                <Linkedin className="w-4 h-4 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero */}
        <section id="home" className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 font-mono text-[10px] uppercase tracking-widest">
                    Available for Collaboration
                  </span>
                  <div className="h-[1px] flex-1 bg-zinc-800" />
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.8] mb-8">
                  {profile?.name.split(' ')[0]}
                  <br />
                  <span className="text-gradient">{profile?.name.split(' ')[1]}</span>
                </h1>
                <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed">
                  {profile?.bio}
                </p>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className="relative z-10"
              >
                <div className="relative aspect-[4/5] overflow-hidden border border-zinc-800 bg-zinc-900 group">
                  <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-20">
                    <motion.div
                      animate={{ y: ['0%', '100%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="w-full h-20 bg-gradient-to-b from-transparent via-blue-500 to-transparent"
                    />
                  </div>
                  <img
                    src={profile?.avatar_url}
                    alt={profile?.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -bottom-10 -left-10 z-40 hidden w-64 border border-zinc-800 bg-black p-6 shadow-2xl sm:block"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-blue-500">
                      System Metrics
                    </span>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  </div>
                  <div className="space-y-4">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="flex items-end justify-between">
                        <div className="font-mono text-[9px] uppercase tracking-widest text-blue-500">
                          {stat.label}
                        </div>
                        <div className="text-xl font-bold leading-none">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full -z-10" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-zinc-800/20 blur-3xl rounded-full -z-10" />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mb-32">
          <SectionHeader number="01" subtitle="Technical Skills" title="Skill Set" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.map((skill, idx) => (
              <SkillCard
                key={idx}
                icon={[Cpu, Layers, Globe, Database][idx % 4]}
                title={skill.category}
                skills={skill.items}
              />
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-32">
          <SectionHeader number="02" subtitle="Deployment Log" title="Selected Works" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Experience & Posts */}
        <section id="experience" className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <SectionHeader number="03" subtitle="Career Trajectory" title="Professional Matrix" />
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="glass-card p-8 group hover:bg-zinc-900/80 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-1 group-hover:text-blue-500 transition-colors">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                            {exp.company}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-zinc-800" />
                          <span className="font-mono text-xs text-zinc-500">{exp.period}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm mt-4 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <SectionHeader number="04" subtitle="Intelligence Feed" title="Recent Updates" />
              <div className="glass-card p-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-32">
          <SectionHeader number="05" subtitle="Scholastic Record" title="Academic Foundation" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu) => (
              <div key={edu.id} className="glass-card p-8 border-l-4 border-l-zinc-500">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block">
                  {edu.degree}
                </span>
                <h3 className="text-2xl font-bold mb-2">{edu.institution}</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  {edu.location} | {edu.period}
                </p>
                <div className="h-[1px] w-full bg-zinc-800 mb-4" />
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                  {edu.focus} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact me" className="mb-20">
          <div className="bg-blue-600 p-8 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-8">
                <Terminal className="w-6 h-6 text-white" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
                  Let's Code
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-8 leading-tight">
                Ready to architect and develop the next generation of systems?
              </h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`mailto:${profile?.email}`}
                  className="px-8 py-4 bg-white text-blue-600 font-bold uppercase tracking-widest text-xs hover:bg-zinc-100 transition-colors flex items-center gap-2"
                >
                  Email For Collaboration <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="/assets/portfolio/Aditya_Bhosale_Resume.pdf"
                  className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
                >
                  Download Resume
                </a>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="w-full h-full technical-editorial-grid" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <span className="font-bold text-sm">AB</span>
            </div>
            <div>
              <div className="font-bold text-sm">{profile?.name}</div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                {profile?.title}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <a
              href={profile?.github_url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest"
            >
              Github
            </a>
            <a
              href={profile?.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${profile?.email}`}
              className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest"
            >
              Email
            </a>
          </div>
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            © 2026 Aditya Bhosale. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
