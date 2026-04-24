import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
    Download,
    ExternalLink,
    FileText,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    PhoneCall,
    X
} from 'lucide-react';
import {
    certifications,
    education,
    experiences,
    personalInfo,
    projects as localProjects,
    resumeHighlights,
    techStack as localTags
} from '../data/portfolioData';
import { ProjectData as FullProject } from '../types';
import { useSocialTracker } from '../hooks/useSocialTracker';
import { isExternalHref } from '../lib/site';

interface MCVProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectClick: (project: FullProject) => void;
}

const sectionTitleClass = 'block pt-5 pb-1 md:pt-7 text-sm md:text-base font-black uppercase tracking-[0.28em] text-blue-500';
const cvCardClass = 'rounded-[24px] border border-black/5 bg-white/45 p-6 shadow-[0_14px_34px_rgba(0,0,0,0.06)] dark:border-white/8 dark:bg-white/5 md:rounded-[30px] md:p-9';

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
            name,
            label: name.charAt(0).toUpperCase() + name.slice(1),
            url,
            external: isExternalHref(url)
        }))
    ), []);

    const projects = useMemo(() => (
        [...localProjects].sort((a, b) => (a.listing || 999) - (b.listing || 999))
    ), []);

    const companies = useMemo(() => experiences.map((experience) => experience.company), []);

    const getSocialIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('github')) return <Github size={16} />;
        if (lower.includes('linkedin')) return <Linkedin size={16} />;
        if (lower.includes('email')) return <Mail size={16} />;
        if (lower.includes('call')) return <PhoneCall size={16} />;
        return <Globe size={16} />;
    };

    return createPortal(
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[1500] bg-black/25 backdrop-blur-xl"
            />

            <div className="fixed inset-0 z-[1501] flex items-center justify-center p-3 sm:p-5 md:p-8 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 32 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 32 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                    onClick={(event) => event.stopPropagation()}
                    className="pointer-events-auto relative flex h-full max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden border border-black/5 bg-[var(--glass-bg-deep)] shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl md:max-h-[90vh]"
                    style={{ borderRadius: '32px' }}
                >
                    <div className="shrink-0 px-5 pb-0 pt-5 md:px-10 md:pt-10">
                        <div className="mb-7 flex items-start justify-between gap-5 md:mb-12">
                            <div className="space-y-3 md:space-y-5">
                                <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/15 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-500">
                                    <motion.div layoutId="cv-icon" className="flex items-center justify-center">
                                        <FileText size={18} strokeWidth={2} />
                                    </motion.div>
                                    Digital CV
                                </div>
                                <div className="space-y-2 md:space-y-4">
                                    <h2 className="text-2xl font-black tracking-tight text-primary md:text-4xl">
                                        Recruiter-friendly profile snapshot
                                    </h2>
                                    <p className="max-w-3xl text-sm leading-7 text-sec md:text-base">
                                        A cleaner view of Mahmoud&apos;s senior Flutter background, mobile delivery scope, and public product work.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href={personalInfo.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm font-bold text-blue-500 transition-colors hover:bg-blue-500/15"
                                >
                                    <Download size={16} />
                                    Download CV
                                </a>
                                <button onClick={onClose} className="rounded-full border border-black/5 bg-white/40 p-3 text-sec transition-all hover:bg-red-500/10 dark:border-white/10 dark:bg-black/40">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 md:px-10 md:py-7">
                        <div className="mx-auto max-w-7xl space-y-16 pb-24 md:space-y-28 md:pb-32">
                            <header className="space-y-12 md:space-y-18">
                                <div className="space-y-5 md:space-y-6">
                                    <div className="space-y-5">
                                        <motion.h1
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-4xl font-black uppercase leading-none tracking-tighter text-primary md:text-7xl"
                                        >
                                            {personalInfo.firstName} <span className="text-blue-500">{personalInfo.lastName}</span>
                                        </motion.h1>
                                        <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-500/85 md:text-base">
                                            {personalInfo.title}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-6 pb-2 sm:grid-cols-2 md:gap-8 md:pb-4 xl:grid-cols-4">
                                    <a href={`mailto:${personalInfo.email}`} className="group flex min-h-[126px] flex-col justify-between rounded-[22px] border border-black/5 bg-white/45 p-5 shadow-[0_10px_26px_rgba(0,0,0,0.05)] transition-all hover:border-blue-500/20 hover:bg-blue-500/[0.02] dark:border-white/8 dark:bg-white/4 md:min-h-[160px] md:rounded-[26px] md:p-7">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-blue-500">
                                            <Mail size={14} />
                                            Email
                                        </div>
                                        <div className="mt-4 break-all text-xs font-semibold leading-relaxed text-primary transition-colors group-hover:text-blue-500 md:mt-5 md:text-sm">{personalInfo.email}</div>
                                    </a>
                                    <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="rounded-[22px] border border-black/5 bg-white/45 p-5 shadow-[0_10px_26px_rgba(0,0,0,0.05)] transition-colors hover:text-blue-500 dark:border-white/8 dark:bg-white/4 md:rounded-[26px] md:p-7">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-blue-500">
                                            <Phone size={14} />
                                            Call
                                        </div>
                                        <div className="mt-4 text-xs font-semibold leading-6 text-primary md:mt-5 md:text-sm md:leading-7">{personalInfo.phone}</div>
                                    </a>
                                    <div className="rounded-[22px] border border-black/5 bg-white/45 p-5 shadow-[0_10px_26px_rgba(0,0,0,0.05)] dark:border-white/8 dark:bg-white/4 md:rounded-[26px] md:p-7">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-blue-500">
                                            <MapPin size={14} />
                                            Location
                                        </div>
                                        <div className="mt-4 text-xs font-semibold leading-6 text-primary md:mt-5 md:text-sm md:leading-7">{personalInfo.location}</div>
                                    </div>
                                    <a
                                        href={personalInfo.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-[22px] border border-black/5 bg-white/45 p-5 shadow-[0_10px_26px_rgba(0,0,0,0.05)] transition-colors hover:text-blue-500 dark:border-white/8 dark:bg-white/4 md:rounded-[26px] md:p-7"
                                    >
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-blue-500">
                                            <Download size={14} />
                                            Resume
                                        </div>
                                        <div className="mt-4 text-xs font-semibold leading-6 text-primary md:mt-5 md:text-sm md:leading-7">Open PDF version</div>
                                    </a>
                                </div>

                                <div className="grid gap-9 pt-2 md:gap-10 md:pt-4 lg:grid-cols-[1.35fr_0.95fr]">
                                    <section className={cvCardClass}>
                                        <div className="space-y-4 md:space-y-7">
                                            <h3 className={sectionTitleClass}>Brief About Me</h3>
                                            <p className="pt-2 text-sm leading-7 text-sec md:text-lg md:leading-9">
                                                {personalInfo.bio}
                                            </p>
                                        </div>
                                    </section>

                                    <section className={cvCardClass}>
                                        <div className="space-y-4 md:space-y-7">
                                            <h3 className={sectionTitleClass}>Connect</h3>
                                            <div className="grid gap-4 pt-2 md:gap-5">
                                                {socialLinks.map((link) => (
                                                    <a
                                                        key={link.label}
                                                        href={link.url}
                                                        target={link.external ? '_blank' : undefined}
                                                        rel={link.external ? 'noopener noreferrer' : undefined}
                                                        onClick={() => trackClick(link.label)}
                                                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/45 px-4 py-3 text-sm font-bold text-sec transition-all hover:border-blue-500/20 hover:text-blue-500 dark:border-white/8 dark:bg-white/4 md:gap-4 md:px-5 md:py-4"
                                                    >
                                                        <span className="rounded-xl bg-black/5 p-2 text-blue-500 dark:bg-white/5">
                                                            {getSocialIcon(link.name)}
                                                        </span>
                                                        {link.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </header>

                            <div className="grid gap-14 lg:grid-cols-[1.45fr_0.95fr] lg:gap-16 xl:gap-20">
                                <div className="space-y-14 md:space-y-18">
                                    <section className="space-y-8 md:space-y-12">
                                        <h3 className={sectionTitleClass}>Resume Snapshot</h3>
                                        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                                            {resumeHighlights.map((item) => (
                                                <div key={item} className="rounded-[22px] border border-black/5 bg-white/45 p-5 shadow-[0_10px_26px_rgba(0,0,0,0.05)] dark:border-white/8 dark:bg-white/4 md:rounded-[26px] md:p-6">
                                                    <p className="line-clamp-4 text-xs font-semibold leading-6 text-sec md:text-sm md:leading-8">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-8 md:space-y-12">
                                        <h3 className={sectionTitleClass}>Experience</h3>
                                        <div className="space-y-9 md:space-y-14">
                                            {experiences.map((experience) => (
                                                <div key={`${experience.company}-${experience.period}`} className={`${cvCardClass} mb-1`}>
                                                    <div className="space-y-5 md:space-y-8">
                                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                            <div className="space-y-3">
                                                                <h4 className="text-2xl font-black tracking-tight text-primary">{experience.company}</h4>
                                                                <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-500/80">{experience.role}</p>
                                                                <p className="text-sm text-muted">{experience.location}</p>
                                                            </div>
                                                            <span className="h-fit rounded-full bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-500">
                                                                {experience.period}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm leading-9 text-sec">{experience.description}</p>

                                                        {'highlights' in experience && Array.isArray(experience.highlights) && (
                                                            <div className="space-y-5 pt-2">
                                                                {experience.highlights.map((item: string) => (
                                                                    <div key={item} className="flex gap-3 text-sm leading-7 text-sec">
                                                                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                                                        <span>{item}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-8 md:space-y-12">
                                        <h3 className={sectionTitleClass}>Projects</h3>
                                        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
                                            {projects.map((project) => (
                                                <motion.div
                                                    key={project.id}
                                                    whileHover={{ y: -4 }}
                                                    onClick={() => onProjectClick(project)}
                                                    className="group cursor-pointer rounded-[22px] border border-black/5 bg-white/40 p-5 shadow-[0_10px_26px_rgba(0,0,0,0.05)] dark:border-white/8 dark:bg-white/4 md:rounded-[28px] md:p-7"
                                                >
                                                    <div className="space-y-4 md:space-y-6">
                                                        <div className="flex items-start justify-between gap-3 md:gap-4">
                                                            <div className="space-y-1.5 md:space-y-2">
                                                                <h4 className="line-clamp-2 text-sm font-black leading-tight tracking-tight text-primary transition-colors group-hover:text-blue-500 md:text-xl">
                                                                    {project.title || project.name}
                                                                </h4>
                                                                {project.role && (
                                                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-500/80">
                                                                        {project.role}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <ExternalLink size={16} className="mt-1 shrink-0 text-blue-500/0 transition-all group-hover:text-blue-500" />
                                                        </div>

                                                        <p className="line-clamp-2 text-xs leading-5 text-sec md:line-clamp-3 md:text-sm md:leading-7">{project.description}</p>

                                                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                            {(project.stack || []).slice(0, 4).map((tech) => (
                                                                <span key={`${project.id}-${tech}`} className="rounded-full border border-black/5 bg-black/[0.04] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-blue-500/80 dark:border-white/8 dark:bg-white/5 md:px-3 md:text-[10px] md:tracking-[0.18em]">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <aside className="space-y-14 md:space-y-18">
                                    <section className="space-y-8 md:space-y-10">
                                        <h3 className={sectionTitleClass}>Skills</h3>
                                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
                                            {localTags.map((skill) => (
                                                <div key={skill.name} className="rounded-[20px] border border-black/5 bg-white/40 p-5 shadow-[0_10px_26px_rgba(0,0,0,0.05)] dark:border-white/8 dark:bg-white/4 md:rounded-[24px] md:p-6">
                                                    <h4 className="text-xs font-black uppercase tracking-[0.12em] text-primary md:text-sm md:tracking-[0.18em]">{skill.name}</h4>
                                                    {skill.summary && (
                                                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-sec md:mt-3 md:text-sm md:leading-7">{skill.summary}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-8 md:space-y-10">
                                        <h3 className={sectionTitleClass}>Companies</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {companies.map((company) => (
                                                <span key={company} className="rounded-full border border-black/5 bg-white/40 px-4 py-2.5 text-sm font-bold text-primary dark:border-white/8 dark:bg-white/4">
                                                    {company}
                                                </span>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-8 md:space-y-10">
                                        <h3 className={sectionTitleClass}>Education</h3>
                                        <div className="grid gap-6 sm:grid-cols-2 md:block md:space-y-8">
                                            {education.map((item) => (
                                                <div key={item.title} className="rounded-[22px] border border-black/5 bg-white/40 p-5 shadow-[0_10px_26px_rgba(0,0,0,0.05)] dark:border-white/8 dark:bg-white/4 md:rounded-[26px] md:p-7">
                                                    <h4 className="text-sm font-black text-primary md:text-lg">{item.title}</h4>
                                                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-sec md:mt-3 md:text-sm md:leading-7">{item.institution}</p>
                                                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-muted md:mt-4 md:text-[11px] md:tracking-[0.18em]">{item.period}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-8 md:space-y-10">
                                        <h3 className={sectionTitleClass}>Certifications</h3>
                                        <div className="grid gap-6 sm:grid-cols-2 md:block md:space-y-8">
                                            {certifications.map((item) => (
                                                <div key={item.title} className="rounded-[20px] border border-black/5 bg-white/40 p-5 shadow-[0_10px_26px_rgba(0,0,0,0.05)] dark:border-white/8 dark:bg-white/4 md:rounded-[24px] md:p-6">
                                                    <h4 className="line-clamp-3 text-xs font-bold leading-5 text-primary md:text-sm md:leading-7">{item.title}</h4>
                                                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-muted md:mt-3 md:text-[11px] md:tracking-[0.18em]">{item.issuer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </aside>
                            </div>

                            <footer className="border-t border-black/5 pt-6 dark:border-white/5">
                                <div className="flex flex-col items-center gap-3">
                                    <a
                                        href={personalInfo.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-500 transition-colors hover:bg-blue-500/15 sm:hidden"
                                    >
                                        <Download size={16} />
                                        Download CV
                                    </a>
                                    <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
                                        © {new Date().getFullYear()} {personalInfo.name}
                                    </p>
                                </div>
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
