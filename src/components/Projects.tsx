import { useEffect, useRef, useState, useMemo } from 'react';
import { projects as localProjects } from '../data/portfolioData';
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs';
import { X, Search } from 'lucide-react';

import MProjectView from './M-ProjectView';
import MContributorView, { Contributor } from './M-ContributorView';
import { ProjectData as Project, TagData as Tag, ContributorData } from '../types';
import { getTechColor, isVideoFile } from '../utils/projectUtils';

const CardVideo = ({ src, isActive }: { src: string; isActive: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            // Jump to random time when becoming active to show "random frames"
            if (video.duration) {
                video.currentTime = Math.random() * video.duration;
            }
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    }, [isActive]);

    // YouTube-style "pick a random starting point" 
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const setRandomTime = () => {
            if (video.duration) {
                video.currentTime = Math.random() * video.duration;
            }
        };

        if (video.readyState >= 1) {
            setRandomTime();
        } else {
            video.addEventListener('loadedmetadata', setRandomTime);
            return () => video.removeEventListener('loadedmetadata', setRandomTime);
        }
    }, []);

    return (
        <video
            ref={videoRef}
            src={src}
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
    );
};

// shimmer-fast keyframes are now in globals.css

const CardImage = ({ src, alt }: { src: string; alt: string }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    return (
        <>
            {/* shimmer-fast keyframes are in globals.css */}
            {/* Skeleton Loader Container */}
            <div
                className={`absolute inset-0 z-10 bg-white/5 overflow-hidden transition-opacity duration-1000 ease-out ${isImageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                {/* Moving Light effect - only rendered when loading to stop the animation when complete */}
                {!isImageLoaded && (
                    <div
                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        style={{ animation: 'shimmer-fast 1.2s infinite ease-in-out' }}
                    />
                )}
            </div>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-[1500ms] ease-out ${!isImageLoaded ? 'scale-105' : ''}`}
                style={{
                    filter: isImageLoaded ? 'blur(0px)' : 'blur(20px)',
                    opacity: isImageLoaded ? 1 : 0
                }}
            />
        </>
    );
};

const ProjectPlaceholder = ({ project }: { project: Project }) => {
    const accent = getTechColor(project.stack?.[0] || project.tags?.[0]?.name || 'Flutter');

    return (
        <div
            className="absolute inset-0"
            style={{
                background: `linear-gradient(145deg, ${accent} 0%, rgba(15, 23, 42, 0.96) 55%, rgba(2, 6, 23, 1) 100%)`
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_35%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_35%,rgba(0,0,0,0.2))]" />
            <div className="relative h-full flex flex-col justify-between p-5 text-white">
                <div className="flex flex-wrap gap-2">
                    {(project.platforms || []).slice(0, 2).map((platform) => (
                        <span key={platform} className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">
                            {platform}
                        </span>
                    ))}
                </div>

                <div>
                    {project.role && (
                        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/65">
                            {project.role}
                        </div>
                    )}
                    <div className="text-2xl font-black tracking-tight">
                        {project.title || project.name}
                    </div>
                    {project.category && (
                        <div className="mt-2 text-xs font-semibold text-white/72">
                            {project.category}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const hasUsefulStatValue = (value: unknown) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'number') return value > 0;

    const normalized = String(value).trim().toLowerCase();
    if (!normalized) return false;
    if (['0', '0+', '0.0', 'n/a', 'na', 'none', 'not available', 'not publicly available'].includes(normalized)) {
        return false;
    }

    const numeric = Number.parseFloat(normalized.replace(/,/g, ''));
    if (!Number.isNaN(numeric) && numeric === 0) return false;

    return true;
};

const ProjectCard = ({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [showContributors, setShowContributors] = useState(false);
    const mediaItems = project.images.length > 0 ? project.images : ['__placeholder__'];
    const usefulStats = project.stats
        ? {
            downloads: hasUsefulStatValue(project.stats.downloads) ? project.stats.downloads : undefined,
            rating: hasUsefulStatValue(project.stats.rating) ? project.stats.rating : undefined,
            reviews: hasUsefulStatValue(project.stats.reviews) ? project.stats.reviews : undefined
        }
        : null;
    const hasUsefulStats = !!usefulStats && Object.values(usefulStats).some(Boolean);

    // Slideshow logic (Card Hover)
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isHovered && mediaItems.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % mediaItems.length);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isHovered, mediaItems.length]);

    // Cycle between Stack and Contributors
    useEffect(() => {
        const interval = setInterval(() => {
            setShowContributors(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Entrance animation
    useEffect(() => {
        anime({
            targets: cardRef.current,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 500,
            delay: index * 50,
            easing: 'easeOutQuad'
        });
    }, [index]);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImageIndex(0);
            }}
            onClick={onClick}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: isHovered ? -8 : 0 }}
            transition={{
                opacity: { duration: 0.3, delay: index * 0.03 },
                y: { duration: 0.2 },
                layout: { duration: 0.4, type: "tween", ease: "easeOut" }
            }}
            className={`
                group flex flex-col h-full glass-panel cursor-pointer overflow-hidden
                border border-[var(--navbar-border)] transition-shadow duration-300
                ${isHovered ? 'shadow-xl' : 'shadow-md'}
            `}
            style={{ willChange: 'transform, opacity' }}
        >
            <div className="relative h-[126px] overflow-hidden rounded-t-[18px] will-change-transform sm:h-[150px] sm:rounded-t-[20px] lg:h-[170px]">
                {/* Slideshow Overlay */}
                <div
                    className="absolute inset-0"
                    style={{ pointerEvents: 'none' }}
                >
                    <div
                        className="flex h-full transition-transform duration-500 ease-in-out"
                        style={{
                            width: `${mediaItems.length * 100}%`,
                            transform: `translateX(-${(currentImageIndex * 100) / mediaItems.length}%)`,
                        }}
                    >
                        {mediaItems.map((img, i) => {
                            const isVideo = isVideoFile(img);
                            return (
                                <div key={i} style={{ width: `${100 / mediaItems.length}%` }} className="h-full relative overflow-hidden">
                                    {img === '__placeholder__' ? (
                                        <ProjectPlaceholder project={project} />
                                    ) : isVideo ? (
                                        <CardVideo src={img} isActive={isHovered && currentImageIndex === i} />
                                    ) : (
                                        <CardImage src={img} alt={project.title || 'Project'} />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Overlays: Tags / Contributors Slideshow */}
                <div className="absolute left-2 top-2 z-10 sm:left-4 sm:top-4">
                    <AnimatePresence mode="wait">
                        {!showContributors ? (
                            <motion.div
                                key="tags"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="flex gap-1 flex-wrap sm:gap-1.5"
                            >
                                {(project.tags || []).slice(0, 2).map((tag: Tag, i) => (
                                    <div
                                        key={i}
                                        className="rounded-full bg-white/40 px-2 py-0.5 text-[10px] font-semibold text-gray-800 shadow-sm backdrop-blur-md flex items-center gap-1 sm:px-2.5 sm:py-1 sm:text-xs"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: tag.color || '#3b82f6' }} />
                                        {tag.name}
                                    </div>
                                ))}
                                {(project.tags || []).length > 2 && (
                                    <div className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-xs">
                                        +{(project.tags || []).length - 2} More
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="contributors"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center"
                            >
                                <div className="flex pl-1">
                                    {(project.contributors || []).slice(0, 3).map((c, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full border-2 border-white -ml-2 overflow-hidden bg-gray-100 shadow-sm"
                                            title={c.name}
                                        >
                                            {c.image && typeof c.image === 'string' ? (
                                                <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-[10px] font-bold">
                                                    {c.name ? c.name.charAt(0) : '?'}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {(project.contributors || []).length > 3 && (
                                        <div className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-blue-500 text-white flex items-center justify-center text-[0.7rem] font-bold shadow-sm">
                                            +{(project.contributors || []).length - 3}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Stats Overlay - NEW */}
                {hasUsefulStats && usefulStats && (
                    <div className="absolute bottom-2 left-2 right-2 z-10 flex justify-between items-end sm:bottom-4 sm:left-4 sm:right-4">
                        <div className="flex gap-2 sm:gap-4">
                            {usefulStats.downloads && (
                                <div className="flex flex-col">
                                    <span className="hidden text-[9px] font-black uppercase tracking-widest text-white/40 sm:block">Installs</span>
                                    <span className={`font-black text-white leading-none ${usefulStats.downloads.length > 8 ? 'text-[9px] sm:text-[10px]' : 'text-[11px] sm:text-sm'}`}>
                                        {usefulStats.downloads}
                                    </span>
                                </div>
                            )}
                            {usefulStats.rating && (
                                <div className="flex flex-col">
                                    <span className="hidden text-[9px] font-black uppercase tracking-widest text-white/40 sm:block">Rating</span>
                                    <span className="text-[11px] font-black leading-none text-white sm:text-sm">★ {usefulStats.rating}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            {usefulStats.reviews && (
                                <div className="flex flex-col items-end">
                                    <span className="hidden text-[9px] font-black uppercase tracking-widest text-white/40 sm:block">Reviews</span>
                                    <span className="text-[11px] font-black leading-none text-white sm:text-sm">{usefulStats.reviews}</span>
                                </div>
                            )}
                            <div className="hidden rounded border border-white/10 bg-white/10 px-1.5 py-0.5 backdrop-blur-md sm:block">
                                <span className="text-[7px] font-black text-white/60 uppercase tracking-[0.2em]">Verified Store Data</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-3 sm:p-4">
                <div className="mb-1.5 flex items-center justify-between gap-2 sm:mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                        {project.category || 'Mobile App'}
                    </span>
                    <span className="hidden text-[10px] font-bold text-sec sm:block">
                        {project.platforms?.join(' • ') || 'Mobile'}
                    </span>
                </div>

                <h3 className="mb-2 line-clamp-2 text-sm font-black leading-tight tracking-tight text-primary transition-colors group-hover:text-blue-500 sm:mb-2 sm:text-xl">
                    {project.title || project.name}
                </h3>

                <p
                    className="mb-3 line-clamp-2 flex-1 text-xs leading-5 text-sec sm:mb-4 sm:line-clamp-3 sm:text-[13px] sm:leading-relaxed"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {project.description}
                </p>

                <div className="flex items-center justify-between gap-2 border-t border-[var(--navbar-border)] pt-3 sm:pt-4">
                    <div className="flex min-w-0 items-center gap-2">
                        <div className="hidden size-8 rounded-full bg-blue-500/10 sm:flex items-center justify-center">
                            <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider text-primary">Live Product</span>
                            <span className="hidden text-[9px] font-bold text-sec sm:block">Production Ready</span>
                        </div>
                    </div>
                    <div className="rounded-lg bg-blue-500 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-white transition-colors group-hover:bg-blue-600 sm:rounded-xl sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-widest">
                        View
                    </div>
                </div>
            </div>
        </motion.div >
    );
};

const Projects = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const handwritingRef = useRef<HTMLDivElement>(null);
    const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
    const [showContributorModal, setShowContributorModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');


    const projectsData = useMemo(() => {
        return localProjects.map(project => ({
            ...project,
            views: project.views || 0,
            githubViews: project.githubViews || 0,
            liveViews: project.liveViews || 0,
            downloadViews: project.downloadViews || 0,
            contributors: project.contributors || [],
            listing: project.listing || 0,
            tags: project.tags?.map(t => ({
                name: t.name,
                color: getTechColor(t.name),
                iconSvg: '' // Can add icons if needed
            })) || []
        }));
    }, []);

    const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);
    const selectedProject = useMemo(() =>
        projectsData.find(p => p.id === selectedProjectId) || null,
        [projectsData, selectedProjectId]
    );

    const getLevenshteinDistance = (a: string, b: string) => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    const filteredProjects = useMemo(() => {
        if (searchQuery.length < 2) {
            return [...projectsData].sort((a, b) => {
                const aVal = a.listing && a.listing > 0 ? a.listing : 999999;
                const bVal = b.listing && b.listing > 0 ? b.listing : 999999;
                if (aVal !== bVal) return aVal - bVal;
                return (a.title || '').localeCompare(b.title || '');
            });
        }

        const query = searchQuery.toLowerCase();
        const scored = projectsData.map(project => {
            let minDistance = Infinity;
            const checkTerm = (term: string) => {
                const lower = term.toLowerCase();
                if (lower.includes(query)) return 0;
                const words = lower.split(/[\s-_]+/);
                let d = Infinity;
                words.forEach(w => {
                    d = Math.min(d, getLevenshteinDistance(query, w));
                });
                return d;
            };
            minDistance = Math.min(minDistance, checkTerm(project.title || ''));
            minDistance = Math.min(minDistance, checkTerm(project.category || ''));
            minDistance = Math.min(minDistance, checkTerm(project.role || ''));
            (project.tags || []).forEach(tag => {
                minDistance = Math.min(minDistance, checkTerm(typeof tag === 'string' ? tag : tag.name));
            });
            (project.stack || []).forEach(tech => {
                minDistance = Math.min(minDistance, checkTerm(tech));
            });
            project.contributors.forEach(c => {
                minDistance = Math.min(minDistance, checkTerm(c.name || ''));
            });
            return { project, minDistance };
        });

        return scored
            .filter(item => item.minDistance <= 2)
            .sort((a, b) => a.minDistance - b.minDistance)
            .map(item => item.project);
    }, [searchQuery, projectsData]);

    useEffect(() => {
        anime({
            targets: handwritingRef.current,
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 600,
            easing: 'easeOutExpo'
        });
        anime({
            targets: titleRef.current,
            opacity: [0, 1],
            translateX: [-30, 0],
            duration: 800,
            delay: 150,
            easing: 'easeOutExpo'
        });
    }, []);

    useEffect(() => {
        if (selectedProjectId || showContributorModal) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [selectedProjectId, showContributorModal]);

    return (
        <div className="min-h-screen bg-primary transition-colors duration-300 pt-28 pb-32 sm:pt-32 sm:pb-48">
            <div className="page-padding pb-24 sm:pb-32">
                {/* Header - Reduced MB */}
                <div className="mb-6 pl-0 sm:mb-8">
                    <div
                        ref={handwritingRef}
                        className="text-5xl opacity-0 mb-[-20px] ml-2.5"
                        style={{
                            fontFamily: "'Caveat', cursive",
                            color: 'var(--accent)'
                        }}
                    >
                        Selected
                    </div>
                    <h1
                        ref={titleRef}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-primary m-0 opacity-0 transition-colors duration-300 font-inter"
                    >
                        Projects
                    </h1>
                </div>

                {/* Search Bar - Reduced MB */}
                <div className="mb-5 max-w-[600px] sm:mb-8">
                    <div className="glass-surface flex items-center border border-[var(--navbar-border)] p-3 px-4 shadow-md transition-shadow duration-300 sm:px-5">
                        <Search size={20} className="text-sec mr-3" />
                        <input
                            type="text"
                            placeholder="Search by project, company, domain, or capability..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border-none bg-transparent text-sm text-primary outline-none font-inter sm:text-base"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="bg-none border-none text-sec cursor-pointer flex items-center"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Projects Grid */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6 xl:gap-8">
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('tolba:project_open', { detail: { id: project.id } }));
                                    setSelectedProjectId(project.id ?? project.name);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[28px] border border-dashed border-[var(--navbar-border)] bg-[var(--card-bg)] p-8 text-center">
                        <h3 className="text-2xl font-black text-primary">No projects match this search yet.</h3>
                        <p className="mt-3 text-sec">
                            Try a broader keyword or clear the current search.
                        </p>
                    </div>
                )}

                {/* Modals */}
                <AnimatePresence>
                    {selectedProject && (
                        <MProjectView
                            project={selectedProject}
                            onClose={() => {
                                window.dispatchEvent(new CustomEvent('tolba:project_close'));
                                setSelectedProjectId(null);
                            }}
                            onContributorClick={(contributor: ContributorData) => {
                                setSelectedContributor(contributor as Contributor);
                                setShowContributorModal(true);
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {showContributorModal && selectedContributor && (
                <MContributorView
                    contributor={selectedContributor}
                    onClose={() => setShowContributorModal(false)}
                />
            )}
        </div>
    );
};

export default Projects;
