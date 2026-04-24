import { useEffect, useRef, useState } from 'react';
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
    MapPinned,
    RadioTower,
    Rocket,
    Share2,
    Smartphone,
    type LucideIcon
} from 'lucide-react';
import { techStack } from '../data/portfolioData';

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
    'ios swiftui': Smartphone,
    'android kotlin': Smartphone,
    'kotlin jetpack': Layers3,
    'testing & qa': Blocks,
    'git & github': Github,
    'performance optimization': Rocket,
    'agile delivery': BriefcaseBusiness,
    'ci/cd & releases': Rocket,
    'react native': Smartphone,
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

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-primary transition-slow pt-24 pb-28">
            <div className="page-padding">
                <div className="mx-auto max-w-7xl">
                    <div ref={handwritingRef} className="mb-[-10px] ml-1 text-4xl opacity-0 md:text-5xl" style={{ fontFamily: "'Caveat', cursive", color: 'var(--accent)' }}>
                        Skill Catalog
                    </div>
                    <h1
                        ref={titleRef}
                        className="m-0 text-5xl font-black leading-none opacity-0 md:text-7xl lg:text-8xl"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Stack
                    </h1>

                    <div className="mt-10 space-y-8">
                        <div
                            ref={introRef}
                            className="opacity-0"
                        >
                            <section className="rounded-[34px] border border-[var(--navbar-border)] bg-[var(--card-bg)] p-7 shadow-[0_18px_40px_rgba(0,0,0,0.07)] sm:p-8">
                                <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr] lg:items-end">
                                    <div className="space-y-3">
                                        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-500/85">
                                            Mobile Engineering Stack
                                        </p>
                                        <h2 className="text-3xl font-black leading-tight text-primary sm:text-4xl">
                                            Flutter, architecture, integrations, releases, and production tooling.
                                        </h2>
                                    </div>
                                    <p className="text-base leading-8 text-sec sm:text-lg">
                                        A focused view of the skills Mahmoud uses to build maintainable mobile products across Android and iOS.
                                    </p>
                                </div>
                            </section>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
