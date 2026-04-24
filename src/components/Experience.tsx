import { useEffect, useMemo, useRef } from 'react';
import anime from 'animejs';
import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    Mail,
    MapPin,
    PhoneCall,
    Sparkles,
} from 'lucide-react';
import { experiences, personalInfo, resumeHighlights } from '../data/portfolioData';
import { useSocialTracker } from '../hooks/useSocialTracker';

const Experience = () => {
    const handwritingRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { trackClick } = useSocialTracker();

    useEffect(() => {
        anime({
            targets: [handwritingRef.current, titleRef.current, contentRef.current],
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            delay: anime.stagger(100),
            easing: 'easeOutExpo'
        });
    }, []);

    const companies = useMemo(
        () => experiences.map((experience) => experience.company),
        []
    );

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-primary pb-48 pt-24 transition-slow">
            <div className="page-padding">
                <div className="mx-auto max-w-7xl pb-32">
                    <div ref={handwritingRef} className="mb-[-10px] ml-1 text-4xl opacity-0 md:text-5xl" style={{ fontFamily: "'Caveat', cursive", color: 'var(--accent)' }}>
                        Data & Experience
                    </div>
                    <h1
                        ref={titleRef}
                        className="m-0 text-5xl font-black leading-none opacity-0 md:text-7xl lg:text-8xl"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Profile
                    </h1>

                    <div ref={contentRef} className="mt-12 grid gap-10 opacity-0 xl:grid-cols-[0.92fr_1.35fr] xl:items-start">
                        <div className="space-y-10">
                            <section className="rounded-[34px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-6 sm:p-8 shadow-[0_18px_40px_rgba(0,0,0,0.07)]">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-500/85">
                                            Senior Mobile Profile
                                        </p>
                                        <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">
                                            Senior Flutter Developer shipping Android and iOS products with clear ownership.
                                        </h2>
                                        <p className="text-base leading-8 text-sec sm:text-lg">
                                            {personalInfo.bio}
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <a href={`mailto:${personalInfo.email}`} className="group flex min-h-[160px] flex-col justify-between rounded-[24px] border border-black/5 bg-black/[0.03] p-6 transition-all hover:border-blue-500/20 hover:bg-blue-500/[0.02] dark:border-white/8 dark:bg-white/[0.03]">
                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                                                <Mail size={15} />
                                                Email
                                            </div>
                                            <p className="mt-4 text-sm font-bold leading-relaxed text-primary transition-colors group-hover:text-blue-500">{personalInfo.email}</p>
                                        </a>
                                        <a
                                            href={personalInfo.socialLinks.call}
                                            onClick={() => trackClick('Call')}
                                            className="rounded-[24px] border border-black/5 bg-black/[0.03] p-5 transition-colors hover:text-blue-500 dark:border-white/8 dark:bg-white/[0.03]"
                                        >
                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                                                <PhoneCall size={15} />
                                                Call
                                            </div>
                                            <p className="mt-4 text-sm font-bold leading-7 text-primary">{personalInfo.phone}</p>
                                        </a>
                                        <div className="rounded-[24px] border border-black/5 bg-black/[0.03] p-5 dark:border-white/8 dark:bg-white/[0.03] sm:col-span-2">
                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-500">
                                                <MapPin size={15} />
                                                Location
                                            </div>
                                            <p className="mt-4 text-sm font-bold leading-7 text-primary">{personalInfo.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-[30px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-7 shadow-[0_14px_34px_rgba(0,0,0,0.06)]">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <Sparkles size={19} className="text-blue-500" />
                                        <h3 className="text-2xl font-black leading-tight text-primary">Core Strengths</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {resumeHighlights.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-2xl border border-blue-500/15 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold leading-6 text-sec"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-[30px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-7 shadow-[0_14px_34px_rgba(0,0,0,0.06)]">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <Building2 size={19} className="text-blue-500" />
                                        <h3 className="text-2xl font-black leading-tight text-primary">Companies</h3>
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
                        </div>

                        <section className="space-y-8 sm:space-y-10">
                            <div className="flex items-center gap-3">
                                <BriefcaseBusiness size={22} className="text-blue-500" />
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-primary">Experience Timeline</h2>
                            </div>

                            <div className="space-y-8 sm:space-y-10">
                                {experiences.map((experience) => (
                                    <article
                                        key={`${experience.company}-${experience.period}`}
                                        className="rounded-[30px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-7 shadow-[0_14px_34px_rgba(0,0,0,0.06)] sm:p-8"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-black tracking-tight text-primary">{experience.company}</h3>
                                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-500/80">{experience.role}</p>
                                                    <p className="text-sm font-semibold text-muted">{experience.location}</p>
                                                </div>
                                                <span className="inline-flex h-fit items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">
                                                    <CalendarDays size={14} />
                                                    {experience.period}
                                                </span>
                                            </div>

                                            <p className="text-sm leading-8 text-sec">{experience.description}</p>

                                            {'highlights' in experience && Array.isArray(experience.highlights) && (
                                                <div className="space-y-4 pt-1">
                                                    {experience.highlights.map((item: string) => (
                                                        <div key={item} className="flex gap-3 text-sm leading-7 text-sec">
                                                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Experience;
