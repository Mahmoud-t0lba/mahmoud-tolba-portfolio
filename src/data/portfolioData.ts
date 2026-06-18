import { ProjectData, TagData } from '../types';
import { withBasePath } from '../lib/site';
import appStats from './appStats.json';

// Helper to get real stats for a project
const getStats = (id: string, defaultStats: any = {}) => {
    const statsMap: Record<string, string> = {
        'by-bus': 'bybus',
        'engineering-tracks': 'engtracks',
        'a-plus': 'aplus',
    };
    const statsId = statsMap[id] || id;
    const realStats = (appStats as any)[statsId];

    if (!realStats) return defaultStats;

    // Merge real stats, prioritizing accuracy as per user request
    return {
        ...defaultStats,
        downloads: realStats.downloads,
        rating: realStats.rating,
        reviews: realStats.reviews,
        // Remove fake/estimated stats
        // likes: undefined
    };
};

export const personalInfo = {
    name: 'Mahmoud Tolba',
    firstName: 'Mahmoud',
    lastName: 'Tolba',
    title: 'Senior Flutter Developer',
    email: 'mahmoudt0lba0111@gmail.com',
    phone: '+20 1097107762',
    location: 'Maadi, Egypt',
    currentRole: 'Senior Flutter Developer at Code7X',
    about: 'Senior Flutter Developer with 5+ years of experience building scalable, production-grade mobile apps across Android and iOS.',
    bio: 'Mahmoud is a Senior Flutter Developer with 5+ years of experience delivering mobile products across transport, social, education, utility, and commerce-focused domains. He specializes in scalable Flutter architecture, state management, API integration, polished product execution, and reliable delivery, while also bringing a React Native background and light iOS/Android native exposure for integration-heavy work.',
    availability: '80%',
    currentTime: 'UTC+02:00',
    resumeUrl: 'https://drive.google.com/file/d/1Wr35AlPkBnKGMXd4YxZh5YehrwBnOgXo/view?usp=sharing',
    heroImageUrl: withBasePath('/profile.png'),
    heroImageAlt: 'Portrait of Mahmoud Tolba',
    heroSideLabel: '5+ Years',
    heroBottomLabel: 'Senior Mobile Developer',
    socialLinks: {
        linkedin: 'https://www.linkedin.com/in/mahmoud-t0lba',
        github: 'https://github.com/Mahmoud-t0lba/',
        email: 'mailto:mahmoudt0lba0111@gmail.com',
        call: 'tel:+201097107762'
    }
};

export const availabilityInfo = {
    percent: 80,
    currentTime: 'UTC+02:00',
    statusLabel: 'Available for senior Flutter and mobile product roles',
    projectsBeingHandled: [
        {
            name: 'Flutter Architecture',
            status: 'Active',
            description: 'Scalable app structure, maintainable patterns, and production-minded delivery.'
        },
        {
            name: 'Product Delivery',
            status: 'Active',
            description: 'Cross-functional execution across Android and iOS from planning to release.'
        },
        {
            name: 'Team Enablement',
            status: 'Ongoing',
            description: 'Code review, engineering standards, and technical guidance for stronger delivery.'
        }
    ]
};

export const techStack: TagData[] = [
    {
        name: 'Flutter',
        color: '#02569B',
        skillIcon: 'flutter',
        summary: 'Cross-platform Android and iOS apps with polished UI, animation, and scalable feature delivery.'
    },
    {
        name: 'Dart',
        color: '#0175C2',
        skillIcon: 'dart',
        summary: 'Null-safe production code, reusable modules, and maintainable package structure.'
    },
    {
        name: 'Bloc / Cubit',
        color: '#2563EB',
        summary: 'Predictable state management for large features, clean events, and stable UI states.'
    },
    {
        name: 'Provider / Riverpod',
        color: '#0EA5E9',
        summary: 'Lightweight reactive state layers for modular flows, prototypes, and shared app services.'
    },
    {
        name: 'GetX',
        color: '#7C3AED',
        summary: 'Practical reactive controllers, dependency setup, and streamlined feature delivery when product scope fits.'
    },
    {
        name: 'MVVM',
        color: '#0891B2',
        summary: 'Structured presentation logic and feature modules that keep screens maintainable as products scale.'
    },
    {
        name: 'Clean Architecture',
        color: '#16A34A',
        summary: 'Feature-first separation between presentation, domain, and data for long-term maintainability.'
    },
    {
        name: 'SOLID + DI',
        color: '#14B8A6',
        summary: 'Low-coupled, testable codebases using dependency injection and reusable abstractions.'
    },
    {
        name: 'TDD',
        color: '#059669',
        summary: 'Test-driven development using unit, widget, and integration tests to design cleaner code and prevent regressions.'
    },
    {
        name: 'Firebase',
        color: '#FFCA28',
        skillIcon: 'firebase',
        summary: 'Auth, Firestore, Storage, notifications, analytics, and backend-friendly mobile integrations.'
    },
    {
        name: 'REST APIs',
        color: '#F97316',
        summary: 'Robust networking, pagination, error handling, token flows, and backend contract integration.'
    },
    {
        name: 'Realtime & WebSocket',
        color: '#EC4899',
        summary: 'Live updates, streaming data, socket-driven UX, and event-based product flows.'
    },
    {
        name: 'Notifications & Deep Links',
        color: '#F43F5E',
        summary: 'Push notifications, local alerts, routing, and re-engagement flows connected to real product journeys.'
    },
    {
        name: 'Maps & Location',
        color: '#34A853',
        summary: 'Google Maps, geolocation, trip tracking, routes, and map-centric product experiences.'
    },
    {
        name: 'Local Storage',
        color: '#0F766E',
        summary: 'Hive, Sqflite, caching, offline-first behavior, and persisted user state.'
    },
    {
        name: 'Native Bridges',
        color: '#7F52FF',
        summary: 'Swift, Kotlin, platform channels, and SDK configuration for integration-heavy mobile work.'
    },
    {
        name: 'iOS & Android Native',
        color: '#0A84FF',
        skillIcon: 'swift,kotlin',
        summary: 'Foundational native exposure (less than 1 year) used as a supportive background for platform channels, SDK setup, and Flutter-to-native integration.'
    },
    {
        name: 'SDK Integration',
        color: '#0F766E',
        summary: 'Third-party SDK setup for auth, analytics, payments, maps, chat, and business-specific mobile capabilities.'
    },
    {
        name: 'Performance Optimization',
        color: '#F97316',
        summary: 'Smoother rendering, startup improvements, memory-aware flows, and production tuning on real devices.'
    },
    {
        name: 'Testing & QA',
        color: '#22C55E',
        summary: 'Regression awareness, release validation, edge-case coverage, and practical QA support before shipping.'
    },
    {
        name: 'Git & GitHub',
        color: '#111827',
        skillIcon: 'github',
        summary: 'Branching, pull requests, code review, issue tracking, and collaborative delivery across engineering teams.'
    },
    {
        name: 'Agile Delivery',
        color: '#2563EB',
        summary: 'Sprint planning, task breakdown, follow-up, and stakeholder-aware execution through active product cycles.'
    },
    {
        name: 'CI/CD & Releases',
        color: '#111827',
        skillIcon: 'githubactions',
        summary: 'GitHub Actions, Bitrise, Fastlane, signing, and dependable App Store / Play Store delivery.'
    },
    {
        name: 'React Native',
        color: '#61DAFB',
        skillIcon: 'react',
        summary: 'Previous React Native experience that helps with migrations, audits, and legacy support.'
    }
];

export const resumeHighlights = [
    '5+ years building Flutter apps for production',
    'Scalable Android and iOS mobile delivery',
    'Clean Architecture, MVVM, SOLID, and DI',
    'Bloc/Cubit, Provider, GetX, and Riverpod',
    'React Native background plus light native integration support',
    'Agile execution, code review, CI/CD, and stakeholder-aligned delivery'
];

export const education = [
    {
        title: "Bachelor's Degree in Computer Science",
        institution: 'Mansoura University',
        period: '2018 - 2022'
    }
];

export const certifications = [
    { title: 'Advanced Flutter: Clean Architecture & Testing', issuer: 'Udemy / Coursera' },
    { title: 'Google Flutter & Dart - The Complete Guide', issuer: 'Udemy' },
    { title: 'Introduction to iOS Mobile Application Development', issuer: 'Meta' },
    { title: 'Agile Foundations', issuer: 'LinkedIn Learning' },
    { title: 'Claude 101', issuer: 'Anthropic' }
];

export const experiences = [
    {
        company: 'Code7X',
        role: 'Senior Flutter Developer',
        period: 'Dec 2024 - Present',
        location: 'Mansoura',
        description: 'Delivering Flutter applications with a focus on scalable architecture, performance optimisation, clean code practices, and dependable execution.',
        highlights: [
            'Drive technical development of Flutter applications with emphasis on scalable architecture and maintainable code.',
            'Manage feature delivery from planning to implementation, including task breakdown and execution follow-up.',
            'Work closely with cross-functional teams to deliver user-focused, business-aligned mobile solutions.',
            'Support teammates through code review, engineering standards, and architecture guidance.'
        ]
    },
    {
        company: 'Innova-Digits',
        role: 'Senior Flutter Developer',
        period: 'Sep 2023 - Dec 2024',
        location: 'Mansoura',
        description: 'Delivered cross-platform applications in an Agile environment while improving overall product quality.',
        highlights: [
            'Built and shipped cross-platform applications using Flutter within an Agile delivery model.',
            'Worked with stakeholders to align delivery with business expectations and project timelines.',
            'Improved UI quality and overall user experience through iterative product enhancements.'
        ]
    },
    {
        company: 'By Bus',
        role: 'Senior Flutter Developer',
        period: 'Mar 2024 - Jul 2024',
        location: 'Remote',
        description: 'Owned the By Bus passenger and captain applications from concept through launch with product-minded technical ownership.',
        highlights: [
            'Acted in a product-owner style role, keeping business goals aligned with technical execution.',
            'Took end-to-end ownership of the By Bus user and captain apps from conception to launch.',
            'Defined architecture, code structure, and feature delivery approach with scalability in mind.'
        ]
    },
    {
        company: 'MolTaqa',
        role: 'Mid Flutter Developer',
        period: 'Aug 2021 - Sep 2023',
        location: 'Remote',
        description: 'Developed and maintained scalable Flutter applications with a focus on performance, clean code, and maintainable architecture.',
        highlights: [
            'Developed and maintained Flutter applications for Android and iOS.',
            'Contributed to feature enhancements and interface improvements across active products.',
            'Worked remotely with the team to deliver planned features on schedule.'
        ]
    },
    {
        company: 'IX Solutions',
        role: 'Mobile Developer',
        period: 'Mar 2020 - Aug 2021',
        location: 'El Mansoura',
        description: 'Built client-focused mobile applications with attention to usability and product fit.',
        highlights: [
            'Developed mobile applications tailored to client requirements.',
            'Worked closely with stakeholders to improve product quality and usability.',
            'Supported reliable delivery across projects with a practical, hands-on execution style.'
        ]
    }
];

export const projects: ProjectData[] = [
    {
        id: 'by-bus',
        name: 'By Bus',
        title: 'By Bus',
        role: 'Senior Flutter Developer',
        category: 'Transport & Logistics',
        platforms: ['Android', 'iOS'],
        description: 'Bus transportation app for Egypt focused on route booking, trip visibility, and a smoother rider experience across Android and iOS.',
        fullDescription: 'By Bus is a production mobile transport product built around booking, route visibility, rider convenience, and dependable trip execution. Mahmoud owned the passenger and captain apps from concept through launch, shaping the architecture, feature flow, and engineering rhythm with a product-minded approach.',
        images: [],
        stack: ['Flutter', 'Clean Architecture', 'Bloc / Cubit', 'REST APIs', 'Firebase', 'Maps & Location'],
        tags: [
            { name: 'Transport & Logistics' },
            { name: 'Android' },
            { name: 'iOS' }
        ],
        contributors: [],
        contextHighlights: [
            'Public Android and iOS release for an Egypt-focused bus transportation service.',
            'Store listings highlight route booking, live tracking, multiple payment options, and rider convenience.'
        ],
        contributionHighlights: [
            'Owned the product journey from conception to launch across both user-facing apps.',
            'Designed the app architecture and code structure with scalability in mind.',
            'Aligned business goals with technical execution through product-minded delivery.',
            'Supported quality through code review and engineering best practices.'
        ],
        repoLink: '',
        liveLink: 'https://apps.apple.com/eg/app/by-bus/id6504498504',
        downloadLink: 'https://play.google.com/store/apps/details?id=com.bybus.passenger',
        stats: getStats('by-bus'),
        listing: 1
    },
    {
        id: 'ajlakum',
        name: 'Ajlakum',
        title: 'Ajlakum',
        role: 'Mobile Developer',
        category: 'Transport & Logistics',
        platforms: ['Mobile'],
        description: 'Transport and logistics project included in the CV as part of Mahmoud\'s applied mobile product experience.',
        fullDescription: 'Ajlakum represents Mahmoud\'s transport-focused project work from the CV. It rounds out his logistics experience beyond public store-backed releases and reflects hands-on product delivery in movement, booking, and operationally sensitive mobile workflows.',
        images: [],
        stack: ['Flutter', 'Clean Architecture', 'Bloc / Cubit', 'REST APIs'],
        tags: [
            { name: 'Transport & Logistics' },
            { name: 'CV-listed' }
        ],
        contributors: [],
        contextHighlights: [
            'Listed in the CV under transport and logistics work.',
            'No verified public store listing has been added to the portfolio yet.'
        ],
        contributionHighlights: [
            'Included as part of Mahmoud\'s transport-focused project experience in the CV.'
        ],
        repoLink: '',
        liveLink: '',
        stats: getStats('ajlakum'),
        listing: 2
    },
    {
        id: 'sawa',
        name: 'SAWA',
        title: 'SAWA',
        role: 'Senior Flutter Developer',
        category: 'Social & Lifestyle',
        platforms: ['Android', 'iOS'],
        description: 'Carpooling app in Egypt that connects drivers and passengers through ride discovery, booking, and safer shared commuting flows.',
        fullDescription: 'SAWA is a public carpooling product designed around affordable, sustainable daily movement. Mahmoud contributed to feature delivery, ride-booking flows, UI refinement, and practical collaboration with stakeholders in an active production codebase.',
        images: [],
        stack: ['Flutter', 'Bloc / Cubit', 'REST APIs', 'Maps & Location', 'Firebase'],
        tags: [
            { name: 'Social & Lifestyle' },
            { name: 'Android' },
            { name: 'iOS' }
        ],
        contributors: [],
        contextHighlights: [
            'Public Android and iOS release centered on cost-effective and sustainable commuting in Egypt.',
            'Store listings mention ride offers, booking requests, in-app messaging, recurring rides, and ratings.'
        ],
        contributionHighlights: [
            'Contributed to cross-platform feature delivery in a production Flutter codebase.',
            'Supported UI refinement and user-experience improvements across ongoing releases.',
            'Worked with stakeholders to help keep delivery aligned and on schedule.'
        ],
        repoLink: '',
        liveLink: 'https://apps.apple.com/eg/app/sawa/id1645381223',
        downloadLink: 'https://play.google.com/store/apps/details?id=com.fusion.sawa',
        stats: getStats('sawa'),
        listing: 3
    },
    {
        id: 'wird',
        name: 'Wird',
        title: 'Wird',
        role: 'Mobile Developer',
        category: 'Social & Lifestyle',
        platforms: ['Android', 'iOS'],
        description: 'Islamic companion app that combines Quran reading, adhkar, prayer times, Qibla, recitations, widgets, and reminders in one mobile experience.',
        fullDescription: 'Wird is a content-rich Islamic companion app that blends Quran reading, daily supplications, prayer tools, widgets, and reminder flows into one mobile product. It reflects Mahmoud\'s experience delivering utility-heavy interfaces with many daily-use entry points.',
        images: [],
        stack: ['Flutter', 'Provider / Riverpod', 'Local Storage', 'Firebase'],
        tags: [
            { name: 'Social & Lifestyle' },
            { name: 'Utility' },
            { name: 'Android' },
            { name: 'iOS' }
        ],
        contributors: [],
        contextHighlights: [
            'Public Android and iOS release combining Quran, supplications, prayer tools, and Islamic audio content.',
            'Store listings mention widgets, notifications, progress saving, shortcuts, and verse sharing flows.'
        ],
        contributionHighlights: [
            'Listed in the CV as part of Mahmoud\'s public mobile release experience.',
            'Public store presence shows a content-rich utility app with multiple daily-use flows inside one product.'
        ],
        repoLink: '',
        liveLink: 'https://apps.apple.com/eg/app/wird-%D9%88-%D8%B1%D8%AF/id6759871577',
        downloadLink: 'https://play.google.com/store/apps/details?id=com.quran.wird',
        stats: getStats('wird'),
        listing: 4
    },
    {
        id: 'kumquaty',
        name: 'Kumquaty',
        title: 'Kumquaty',
        role: 'Mobile Developer',
        category: 'Social & Lifestyle',
        platforms: ['Android', 'iOS'],
        description: 'Grocery shopping app built around fresh fruits, vegetables, and farm-sourced produce ordering with delivery convenience.',
        fullDescription: 'Kumquaty is a commerce-style grocery experience centered on local produce, browsing, ordering, and delivery convenience. It highlights Mahmoud\'s product work in e-commerce-style UX, operational ordering flows, and polished cross-platform delivery.',
        images: [],
        stack: ['Flutter', 'Clean Architecture', 'REST APIs', 'Firebase', 'Local Storage'],
        tags: [
            { name: 'Social & Lifestyle' },
            { name: 'E-commerce' },
            { name: 'Android' },
            { name: 'iOS' }
        ],
        contributors: [],
        contextHighlights: [
            'Public Android and iOS release focused on produce shopping and delivery.',
            'Store listings emphasize fresh local products, browsing, ordering, delivery, and product transparency.'
        ],
        contributionHighlights: [
            'Listed in the CV as part of Mahmoud\'s social and lifestyle app work.',
            'Public store presence reflects product work in ordering and commerce-style mobile UX.'
        ],
        repoLink: '',
        liveLink: 'https://apps.apple.com/eg/app/kumquaty/id6471918075',
        downloadLink: 'https://play.google.com/store/apps/details?id=com.kian.kumquatyUser',
        stats: getStats('kumquaty'),
        listing: 5
    },
    {
        id: 'sadakat',
        name: 'Sadakat',
        title: 'Sadakat',
        role: 'Mobile Developer',
        category: 'Social & Lifestyle',
        platforms: ['Android'],
        description: 'Islamic lifestyle app centered on prayer times, adhkar, supplications, and tasbeeh in a lightweight Android experience.',
        fullDescription: 'Sadakat is a lightweight Android lifestyle utility focused on daily Islamic reminders, prayer-time awareness, adhkar, and digital tasbeeh. It demonstrates Mahmoud\'s experience with focused utility products that prioritize recurring use and clarity.',
        images: [],
        stack: ['Flutter', 'Local Storage', 'Firebase'],
        tags: [
            { name: 'Social & Lifestyle' },
            { name: 'Utility' },
            { name: 'Android' }
        ],
        contributors: [],
        contextHighlights: [
            'Public Android release focused on daily Islamic reminders and prayer-time awareness.',
            'Store listing mentions prayer times by place, morning and evening adhkar, and digital tasbeeh.'
        ],
        contributionHighlights: [
            'Listed in the CV as part of Mahmoud\'s public Android release work.',
            'Represents public utility-style mobile delivery in the lifestyle space.'
        ],
        repoLink: '',
        liveLink: '',
        downloadLink: 'https://play.google.com/store/apps/details?id=sa.aait.aspbranch.hassanat',
        stats: getStats('sadakat'),
        listing: 6
    },
    {
        id: 'engineering-tracks',
        name: 'Engineering Tracks',
        title: 'Engineering Tracks',
        role: 'Mobile Developer',
        category: 'Education & Utilities',
        platforms: ['Android', 'iOS'],
        description: 'Engineering education and training app for an Egyptian-Saudi academy offering courses, online learning, and professional development content.',
        fullDescription: 'Engineering Tracks is an education-focused product built around structured learning, quizzes, training content, and ongoing professional development. It reflects Mahmoud\'s experience in content-led mobile delivery and dependable product execution for active educational platforms.',
        images: [],
        stack: ['Flutter', 'Clean Architecture', 'REST APIs', 'Firebase'],
        tags: [
            { name: 'Education & Utilities' },
            { name: 'Android' },
            { name: 'iOS' }
        ],
        contributors: [],
        contextHighlights: [
            'Public Android and iOS release for engineering training, online courses, and academic-to-market skill development.',
            'Store listings position the app around e-learning, quizzes, consultancy-driven learning, and course access.'
        ],
        contributionHighlights: [
            'Built and maintained production mobile functionality across Android and iOS.',
            'Contributed to feature delivery, interface polish, and overall application quality.',
            'Supported dependable execution across collaborative team and client requirements.'
        ],
        repoLink: '',
        liveLink: 'https://apps.apple.com/eg/app/engineering-tracks/id1543736435',
        downloadLink: 'https://play.google.com/store/apps/details?id=com.phonegap.engTracks',
        stats: getStats('engineering-tracks'),
        listing: 7
    },
    {
        id: 'a-plus',
        name: 'A-Plus',
        title: 'A-Plus',
        role: 'Mobile Developer',
        category: 'Education & Utilities',
        platforms: ['Android', 'iOS'],
        description: 'Online learning app delivering courses and lectures across multiple study areas through a mobile-first education experience.',
        fullDescription: 'A-Plus is a mobile-first learning product that packages course libraries, lectures, and teacher-led study content into a streamlined education experience. It adds another store-backed education release to Mahmoud\'s portfolio and reinforces his strength in content-led mobile UX.',
        images: [],
        stack: ['Flutter', 'Provider / Riverpod', 'REST APIs', 'Local Storage'],
        tags: [
            { name: 'Education & Utilities' },
            { name: 'Android' },
            { name: 'iOS' }
        ],
        contributors: [],
        contextHighlights: [
            'Public Android and iOS release for online learning and lecture access.',
            'Store listings highlight course libraries, lecture access, teacher-led study content, and mobile learning convenience.'
        ],
        contributionHighlights: [
            'Listed in the CV as part of Mahmoud\'s education-focused product work.',
            'Public store presence reflects experience with content-led education applications.'
        ],
        repoLink: '',
        liveLink: 'https://apps.apple.com/eg/app/a-plus/id1543956025',
        downloadLink: 'https://play.google.com/store/apps/details?id=com.sellx.aplus_student',
        stats: getStats('a-plus'),
        listing: 8
    },
    {
        id: 'maktabi-plus',
        name: 'Maktabi Plus',
        title: 'Maktabi Plus',
        role: 'Mobile Developer',
        category: 'Education & Utilities',
        platforms: ['Mobile'],
        description: 'Education and utility project listed in the CV as part of Mahmoud\'s broader product work.',
        fullDescription: 'Maktabi Plus appears in Mahmoud\'s CV as part of his broader education and utility project experience. It helps complete the picture of his work across learning-focused products beyond the public listings that appear on stores.',
        images: [],
        stack: ['Flutter', 'Clean Architecture', 'REST APIs'],
        tags: [
            { name: 'Education & Utilities' },
            { name: 'CV-listed' }
        ],
        contributors: [],
        contextHighlights: [
            'Listed in the CV under education and utility work.',
            'No verified public store listing has been added to the portfolio yet.'
        ],
        contributionHighlights: [
            'Included in the CV as part of Mahmoud\'s broader education and utility app work.'
        ],
        repoLink: '',
        liveLink: '',
        stats: getStats('maktabi-plus'),
        listing: 9
    },
    {
        id: 'teksa',
        name: 'Teksa',
        title: 'Teksa',
        role: 'Mobile Developer',
        category: 'Other',
        platforms: ['Android', 'iOS'],
        description: 'Business services app for a Saudi IT company offering web design, app development, hosting, and programming services through mobile.',
        fullDescription: 'Teksa is a business-services mobile app aimed at presenting web, app, hosting, and programming services through a polished customer-facing experience. It reflects Mahmoud\'s ability to adapt Flutter delivery to service-oriented businesses and B2B-flavored product messaging.',
        images: [],
        stack: ['Flutter', 'REST APIs', 'Firebase'],
        tags: [
            { name: 'Other' },
            { name: 'Business Services' },
            { name: 'Android' },
            { name: 'iOS' }
        ],
        contributors: [],
        contextHighlights: [
            'Public Android and iOS release for a business offering digital presence and software services.',
            'Store listings cover web design, app development, hosting, programming, and API-related solution delivery.'
        ],
        contributionHighlights: [
            'Helped deliver a production-ready mobile experience across both major platforms.',
            'Applied practical Flutter development skills across feature work and release preparation.',
            'Supported polished execution in collaboration with product stakeholders.'
        ],
        repoLink: '',
        liveLink: 'https://apps.apple.com/eg/app/teksa/id6483865247',
        downloadLink: 'https://play.google.com/store/apps/details?id=com.Teksa.teksa',
        stats: getStats('teksa'),
        listing: 10
    },
    {
        id: 'gene',
        name: 'GENE',
        title: 'GENE',
        role: 'Mobile Developer',
        category: 'Other',
        platforms: ['iOS'],
        description: 'iOS booking app designed around theatre discovery, show schedules, interactive seat selection, and secure payment flows.',
        fullDescription: 'GENE is an iOS-first booking experience built around theatre discovery, schedules, seat maps, and secure transactions. It showcases Mahmoud\'s work on transaction-heavy flows and detail-sensitive product experiences in booking-oriented interfaces.',
        images: [],
        stack: ['Flutter', 'Clean Architecture', 'REST APIs', 'Local Storage'],
        tags: [
            { name: 'Other' },
            { name: 'iOS' },
            { name: 'Booking' }
        ],
        contributors: [],
        contextHighlights: [
            'Public iOS release focused on a theatre-style booking experience.',
            'Store listing highlights show browsing, schedule details, seat maps, and secure online payments.'
        ],
        contributionHighlights: [
            'Listed in the CV as part of Mahmoud\'s public iOS release experience.',
            'Represents iOS-facing product work in booking and transaction-heavy user journeys.'
        ],
        repoLink: '',
        liveLink: 'https://apps.apple.com/iq/app/gene/id6743855109?l=ar',
        stats: getStats('gene'),
        listing: 11
    },
    {
        id: 'shahia',
        name: 'Shahia',
        title: 'Shahia',
        role: 'Mobile Developer',
        category: 'Other',
        platforms: ['iOS'],
        description: 'iOS shopping app for Shahia\'s frozen meat and vegetable product catalog, presented as a retail ordering experience.',
        fullDescription: 'Shahia is a commerce-oriented iOS app focused on frozen food browsing and retail ordering. It rounds out Mahmoud\'s public release experience with product-delivery work in shopping and catalog-heavy mobile flows.',
        images: [],
        stack: ['Flutter', 'REST APIs', 'Local Storage'],
        tags: [
            { name: 'Other' },
            { name: 'iOS' },
            { name: 'Retail' }
        ],
        contributors: [],
        contextHighlights: [
            'Public iOS release focused on retail shopping for Shahia frozen food products.',
            'Store listing identifies the app as a shopping experience around meat and frozen vegetable offerings.'
        ],
        contributionHighlights: [
            'Listed in the CV as part of Mahmoud\'s public iOS release experience.',
            'Represents product delivery work in a commerce-oriented mobile flow.'
        ],
        repoLink: '',
        liveLink: 'https://apps.apple.com/iq/app/%D8%B4%D9%87%D9%8A%D8%A9/id6744401579?l=ar',
        stats: getStats('shahia'),
        listing: 12
    }
];
