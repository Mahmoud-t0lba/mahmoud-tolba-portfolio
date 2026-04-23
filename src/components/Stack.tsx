import { useEffect, useMemo, useRef, useState } from 'react';
import anime from 'animejs';
import {
    Blocks,
    BriefcaseBusiness,
    Cable,
    Code2,
    Database,
    DatabaseZap,
    Github,
    Layers3,
    Linkedin,
    Mail,
    MapPinned,
    PhoneCall,
    RadioTower,
    Rocket,
    Share2,
    Smartphone,
    type LucideIcon
} from 'lucide-react';
import { experiences, personalInfo, resumeHighlights, techStack } from '../data/portfolioData';
import { useSocialTracker } from '../hooks/useSocialTracker';
import { isExternalHref } from '../lib/site';

interface SkillCardProps {
    name: string;
    summary?: string;
    color?: string;
    skillIcon?: string;
    delay: number;
}

const skillIconMap: Record<string, LucideIcon> = {
    'flutter': Smartphone,
    'dart': Code2,
    'bloc / cubit': Share2,
    'provider / riverpod': Share2,
    'getx': Share2,
    'mvvm': Layers3,
    'clean architecture': Layers3,
    'solid + di': Blocks,
    'firebase': DatabaseZap,
    'rest apis': Cable,
    'sdk integration': Cable,
    'realtime & websocket': RadioTower,
    'notifications & deep links': RadioTower,
    'maps & location': MapPinned,
    'local storage': Database,
    'native bridges': Smartphone,
    'testing & qa': Blocks,
    'git & github': Github,
    'performance optimization': Rocket,
    'agile delivery': BriefcaseBusiness,
    'ci/cd & releases': Rocket,
    'react native': Smartphone,
};

const socialIconMap: Record<string, LucideIcon> = {
    linkedin: Linkedin,
    github: Github,
    email: Mail,
    call: PhoneCall,
};

const renderSkillFallbackIcon = (name: string) => {
    const IconComponent = skillIconMap[name.toLowerCase()] || BriefcaseBusiness;
    return <IconComponent size={30} strokeWidth={1.9} />;
};

const SkillCard = ({ name, summary, color, skillIcon, delay }: SkillCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [imgError, setImgError] = useState(false);
    const imageSrc = skillIcon ? `https://skillicons.dev/icons?i=${skillIcon}` : '';

    useEffect(() => {
        anime({
            targets: cardRef.current,
            opacity: [0, 1],
            translateY: [32, 0],
            filter: ['blur(16px)', 'blur(0px)'],
            duration: 750,
            delay,
            easing: 'easeOutExpo'
        });
    }, [delay]);

    return (
        <div
            ref={cardRef}
            className="opacity-0 rounded-[28px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-5 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0px)',
                boxShadow: isHovered
                    ? `0 18px 38px ${color ? `${color}22` : 'rgba(0,0,0,0.08)'}`
                    : '0 12px 30px rgba(0,0,0,0.06)'
            }}
        >
            <div className="flex flex-col items-start gap-5">
                <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                    style={{
                        background: color ? `${color}18` : 'rgba(255,255,255,0.08)',
                        color: color || 'var(--accent)'
                    }}
                >
                    {imageSrc && !imgError ? (
                        <img
                            src={imageSrc}
                            alt={name}
                            className="h-9 w-9 object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        renderSkillFallbackIcon(name)
                    )}
                </div>

                <div className="space-y-2.5">
                    <h3 className="text-xl font-black tracking-tight text-primary">{name}</h3>
                    {summary && (
                        <p className="text-sm leading-7 text-sec">
                            {summary}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const Stack = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const handwritingRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const { trackClick } = useSocialTracker();

    useEffect(() => {
        anime({
            targets: [handwritingRef.current, titleRef.current, introRef.current],
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            delay: anime.stagger(100),
            easing: 'easeOutExpo'
        });
    }, []);

    const companies = useMemo(
        () => experiences.map((item) => item.company),
        []
    );

    const focusItems = useMemo(
        () => resumeHighlights.slice(0, 6),
        []
    );

    const experiencePreview = useMemo(
        () => experiences.slice(0, 5),
        []
    );

    const socialLinks = useMemo(
        () => Object.entries(personalInfo.socialLinks).map(([name, url]) => ({
            name,
            label: name.charAt(0).toUpperCase() + name.slice(1),
            url,
            Icon: socialIconMap[name] || BriefcaseBusiness,
            external: isExternalHref(url)
        })),
        []
    );

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-primary transition-slow pt-24 pb-28">
            <div className="page-padding">
                <div className="mx-auto max-w-7xl">
                    <div ref={handwritingRef} className="mb-[-10px] ml-1 text-4xl opacity-0 md:text-5xl" style={{ fontFamily: "'Caveat', cursive", color: 'var(--accent)' }}>
                        Skills & Companies
                    </div>
                    <h1
                        ref={titleRef}
                        className="m-0 text-5xl font-black leading-none opacity-0 md:text-7xl lg:text-8xl"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Stack
                    </h1>

                    <div className="mt-10 grid gap-8 xl:grid-cols-[0.98fr_1.4fr] xl:items-start">
                        <div
                            ref={introRef}
                            className="space-y-6 opacity-0"
                        >
                            <section className="rounded-[34px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.07)] sm:p-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-500/85">
                                            What I Deliver
                                        </p>
                                        <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">
                                            Senior Flutter delivery with architecture, product ownership, and reliable releases.
                                        </h2>
                                        <p className="text-base leading-8 text-sec sm:text-lg">
                                            {personalInfo.bio}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-500/85">
                                            Core Strengths
                                        </p>
                                        <div className="flex flex-wrap gap-2.5">
                                            {focusItems.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-2xl border border-blue-500/15 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-sec"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-500/85">
                                            Connect
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {socialLinks.map(({ name, label, url, Icon, external }) => (
                                                <a
                                                    key={name}
                                                    href={url}
                                                    target={external ? '_blank' : undefined}
                                                    rel={external ? 'noopener noreferrer' : undefined}
                                                    onClick={() => trackClick(label)}
                                                    className="inline-flex items-center gap-2.5 rounded-2xl border border-black/6 bg-white/40 px-4 py-3 text-sm font-bold text-primary transition-all hover:-translate-y-0.5 hover:border-blue-500/30 hover:text-blue-500 dark:border-white/8 dark:bg-white/4"
                                                >
                                                    <Icon size={18} className="text-blue-500" />
                                                    {label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-[30px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.06)] sm:p-7">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-500/85">
                                            Companies
                                        </p>
                                        <h3 className="text-2xl font-black leading-tight text-primary">
                                            Teams and products I&apos;ve shipped with
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {companies.map((company) => (
                                            <span
                                                key={company}
                                                className="rounded-full border border-black/5 bg-black/5 px-4 py-2.5 text-sm font-bold text-primary dark:border-white/8 dark:bg-white/6"
                                            >
                                                {company}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-[30px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.06)] sm:p-7">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-500/85">
                                            Experience
                                        </p>
                                        <h3 className="text-2xl font-black leading-tight text-primary">
                                            Senior, mid, and hands-on product delivery across mobile teams
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {experiencePreview.map((experience) => (
                                            <div
                                                key={`${experience.company}-${experience.period}`}
                                                className="rounded-[24px] border border-black/5 bg-black/[0.03] p-4 dark:border-white/8 dark:bg-white/[0.03]"
                                            >
                                                <div className="space-y-2.5">
                                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                                        <div className="space-y-1">
                                                            <h4 className="text-lg font-black text-primary">{experience.company}</h4>
                                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500/80">{experience.role}</p>
                                                        </div>
                                                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                                                            {experience.period}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                                                        {experience.location}
                                                    </p>
                                                    <p className="text-sm leading-7 text-sec">
                                                        {experience.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-[34px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.07)] sm:p-8">
                                <div className="space-y-3">
                                    <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-500/85">
                                        Skill Catalog
                                    </p>
                                    <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">
                                        Architecture, integrations, delivery standards, and production tooling.
                                    </h2>
                                    <p className="max-w-3xl text-base leading-8 text-sec">
                                        A fuller view of Mahmoud&apos;s mobile stack across Flutter foundations, architecture choices, backend integration, release work, and day-to-day engineering practices.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                                {techStack.map((item, index) => (
                                    <SkillCard
                                        key={item.name}
                                        name={item.name}
                                        summary={item.summary}
                                        color={item.color}
                                        skillIcon={item.skillIcon}
                                        delay={250 + index * 70}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {techStack.length === 0 && (
                        <div className="mt-10 rounded-[28px] border border-dashed border-[var(--navbar-border)] p-6 text-center text-sec">
                            Stack items will appear here once the portfolio data is loaded.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stack;
