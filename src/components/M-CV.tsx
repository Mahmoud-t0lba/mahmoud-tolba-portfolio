import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink, FileText, Download } from 'lucide-react';
import {
    personalInfo,
    projects as localProjects,
    techStack as localTags,
    experiences,
    resumeHighlights,
    education,
    certifications
} from '../data/portfolioData';
import { ProjectData as FullProject } from '../types';
import { useSocialTracker } from '../hooks/useSocialTracker';

interface MCVProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectClick: (project: FullProject) => void;
}

const MCV = ({ onClose, onProjectClick }: Omit<MCVProps, 'isOpen'>) => {
    const { trackClick } = useSocialTracker();

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const socialLinks = useMemo(() => (
        Object.entries(personalInfo.socialLinks).map(([name, url]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            url
        }))
    ), []);

    const projects = useMemo(() => (
        [...localProjects].sort((a, b) => (a.listing || 999) - (b.listing || 999))
    ), []);

    const getSocialIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('github')) return <Github size={16} />;
        if (lower.includes('linkedin')) return <Linkedin size={16} />;
        if (lower.includes('email')) return <Mail size={16} />;
        return <Globe size={16} />;
    };

    return createPortal(
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[1500] bg-black/20 dark:bg-black/45 backdrop-blur-xl"
            />

            <div className="fixed inset-0 z-[1501] flex items-center justify-center p-4 md:p-10 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 40 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                    onClick={(event) => event.stopPropagation()}
                    className="glass-panel-deep relative w-full max-w-6xl h-full max-h-[88vh] overflow-hidden pointer-events-auto flex flex-col border border-black/5 dark:border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
                >
                    <div className="p-6 pb-0 shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <motion.div layoutId="cv-icon" className="flex items-center justify-center">
                                    <FileText size={26} strokeWidth={2} className="text-blue-500" />
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl font-bold text-primary m-0 tracking-tight">Profile Snapshot</h2>
                                    <p className="text-xs uppercase tracking-[0.22em] text-muted mt-1">Recruiter-friendly view</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href={personalInfo.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-500 hover:bg-blue-500/15 transition-colors"
                                >
                                    <Download size={16} />
                                    Download CV
                                </a>
                                <button onClick={onClose} className="p-3 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/5 dark:border-white/10 hover:bg-red-500/10 rounded-full transition-all text-sec shadow-sm group">
                                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 py-2 selection:bg-blue-500/30">
                        <div className="max-w-5xl mx-auto space-y-10 pb-8">
                            <header className="space-y-5">
                                <div className="space-y-3">
                                    <motion.h1
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-5xl md:text-7xl font-black tracking-tighter text-primary uppercase leading-none"
                                    >
                                        {personalInfo.firstName} <span className="text-blue-500">{personalInfo.lastName}</span>
                                    </motion.h1>
                                    <p className="text-blue-500/80 dark:text-blue-400/80 font-bold tracking-[0.2em] text-base uppercase">
                                        {personalInfo.title}
                                    </p>
                                    <p className="text-lg leading-relaxed text-sec max-w-4xl">
                                        {personalInfo.bio}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-x-8 gap-y-3 text-base text-sec">
                                    <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2.5 hover:text-primary transition-colors">
                                        <Mail size={16} className="text-blue-500" /> {personalInfo.email}
                                    </a>
                                    <span className="flex items-center gap-2.5">
                                        <Phone size={16} className="text-blue-500" /> {personalInfo.phone}
                                    </span>
                                    <span className="flex items-center gap-2.5">
                                        <MapPin size={16} className="text-blue-500" /> {personalInfo.location}
                                    </span>
                                </div>
                            </header>

                            <div className="grid lg:grid-cols-[1.55fr_0.95fr] gap-10">
                                <div className="space-y-12">
                                    <section className="space-y-5">
                                        <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-blue-500">Resume Snapshot</h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {resumeHighlights.map((item) => (
                                                <div key={item} className="rounded-3xl border border-black/5 dark:border-white/8 bg-white/45 dark:bg-white/5 p-4">
                                                    <p className="text-sm leading-relaxed text-sec font-semibold">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-6">
                                        <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-blue-500">Experience</h3>
                                        <div className="space-y-8">
                                            {experiences.map((experience) => (
                                                <div key={`${experience.company}-${experience.period}`} className="space-y-3 rounded-[28px] border border-black/5 dark:border-white/8 bg-white/40 dark:bg-white/4 p-5">
                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                                        <div>
                                                            <h4 className="text-2xl font-bold text-primary">{experience.company}</h4>
                                                            <p className="text-blue-500 font-bold text-sm uppercase tracking-wider mt-1">{experience.role}</p>
                                                            <p className="text-sm text-muted mt-2">{experience.location}</p>
                                                        </div>
                                                        <span className="text-[11px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full h-fit uppercase tracking-widest">
                                                            {experience.period}
                                                        </span>
                                                    </div>

                                                    <p className="text-sec text-sm leading-relaxed">{experience.description}</p>

                                                    {'highlights' in experience && Array.isArray(experience.highlights) && (
                                                        <div className="space-y-2">
                                                            {experience.highlights.map((item: string) => (
                                                                <div key={item} className="flex gap-3 text-sm text-sec leading-relaxed">
                                                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                                                    <span>{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-6">
                                        <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-blue-500">Projects</h3>
                                        <div className="space-y-5">
                                            {projects.map((project) => (
                                                <motion.div
                                                    key={project.id}
                                                    whileHover={{ x: 8 }}
                                                    onClick={() => onProjectClick(project)}
                                                    className="group cursor-pointer rounded-[26px] border border-black/5 dark:border-white/8 bg-white/40 dark:bg-white/4 p-5 space-y-3"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h4 className="text-2xl font-bold text-primary group-hover:text-blue-500 transition-colors tracking-tight">
                                                                {project.title || project.name}
                                                            </h4>
                                                            {project.role && (
                                                                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500/80 mt-2">
                                                                    {project.role}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <ExternalLink size={16} className="text-blue-500/0 group-hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 shrink-0 mt-1" />
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-sec">{project.description}</p>
                                                    <div className="flex flex-wrap gap-2 pt-1">
                                                        {(project.stack || []).map((tech) => (
                                                            <span key={`${project.id}-${tech}`} className="px-2.5 py-1 bg-black/[0.04] dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-full text-[10px] font-black text-blue-500/80 uppercase tracking-wider">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <aside className="space-y-10">
                                    <section className="space-y-5">
                                        <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-blue-500">Stack</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {localTags.map((skill) => (
                                                <div key={skill.name} className="px-3.5 py-1.5 bg-white/40 dark:bg-black/20 backdrop-blur-md border border-black/[0.03] dark:border-white/[0.05] rounded-2xl shadow-sm">
                                                    <span className="text-[12px] font-bold text-sec whitespace-nowrap">{skill.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-5">
                                        <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-blue-500">Education</h3>
                                        <div className="space-y-4">
                                            {education.map((item) => (
                                                <div key={item.title} className="rounded-[24px] border border-black/5 dark:border-white/8 bg-white/40 dark:bg-white/4 p-5">
                                                    <h4 className="text-lg font-bold text-primary">{item.title}</h4>
                                                    <p className="text-sm text-sec mt-2">{item.institution}</p>
                                                    <p className="text-xs uppercase tracking-[0.18em] text-muted mt-3">{item.period}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-5">
                                        <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-blue-500">Certifications</h3>
                                        <div className="space-y-3">
                                            {certifications.map((item) => (
                                                <div key={item.title} className="rounded-[22px] border border-black/5 dark:border-white/8 bg-white/40 dark:bg-white/4 p-4">
                                                    <h4 className="text-sm font-bold text-primary leading-relaxed">{item.title}</h4>
                                                    <p className="text-xs uppercase tracking-[0.16em] text-muted mt-2">{item.issuer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-5">
                                        <h3 className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-blue-500">Connect</h3>
                                        <div className="flex flex-col gap-3">
                                            {socialLinks.map((link) => (
                                                <a
                                                    key={link.name}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => trackClick(link.name)}
                                                    className="flex items-center gap-3 text-sm font-bold text-sec hover:text-blue-500 transition-all group rounded-2xl border border-black/5 dark:border-white/8 bg-white/40 dark:bg-white/4 px-4 py-3"
                                                >
                                                    <span className="p-2 bg-black/5 dark:bg-white/5 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                                                        {getSocialIcon(link.name)}
                                                    </span>
                                                    {link.name}
                                                </a>
                                            ))}
                                        </div>
                                    </section>
                                </aside>
                            </div>

                            <footer className="pt-6 border-t border-black/5 dark:border-white/5 flex flex-col items-center gap-3">
                                <a
                                    href={personalInfo.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="sm:hidden inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-500 hover:bg-blue-500/15 transition-colors"
                                >
                                    <Download size={16} />
                                    Download CV
                                </a>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-loose text-center">
                                    © {new Date().getFullYear()} {personalInfo.name}
                                </p>
                            </footer>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>,
        document.body
    );
};

export default MCV;
