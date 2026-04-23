import { createElement, useEffect, useRef, useState, useMemo } from 'react';
import anime from 'animejs';
import { Github, Instagram, Linkedin, Twitter, Facebook, Mail, Link as LinkIcon, Twitch, Youtube, Code } from 'lucide-react';
import { useSocialTracker } from '../hooks/useSocialTracker';
import { techStack, personalInfo } from '../data/portfolioData';

interface StackItemProps {
    icon: string;
    name: string;
    delay: number;
    iconSize: number;
}

const StackItem = ({ icon, name, iconSize, delay }: StackItemProps) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        anime({
            targets: itemRef.current,
            opacity: [0, 1],
            filter: ['blur(20px)', 'blur(0px)'],
            duration: 1200,
            delay: delay,
            easing: 'easeOutExpo'
        });
    }, [delay]);

    const showFallback = !icon || imgError;
    const minHeight = Math.max(iconSize + 20, 60);
    const fallbackSize = Math.max(iconSize * 0.8, 40);

    return (
        <div
            ref={itemRef}
            className="w-full h-full flex items-center justify-center p-3 opacity-0"
            style={{ minHeight: `${minHeight}px` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                {showFallback ? (
                    <Code size={fallbackSize} className="text-zinc-400" />
                ) : (
                    <img
                        src={icon}
                        alt={name}
                        title={name}
                        onError={() => setImgError(true)}
                        style={{
                            width: `${iconSize}px`,
                            height: `${iconSize}px`,
                            objectFit: 'contain',
                            objectPosition: 'center',
                            opacity: isHovered ? 1 : 0.6,
                            filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
                            transition: 'all 0.3s ease',
                            display: 'block'
                        }}
                    />
                )}
            </div>
        </div>
    );
};

const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('github')) return Github;
    if (lower.includes('linkedin')) return Linkedin;
    if (lower.includes('instagram')) return Instagram;
    if (lower.includes('twitter') || lower.includes('x.com')) return Twitter;
    if (lower.includes('facebook')) return Facebook;
    if (lower.includes('youtube')) return Youtube;
    if (lower.includes('twitch')) return Twitch;
    if (lower.includes('mail') || lower.includes('@')) return Mail;
    return LinkIcon;
};

const SocialIcon = ({ name, url, delay }: { name: string; url: string; delay: number }) => {
    const iconRef = useRef<HTMLAnchorElement>(null);
    const { trackClick } = useSocialTracker();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        anime({
            targets: iconRef.current,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: delay,
            easing: 'easeOutQuad'
        });
    }, [delay]);

    const iconElement = createElement(getIcon(name), {
        size: 32,
        className: `transition-colors duration-300 ${isHovered ? 'text-black' : 'text-gray-500'}`,
        strokeWidth: 1.5
    });

    return (
        <a
            ref={iconRef}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(name)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${isHovered ? 'bg-zinc-100 scale-110' : ''}`}
        >
            {iconElement}
            <span 
                className="absolute md:right-full md:mr-3 md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:left-auto md:translate-x-0 bottom-full mb-3 md:mb-0 left-1/2 -translate-x-1/2 md:left-auto px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl"
                style={{ 
                    opacity: isHovered ? 1 : 0,
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--bg-primary)'
                }}
            >
                {name}
            </span>
        </a>
    );
};

const Stack = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const handwritingRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    type StackData = { icon?: string; name?: string };
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gridConfig = useMemo(() => {
        const isMobile = windowWidth < 640;
        const isTablet = windowWidth >= 640 && windowWidth < 1024;
        let columns: number;
        let iconSize: number;
        let paddingTotal: number;

        if (isMobile) {
            columns = 3;
            iconSize = windowWidth < 400 ? 45 : 65;
            paddingTotal = windowWidth < 400 ? 12 : 16;
        } else if (isTablet) {
            columns = 4;
            iconSize = windowWidth < 800 ? 80 : 100;
            paddingTotal = 20;
        } else {
            columns = 5;
            if (windowWidth < 1100) iconSize = 90;
            else if (windowWidth < 1280) iconSize = 100;
            else if (windowWidth < 1440) iconSize = 110;
            else iconSize = 120;
            paddingTotal = iconSize > 120 ? 40 : 24;
        }

        const cellWidth = iconSize + paddingTotal;
        const markerPositions: number[] = [];
        for (let i = 1; i < columns; i++) {
            markerPositions.push((i / columns) * 100);
        }
        return { columns, iconSize, markerPositions, cellWidth, isMobile, isTablet };
    }, [windowWidth]);

    const stackItems = useMemo<StackData[]>(() => (
        techStack.map((item) => ({
            name: item.name,
            icon: item.skillIcon ? `https://skillicons.dev/icons?i=${item.skillIcon}` : ''
        }))
    ), []);

    const socialLinks = useMemo(() => (
        Object.entries(personalInfo.socialLinks).map(([name, url]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            url
        }))
    ), []);

    useEffect(() => {
        anime({
            targets: handwritingRef.current,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutExpo'
        });

        anime({
            targets: titleRef.current,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: 100,
            easing: 'easeOutExpo'
        });
    }, []);

    const getItemClasses = (index: number) => {
        const { columns } = gridConfig;
        const totalItems = stackItems.length;
        const totalRows = Math.ceil(totalItems / columns);
        const currentRow = Math.floor(index / columns);
        const isLastRow = currentRow === totalRows - 1;
        const isLastCol = (index + 1) % columns === 0;
        return { isLastRow, isLastCol };
    };

    return (
        <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center bg-primary transition-slow pt-20 pb-40 page-padding">
            <div className="max-w-7xl w-full mx-auto relative z-10">
                <div className="mb-14">
                    <div
                        ref={handwritingRef}
                        className="text-4xl md:text-5xl opacity-0 mb-[-15px] ml-2"
                        style={{
                            fontFamily: "'Caveat', cursive",
                            color: 'var(--accent)'
                        }}
                    >
                        My Tech
                    </div>
                    <h1
                        ref={titleRef}
                        className="text-6xl md:text-8xl lg:text-9xl font-black transition-slow opacity-0 m-0 leading-none"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Stack
                    </h1>
                </div>

                <div
                    ref={containerRef}
                    className="flex flex-col md:flex-row items-center md:items-start justify-between w-full bg-transparent px-6 sm:px-12 lg:px-20 py-4"
                >
                    <div
                        className="relative shrink-0"
                        style={{
                            width: (gridConfig.isMobile || gridConfig.isTablet)
                                ? 'fit-content'
                                : `${gridConfig.columns * gridConfig.cellWidth}px`
                        }}
                    >
                        <div className="marker marker-corner-tl"></div>
                        <div className="marker marker-corner-tr"></div>
                        <div className="marker marker-corner-bl"></div>
                        <div className="marker marker-corner-br"></div>

                        {gridConfig.markerPositions.map((pos, idx) => (
                            <div
                                key={`top-${idx}`}
                                className="marker marker-edge-top"
                                style={{
                                    left: `${pos}%`,
                                    transform: 'translateX(-50%)',
                                    top: '-6px',
                                    display: 'block'
                                }}
                            />
                        ))}

                        {gridConfig.markerPositions.map((pos, idx) => (
                            <div
                                key={`bottom-${idx}`}
                                className="marker marker-edge-bottom"
                                style={{
                                    left: `${pos}%`,
                                    transform: 'translateX(-50%)',
                                    bottom: '-6px',
                                    display: 'block'
                                }}
                            />
                        ))}

                        <div
                            className="dynamic-stack-grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: (gridConfig.isMobile || gridConfig.isTablet)
                                    ? `repeat(${gridConfig.columns}, 1fr)`
                                    : `repeat(${gridConfig.columns}, ${gridConfig.cellWidth}px)`,
                                gap: 0,
                                border: '1px dashed var(--text-muted)',
                                position: 'relative',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                width: '100%'
                            }}
                        >
                            {stackItems.map((item, index) => {
                                const { isLastRow, isLastCol } = getItemClasses(index);
                                return (
                                    <div
                                        key={index}
                                        className="stack-item-dynamic"
                                        style={{
                                            borderRight: isLastCol ? 'none' : '1px dashed var(--text-muted)',
                                            borderBottom: isLastRow ? 'none' : '1px dashed var(--text-muted)',
                                            padding: gridConfig.iconSize > 120 ? '20px' : '12px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <StackItem
                                            icon={item.icon || ''}
                                            name={item.name || ''}
                                            delay={500 + (index * 50)}
                                            iconSize={gridConfig.iconSize}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {socialLinks.length > 0 && (
                        <div className="flex flex-row md:flex-col items-center justify-center md:justify-start gap-3 md:gap-4 mt-8 md:mt-0 w-auto md:w-12 shrink-0 relative z-30">
                            <div className="hidden md:block w-px h-12 bg-gradient-to-b from-gray-400/50 to-transparent mb-2"></div>
                            {socialLinks.map((link, index) => (
                                <SocialIcon
                                    key={link.name}
                                    name={link.name}
                                    url={link.url}
                                    delay={800 + (index * 100)}
                                />
                            ))}
                            <div className="hidden md:block w-px h-12 bg-gradient-to-t from-gray-400/50 to-transparent mt-2"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stack;
