export const translations = {
  es: {
    bootup: {
      initializing: "Inicializando kernel HUD...",
      loading: "Cargando subsistemas...",
      mounting: "Montando módulos de misión...",
      allocating: "Asignando buffers de renderizado...",
      neural: "Estableciendo enlace neural...",
      granted: "Acceso concedido.",
      start: "INICIAR SISTEMA",
      title: "G-DARKO OS",
      welcomeTitle: "Sistema en línea",
      welcomeHint: "Selecciona un módulo del sistema para iniciar el enlace neural.",
      typewriterRoles: [
        "Desarrollador de Software y Web",
        "Ingeniero en Tecnologías de la Información",
        "Constructor de SaaS y experiencias móviles",
        "Arquitecto de sistemas G-Darko",
      ],
    },
    header: {
      title: "G-DARKO",
      subtitle: "SISTEMA HUD v3.0",
      logout: "Reiniciar sistema",
      terminal: "Terminal",
      sphere: "Stack 3D",
      minigame: "Defensa G-Core",
      cv: "CV",
      github: "GitHub",
      secrets: "secretos",
      completion: "COMPLETADO",
      profile: "Perfil",
      missions: "Misiones",
      skills: "Habilidades",
      certifications: "Certificaciones",
      contact: "Contacto",
    },
    profile: {
      name: "Gael Uribe",
      role: "Desarrollador de Software y Web",
      about:
        "Ingeniero en Tecnologías de la Información. Apasionado por el desarrollo web y de software. Me encanta aprender nuevas tecnologías y mejorar mis habilidades en programación. Me considero una persona analítica y siempre dispuesta a enfrentar nuevos desafíos. Destaco por mi capacidad de adaptación, aprendizaje rápido y enfoque en la eficiencia.",
      viewCv: "Ver CV",
      contact: "Contacto",
    },
    experience: {
      title: "Experiencia",
      leamsiTitle: "Desarrollador Freelance — LEAMSI",
      leamsiDate: "Julio 2025 - Agosto 2025",
      leamsiDesc:
        "Desarrollo de una página web corporativa para una contaduría utilizando Astro y Tailwind CSS. Responsable de la arquitectura front-end y la optimización de rendimiento.",
    },
    projects: {
      title: "Proyectos",
      aerial: {
        title: "Sistema de Inventarios | AERIAL DEPOT",
        tag: "Educación Dual",
        desc: "Aplicación web desarrollada con Laravel, Vue.js y MySQL, incluye visualización 3D del almacén mediante Three.js para facilitar la localización de productos.",
      },
      tienko: {
        title: "Gestor de Ventas | Tienko",
        tag: "",
        desc: "Sistema completo con registro de productos, ventas y reportes, desarrollado en Java con base de datos MySQL.",
      },
      postgrados: {
        title: "Página de Postgrados | UPVM",
        tag: "Estancia I",
        desc: "Sitio web informativo para los aspirantes y estudiantes de postgrados de la UPVM, desarrollada con HTML, CSS, JS, PHP y MySQL.",
      },
      yiza: {
        title: "YIZA | CECyTEM Tultitlán",
        tag: "Educación Dual",
        desc: "E-Commerce simulado con propia base de datos, manual de usuario y panel de control. Desarrollado con HTML, PHP, JavaScript y CSS puro.",
      },
      viewMore: "Ver más",
      repo: "Repositorio",
      live: "Ver en vivo",
    },
    skills: {
      title: "Habilidades",
      frontend: "Frontend",
      backend: "Backend",
      databases: "Bases de datos",
      environment: "Entorno",
      mobile: "Mobile",
      graphics: "3D / Audio",
      learning: "Aprendiendo",
    },
    certifications: {
      title: "Certificaciones",
      jsEssentials: {
        title: "JavaScript Essentials 1",
        org: "Cisco - Netacad",
        date: "Julio 2025",
        link: "Ver insignia en Credly",
      },
      conocer: {
        title: "Desarrollo de Código de Software",
        org: "CONOCER - EC0160",
        date: "Septiembre 2022",
        folio: "Folio para validar: 16955622",
        link: "Validar en RENAP",
      },
    },
    contact: {
      title: "Contacto",
      desc: "Si desea contactarme, puede mandar un correo por medio de este formulario.",
      email: "Correo electrónico",
      message: "Mensaje",
      send: "Enviar",
      sending: "Enviando…",
      success: "Mensaje enviado correctamente.",
      error: "No se pudo enviar. Intenta de nuevo.",
      phone: "Teléfono",
      portfolio: "Portafolio",
    },
    terminal: {
      title: "TERMINAL",
      subtitle: "Interfaz de Comandos HUD",
      help: [
        "Comandos disponibles:",
        "  about       — resumen breve",
        "  stack       — lista de tecnologías",
        "  cv          — abrir CV",
        "  github      — abrir GitHub",
        "  progress    — progreso actual",
        "  missions    — listar operaciones",
        "  mission     — abrir misión (ej: mission freelance)",
        "  brief       — briefing sub-misión (ej: brief leamsi)",
        "  knights     — ???",
        "  hack        — ???",
        "  logout      — reiniciar sistema HUD",
        "  restart     — reiniciar sistema HUD",
        "  clear       — limpiar terminal",
      ],
      about:
        "G-Darko — Ingeniero en Tecnologías de la Información. Next.js | React Native | Laravel | Linux. Construyendo SaaS y experiencias móviles.",
      stack:
        "Next.js, React Native, Expo, Astro, Vue, Laravel, Tailwind, Three.js, PostgreSQL, MySQL, Firebird, Linux, Docker.",
      cv: "Abriendo CV... ⌘",
      github: "https://github.com/G-Darko",
      progress: "Calculando...",
      hack: "Acceso concedido. Subsistema secreto habilitado.",
      logout: "Reiniciando sistema...",
      notFound: 'Comando no encontrado: "{cmd}". Escribe \'help\' para la lista.',
    },
    minigame: {
      title: "DEFENSA G-CORE",
      subtitle: "Sistema de defensa del núcleo",
      start: "INICIAR DEFENSA",
      lives: "Vidas",
      score: "Puntuación",
      level: "Nivel",
      gameOver: "SISTEMA COMPROMETIDO",
      victory: "SISTEMA SEGURO — SECRETO DESBLOQUEADO",
      retry: "Reintentar",
      instructions:
        "Los drones enemigos atacan el reactor. Clickea para destruirlos antes de que lleguen al centro.",
    },
    missionsUI: {
      mapTitle: "Mapa de operaciones",
      briefing: "Briefing de misión",
      objectives: "Objetivos",
      progress: "Progreso",
      back: "Volver",
      backToMap: "Volver al mapa",
      completeBrief: "Briefing completo",
      operationComplete: "OPERACIÓN COMPLETA",
      rank: "RANK",
      repo: "Repositorio",
      live: "Ver en vivo",
      mockup: "MOCKUP",
      completed: "Completado",
      available: "Disponible",
      subMissions: "submisiones",
      selectMission: "Selecciona una operación del mapa",
    },
    missionsData: {
      orgs: {
        blackSheepOrg: "Black Sheep Lab — SaaS e Innovación",
        freelanceOrg: "LEAMSI — Soluciones Contables",
        academiaOrg: "UPVM / CECyTEM Tultitlán",
      },
      roles: {
        freelanceRole: "Desarrollador Freelance",
      },
      contextTags: {
        dualEducation: "Educación Dual",
        internshipI: "Estancia I",
      },
      missions: {
        blackSheep: {
          title: "Black Sheep Lab",
          codename: "OPERACIÓN: SAAS",
          description:
            "Innovación en tecnología educativa, comunidad empresarial y aplicaciones móviles con IA y gamificación.",
        },
        freelance: {
          title: "Freelance",
          codename: "OPERACIÓN: CONTRATO",
          description:
            "Desarrollo de soluciones web corporativas con enfoque en rendimiento y diseño adaptado a cada cliente.",
        },
        academia: {
          title: "Academia / Estadías",
          codename: "OPERACIÓN: BOOTCAMP",
          description:
            "Proyectos de desarrollo durante la educación dual y estancias profesionales. De la universidad a producción real.",
        },
      },
      subMissions: {
        lmsSkool: {
          title: "LMS Skool",
          tagline: "Plataforma educativa SaaS",
          description:
            "Plataforma LMS desarrollada en Next.js con integraciones visuales e interactivas. Permite la gestión de cursos, estudiantes y contenido multimedia en tiempo real.",
        },
        duplicaApp: {
          title: "Duplica App",
          tagline: "App móvil con IA y gamificación",
          description:
            "Mobile App en Expo/React Native con IA para generación de promociones, gamificación de diamantes y experiencia, retos diarios y comunidad. Publicada en Play Store.",
        },
        rnmeHub: {
          title: "RNME Hub",
          tagline: "Comunidad empresarial",
          description:
            "Landing page y comunidad tipo Facebook para empresarios con Rich Text Editor para blogs. Desarrollada en Next.js con sistema de publicaciones y perfiles.",
        },
        leamsi: {
          title: "Página Corporativa LEAMSI",
          tagline: "Web corporativa para contaduría",
          description:
            "Desarrollo de una página web corporativa para una contaduría utilizando Astro y Tailwind CSS. Responsable de la arquitectura front-end y la optimización de rendimiento.",
        },
        aerialDepot: {
          title: "Sistema de Inventarios | AERIAL DEPOT",
          tagline: "Visualización 3D del almacén",
          description:
            "Aplicación web desarrollada con Laravel, Vue.js y MySQL, incluye visualización 3D del almacén mediante Three.js para facilitar la localización de productos.",
        },
        tienko: {
          title: "Gestor de Ventas | Tienko",
          tagline: "Sistema de ventas con Java",
          description:
            "Sistema completo con registro de productos, ventas y reportes, desarrollado en Java con base de datos MySQL.",
        },
        postgradosUpvm: {
          title: "Página de Postgrados | UPVM",
          tagline: "Sitio web institucional",
          description:
            "Sitio web informativo para los aspirantes y estudiantes de postgrados de la UPVM, desarrollada con HTML, CSS, JS, PHP y MySQL.",
        },
        yiza: {
          title: "YIZA | CECyTEM Tultitlán",
          tagline: "E-Commerce educativo",
          description:
            "E-Commerce simulado con propia base de datos, manual de usuario y panel de control. Desarrollado con HTML, PHP, JavaScript y CSS puro.",
        },
      },
    },
    missions: {
      blackSheep: {
        title: "Black Sheep Lab",
        codename: "OPERACIÓN: SAAS",
        desc: "Innovación en tecnología educativa, comunidad empresarial y aplicaciones móviles con IA y gamificación.",
      },
      freelance: {
        title: "Freelance",
        codename: "OPERACIÓN: CONTRATO",
        desc: "Desarrollo de soluciones web corporativas con enfoque en rendimiento y diseño adaptado a cada cliente.",
      },
      academia: {
        title: "Academia / Estadías",
        codename: "OPERACIÓN: BOOTCAMP",
        desc: "Proyectos de desarrollo durante la educación dual y estancias profesionales. De la universidad a producción real.",
      },
    },
  },
  en: {
    bootup: {
      initializing: "Initializing HUD kernel...",
      loading: "Loading subsystems...",
      mounting: "Mounting mission modules...",
      allocating: "Allocating render buffers...",
      neural: "Establishing neural link...",
      granted: "Access granted.",
      start: "START SYSTEM",
      title: "G-DARKO OS",
      welcomeTitle: "System online",
      welcomeHint: "Select a system module to initiate the neural link.",
      typewriterRoles: [
        "Software and Web Developer",
        "Information Technology Engineer",
        "SaaS and mobile experience builder",
        "G-Darko systems architect",
      ],
    },
    header: {
      title: "G-DARKO",
      subtitle: "HUD SYSTEM v3.0",
      logout: "Restart system",
      terminal: "Terminal",
      sphere: "Stack 3D",
      minigame: "Defensa G-Core",
      cv: "CV",
      github: "GitHub",
      secrets: "secrets",
      completion: "COMPLETION",
      profile: "Profile",
      missions: "Missions",
      skills: "Skills",
      certifications: "Certifications",
      contact: "Contact",
    },
    profile: {
      name: "Gael Uribe",
      role: "Software and Web Developer",
      about:
        "Information Technology Engineer. Passionate about web and software development. I love learning new technologies and improving my programming skills. I consider myself an analytical person always willing to face new challenges. I stand out for my adaptability, fast learning, and focus on efficiency.",
      viewCv: "View CV",
      contact: "Contact",
    },
    experience: {
      title: "Experience",
      leamsiTitle: "Freelance Developer — LEAMSI",
      leamsiDate: "July 2025 - August 2025",
      leamsiDesc:
        "Development of a corporate website for an accounting firm using Astro and Tailwind CSS. Responsible for front-end architecture and performance optimization.",
    },
    projects: {
      title: "Projects",
      aerial: {
        title: "Inventory System | AERIAL DEPOT",
        tag: "Dual Education",
        desc: "Web application developed with Laravel, Vue.js and MySQL, includes 3D warehouse visualization using Three.js to facilitate product location.",
      },
      tienko: {
        title: "Sales Manager | Tienko",
        tag: "",
        desc: "Complete system with product registration, sales and reports, developed in Java with MySQL database.",
      },
      postgrados: {
        title: "Postgraduates Page | UPVM",
        tag: "Internship I",
        desc: "Informational website for UPVM postgraduate applicants and students, developed with HTML, CSS, JS, PHP and MySQL.",
      },
      yiza: {
        title: "YIZA | CECyTEM Tultitlán",
        tag: "Dual Education",
        desc: "Simulated E-Commerce with its own database, user manual and control panel. Developed with HTML, PHP, JavaScript and pure CSS.",
      },
      viewMore: "View more",
      repo: "Repository",
      live: "View live",
    },
    skills: {
      title: "Skills",
      frontend: "Frontend",
      backend: "Backend",
      databases: "Databases",
      environment: "Environment",
      mobile: "Mobile",
      graphics: "3D / Audio",
      learning: "Learning",
    },
    certifications: {
      title: "Certifications",
      jsEssentials: {
        title: "JavaScript Essentials 1",
        org: "Cisco - Netacad",
        date: "July 2025",
        link: "View badge on Credly",
      },
      conocer: {
        title: "Software Code Development",
        org: "CONOCER - EC0160",
        date: "September 2022",
        folio: "Validation folio: 16955622",
        link: "Validate on RENAP",
      },
    },
    contact: {
      title: "Contact",
      desc: "If you want to contact me, you can send an email through this form.",
      email: "Email address",
      message: "Message",
      send: "Send",
      sending: "Sending…",
      success: "Message sent successfully.",
      error: "Could not send. Please try again.",
      phone: "Phone",
      portfolio: "Portfolio",
    },
    terminal: {
      title: "TERMINAL",
      subtitle: "HUD Command Interface",
      help: [
        "Available commands:",
        "  about       — brief summary",
        "  stack       — tech stack list",
        "  cv          — open CV",
        "  github      — open GitHub",
        "  progress    — current completion",
        "  missions    — list operations",
        "  mission     — open mission (e.g. mission freelance)",
        "  brief       — sub-mission briefing (e.g. brief leamsi)",
        "  knights     — ???",
        "  hack        — ???",
        "  logout      — restart HUD system",
        "  restart     — restart HUD system",
        "  clear       — clear terminal",
      ],
      about:
        "G-Darko — Information Technology Engineer. Next.js | React Native | Laravel | Linux. Building SaaS and mobile experiences.",
      stack:
        "Next.js, React Native, Expo, Astro, Vue, Laravel, Tailwind, Three.js, PostgreSQL, MySQL, Firebird, Linux, Docker.",
      cv: "Opening CV... ⌘",
      github: "https://github.com/G-Darko",
      progress: "Calculating...",
      hack: "Access granted. Secret subsystem enabled.",
      logout: "Restarting system...",
      notFound: 'Command not found: "{cmd}". Type \'help\' for list.',
    },
    minigame: {
      title: "G-CORE DEFENSE",
      subtitle: "Core defense system",
      start: "START DEFENSE",
      lives: "Lives",
      score: "Score",
      level: "Level",
      gameOver: "SYSTEM COMPROMISED",
      victory: "SYSTEM SECURE — SECRET UNLOCKED",
      retry: "Retry",
      instructions:
        "Enemy drones are attacking the reactor. Click to destroy them before they reach the center.",
    },
    missionsUI: {
      mapTitle: "Operations map",
      briefing: "Mission briefing",
      objectives: "Objectives",
      progress: "Progress",
      back: "Back",
      backToMap: "Back to map",
      completeBrief: "Complete briefing",
      operationComplete: "OPERATION COMPLETE",
      rank: "RANK",
      repo: "Repository",
      live: "View live",
      mockup: "MOCKUP",
      completed: "Completed",
      available: "Available",
      subMissions: "sub-missions",
      selectMission: "Select an operation from the map",
    },
    missionsData: {
      orgs: {
        blackSheepOrg: "Black Sheep Lab — SaaS & Innovation",
        freelanceOrg: "LEAMSI — Accounting Solutions",
        academiaOrg: "UPVM / CECyTEM Tultitlán",
      },
      roles: {
        freelanceRole: "Freelance Developer",
      },
      contextTags: {
        dualEducation: "Dual Education",
        internshipI: "Internship I",
      },
      missions: {
        blackSheep: {
          title: "Black Sheep Lab",
          codename: "OPERATION: SAAS",
          description:
            "Innovation in educational technology, business community and mobile applications with AI and gamification.",
        },
        freelance: {
          title: "Freelance",
          codename: "OPERATION: CONTRACT",
          description:
            "Development of corporate web solutions with a focus on performance and design tailored to each client.",
        },
        academia: {
          title: "Academia / Internships",
          codename: "OPERATION: BOOTCAMP",
          description:
            "Development projects during dual education and professional internships. From university to real production.",
        },
      },
      subMissions: {
        lmsSkool: {
          title: "LMS Skool",
          tagline: "SaaS educational platform",
          description:
            "LMS platform built with Next.js and visual interactive integrations. Manages courses, students and multimedia content in real time.",
        },
        duplicaApp: {
          title: "Duplica App",
          tagline: "Mobile app with AI and gamification",
          description:
            "Expo/React Native mobile app with AI for promotions, diamond/experience gamification, daily challenges and community. Published on Play Store.",
        },
        rnmeHub: {
          title: "RNME Hub",
          tagline: "Business community",
          description:
            "Landing page and Facebook-style community for entrepreneurs with Rich Text Editor for blogs. Built with Next.js.",
        },
        leamsi: {
          title: "LEAMSI Corporate Website",
          tagline: "Corporate website for accounting firm",
          description:
            "Corporate website for an accounting firm using Astro and Tailwind CSS. Responsible for front-end architecture and performance optimization.",
        },
        aerialDepot: {
          title: "Inventory System | AERIAL DEPOT",
          tagline: "3D warehouse visualization",
          description:
            "Web application with Laravel, Vue.js and MySQL, includes 3D warehouse visualization using Three.js to facilitate product location.",
        },
        tienko: {
          title: "Sales Manager | Tienko",
          tagline: "Java sales system",
          description:
            "Complete system with product registration, sales and reports, developed in Java with MySQL database.",
        },
        postgradosUpvm: {
          title: "Postgraduates Page | UPVM",
          tagline: "Institutional website",
          description:
            "Informational website for UPVM postgraduate applicants and students, developed with HTML, CSS, JS, PHP and MySQL.",
        },
        yiza: {
          title: "YIZA | CECyTEM Tultitlán",
          tagline: "Educational E-Commerce",
          description:
            "Simulated E-Commerce with its own database, user manual and control panel. Developed with HTML, PHP, JavaScript and pure CSS.",
        },
      },
    },
    missions: {
      blackSheep: {
        title: "Black Sheep Lab",
        codename: "OPERATION: SAAS",
        desc: "Innovation in educational technology, business community and mobile applications with AI and gamification.",
      },
      freelance: {
        title: "Freelance",
        codename: "OPERATION: CONTRACT",
        desc: "Development of corporate web solutions with a focus on performance and design tailored to each client.",
      },
      academia: {
        title: "Academia / Internships",
        codename: "OPERATION: BOOTCAMP",
        desc: "Development projects during dual education and professional internships. From university to real production.",
      },
    },
  },
} as const;

export type Translations = typeof translations;
export type Locale = keyof Translations;
