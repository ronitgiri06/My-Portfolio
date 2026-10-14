import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  signal,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// ============================================================================
// TYPES
// ============================================================================
interface NavLink {
  label: string;
  href: string;
}

interface Skill {
  name: string;
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  description: string;
}

interface Certificate {
  emoji: string;
  title: string;
  issuer: string;
  date: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string;
  image: string;
  github: string;
  live: string;
  hasLiveDemo?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChildren('skillCard') skillCards?: QueryList<ElementRef<HTMLDivElement>>;

  readonly mobileMenuOpen = signal(false);
  readonly currentYear = new Date().getFullYear();

  private tiltX = 0;
  private tiltY = 0;
  private observer?: IntersectionObserver;
  private skillObserver?: IntersectionObserver;
  private threeJsInstance?: any;
  private animationFrame?: number;
  private isBrowser: boolean;

  // Navigation
  readonly navLinks: NavLink[] = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  // Skills Data
  readonly skillCategories: SkillCategory[] = [
    {
      name: 'Front End',
      icon: 'fa-brands fa-angular',
      skills: [
        { name: 'Angular' },
        { name: 'TypeScript' },
        { name: 'HTML5 / CSS3' },
        { name: 'RxJS' },
      ],
    },
    {
      name: 'Back End',
      icon: 'fa-solid fa-server',
      skills: [
        { name: 'Java' },
        { name: 'Spring Boot' },
        { name: 'REST APIs' },
        { name: 'Spring Security' },
      ],
    },
    {
      name: 'Database',
      icon: 'fa-solid fa-database',
      skills: [
        { name: 'MySQL' },
        { name: 'JPA / Hibernate' },
        { name: 'Query Optimization' },
      ],
    },
    {
      name: 'Tools & Workflow',
      icon: 'fa-solid fa-toolbox',
      skills: [
        { name: 'Git & GitHub' },
        { name: 'Postman' },
        { name: 'VS Code / IntelliJ' },
      ],
    },
  ];

  // Education Data
  readonly education: EducationItem[] = [
    {
      period: '2023 — 2026',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'IGNOU',
      description:
        'Focused on core programming, data structures, databases, and web application development.',
    },
    {
      period: 'September 2025 — April 2026',
      degree: 'Java Full Stack Development',
      institution: 'Om institute of technology',
      description:
        'Angular, Spring Boot, MySQL, and REST API design through project-based learning.',
    },
  ];

  // Certificates Data
  readonly certificates: Certificate[] = [
    { emoji: '📜', title: 'Java Full Stack Development', issuer: 'Training Program', date: '2026' },
  ];

  // Projects Data
  readonly projects: Project[] = [
    {
      id: 1,
      title: 'Conference Room Booking System',
      description:
        'A full-stack application for managing conference room bookings with real-time availability, scheduling, and conflict resolution.',
      tech: 'Angular • Spring Boot • MySQL',
      image: 'project1.png',
      github: 'https://github.com/ronitgiri06/roompilot.git',
      live: 'https://example.com/',
      hasLiveDemo: false,
    },
    {
      id: 2,
      title: 'Portfolio Website',
      description:
        'My personal portfolio built with Angular, featuring a modern UI with glassmorphism, responsive design, and smooth animations.',
      tech: 'Angular • TypeScript • CSS',
      image: 'project2.png',
      github: 'https://github.com/ronitgiri06/My-Portfolio.git',
      live: 'https://ronit-portfolio0.netlify.app/',
      hasLiveDemo: true,
    },
    {
      id: 3,
      title: 'OIT landing page',
      description:
        'Developed a responsive landing page for OM Institute of Technology using Angular, TypeScript, and CSS. Implemented standalone components and Angular routing to create a modular structure and smooth page navigation.',
      tech: 'Angular • TypeScript • CSS',
      image: 'project3.png',
      github: 'https://github.com/ronitgiri06/oit.git',
      live: '',
      hasLiveDemo: false,
    },
  ];

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Initialize all features after DOM is ready
    setTimeout(() => {
      this.setupRevealObserver();
      this.setupSkillObserver();
      this.setupScrollProgress();
      this.setupCursorGlow();
      this.setupTypingEffect();
      this.setupCounterAnimation();
      this.initThreeJS();
      this.setupNavScrollEffect();
    }, 200);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.skillObserver?.disconnect();
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    // Clean up Three.js
    if (this.threeJsInstance) {
      const renderer = this.threeJsInstance.renderer;
      if (renderer) {
        renderer.dispose();
        const canvas = renderer.domElement;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    }
  }

  // ==========================================================================
  // MOBILE NAV
  // ==========================================================================
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  // ==========================================================================
  // HERO TILT EFFECT
  // ==========================================================================
  onHeroMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.tiltX = ((event.clientY - rect.top) / rect.height - 0.5) * -14;
    this.tiltY = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
  }

  resetHeroTilt(): void {
    this.tiltX = 0;
    this.tiltY = 0;
  }

  tiltStyle(multiplier: number): string {
    return `rotateX(${this.tiltX * multiplier}deg) rotateY(${this.tiltY * multiplier}deg)`;
  }

  // ==========================================================================
  // SCROLL REVEAL OBSERVER
  // ==========================================================================
  private setupRevealObserver(): void {
    if (typeof IntersectionObserver === 'undefined' || !this.isBrowser) return;

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    if (elements.length === 0) {
      setTimeout(() => {
        const retryElements = document.querySelectorAll('.reveal');
        retryElements.forEach((el) => this.observer?.observe(el));
      }, 500);
    } else {
      elements.forEach((el) => this.observer?.observe(el));
    }
  }

  private setupSkillObserver(): void {
    if (typeof IntersectionObserver === 'undefined' || !this.skillCards || !this.isBrowser) return;

    if (this.skillObserver) {
      this.skillObserver.disconnect();
    }

    this.skillObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.skillObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    this.skillCards.forEach((card) => {
      this.skillObserver?.observe(card.nativeElement);
    });
  }

  // ==========================================================================
  // SCROLL PROGRESS BAR
  // ==========================================================================
  private setupScrollProgress(): void {
    const progressBar = document.querySelector('.scroll-progress') as HTMLElement;
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    };

    window.addEventListener('scroll', updateProgress);
    // Initial update
    updateProgress();
  }

  // ==========================================================================
  // CURSOR GLOW
  // ==========================================================================
  private setupCursorGlow(): void {
    const glow = document.querySelector('.cursor-glow') as HTMLElement;
    if (!glow) return;

    const updateGlow = (e: MouseEvent) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    };

    document.addEventListener('mousemove', updateGlow);
  }

  // ==========================================================================
  // TYPING EFFECT
  // ==========================================================================
  private setupTypingEffect(): void {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const words = ['Java Full Stack', 'Spring Boot', 'Angular', 'TypeScript', 'MySQL'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const type = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          setTimeout(type, 500);
        }, 2000);
        return;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 300);
        return;
      }

      const speed = isDeleting ? 50 : 100;
      setTimeout(type, speed);
    };

    // Start typing after a delay
    setTimeout(type, 1000);
  }

  // ==========================================================================
  // COUNTER ANIMATION
  // ==========================================================================
  private setupCounterAnimation(): void {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const animateCounter = (element: Element) => {
      const target = parseInt(element.getAttribute('data-count') || '0');
      let current = 0;
      const increment = target / 40;
      const duration = 1500;
      const stepTime = duration / 40;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.round(current).toString();
          setTimeout(updateCounter, stepTime);
        } else {
          element.textContent = target.toString();
        }
      };

      updateCounter();
    };

    // Observe counters and animate when visible
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  // ==========================================================================
  // NAV SCROLL EFFECT
  // ==========================================================================
  private setupNavScrollEffect(): void {
    const nav = document.querySelector('.nav') as HTMLElement;
    if (!nav) return;

    const updateNav = () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', updateNav);
    updateNav();
  }

  // ==========================================================================
  // THREE.JS 3D BACKGROUND (with dynamic import to avoid errors)
  // ==========================================================================
  private async initThreeJS(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      // Dynamic import to avoid build errors if three.js is not installed
      const THREE = await import('three');
      
      const container = document.getElementById('three-canvas');
      if (!container) return;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 30;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // Store for cleanup
      this.threeJsInstance = { renderer, scene, camera };

      // Create floating geometric shapes
      const shapes: any[] = [];
      const geometries = [
        new THREE.TorusGeometry(0.8, 0.3, 16, 32),
        new THREE.IcosahedronGeometry(0.6, 1),
        new THREE.OctahedronGeometry(0.7),
        new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8),
      ];

      const colors = [0x46f5d6, 0x18e0c4, 0x00bfa6, 0x46f5d6];

      for (let i = 0; i < 30; i++) {
        const geo = geometries[i % geometries.length];
        const mat = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          wireframe: true,
          transparent: true,
          opacity: 0.15 + Math.random() * 0.25,
        });
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30 - 10
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        mesh.userData = {
          rotX: (Math.random() - 0.5) * 0.02,
          rotY: (Math.random() - 0.5) * 0.02,
          rotZ: (Math.random() - 0.5) * 0.02,
          floatSpeed: 0.2 + Math.random() * 0.3,
          floatAmplitude: 0.5 + Math.random() * 1,
          initialY: mesh.position.y,
        };

        scene.add(mesh);
        shapes.push(mesh);
      }

      // Animation loop
      let time = 0;
      const animate = () => {
        time += 0.01;

        // Rotate shapes
        for (const shape of shapes) {
          shape.rotation.x += shape.userData.rotX;
          shape.rotation.y += shape.userData.rotY;
          shape.rotation.z += shape.userData.rotZ;
          shape.position.y = shape.userData.initialY + Math.sin(time * shape.userData.floatSpeed) * shape.userData.floatAmplitude;
        }

        // Rotate camera slightly
        camera.position.x = Math.sin(time * 0.02) * 2;
        camera.position.y = Math.cos(time * 0.015) * 1;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        this.animationFrame = requestAnimationFrame(animate);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // Store for cleanup
      this.threeJsInstance.resizeHandler = handleResize;

    } catch (error) {
      // Three.js failed to load - silently continue without 3D background
      console.warn('Three.js not available, continuing without 3D background');
    }
  }
}