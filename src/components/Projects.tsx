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

const ProjectCard = ({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [showContributors, setShowContributors] = useState(false);
    const mediaItems = project.images.length > 0 ? project.images : ['__placeholder__'];

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
            <div className="relative h-[200px] overflow-hidden rounded-t-[20px] will-change-transform">
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
                <div className="absolute top-4 left-4 z-10">
                    <AnimatePresence mode="wait">
                        {!showContributors ? (
                            <motion.div
                                key="tags"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="flex gap-1.5 flex-wrap"
                            >
                                {(project.tags || []).slice(0, 2).map((tag: Tag, i) => (
                                    <div
                                        key={i}
                                        className="px-2.5 py-1 rounded-full bg-white/40 backdrop-blur-md text-xs font-semibold text-gray-800 shadow-sm flex items-center gap-1"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: tag.color || '#3b82f6' }} />
                                        {tag.name}
                                    </div>
                                ))}
                                {(project.tags || []).length > 2 && (
                                    <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-semibold text-white shadow-sm">
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
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h3 className="heading-md mb-2.5 text-primary">
                    {project.title}
                </h3>
                <p
                    className="text-body text-sec leading-relaxed flex-1 overflow-hidden"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {project.description}
                </p>
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
        <div className="min-h-screen bg-primary transition-colors duration-300 pt-32 pb-20">
            <div className="page-padding">
                {/* Header - Reduced MB */}
                <div className="mb-8 pl-0">
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
                <div className="mb-6 max-w-[600px]">
                    <div className="glass-surface flex items-center p-3 px-5 border border-[var(--navbar-border)] shadow-md transition-shadow duration-300">
                        <Search size={20} className="text-sec mr-3" />
                        <input
                            type="text"
                            placeholder="Search by project, company, domain, or capability..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-none bg-transparent text-primary text-base w-full outline-none font-inter"
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
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('revil:project_open', { detail: { id: project.id } }));
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
                                window.dispatchEvent(new CustomEvent('revil:project_close'));
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
