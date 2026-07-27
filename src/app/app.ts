import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface NavLink {
  label: string;
  href: string;
}

interface Skill {
  name: string;
  // level: number;
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
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('carouselTrack') carouselTrack?: ElementRef<HTMLDivElement>;
  @ViewChildren('skillCard') skillCards?: QueryList<ElementRef<HTMLDivElement>>;

  readonly mobileMenuOpen = signal(false);
  readonly currentYear = new Date().getFullYear();

  private tiltX = 0;
  private tiltY = 0;
  private observer?: IntersectionObserver;
  private skillObserver?: IntersectionObserver;

  // Contact Form using Reactive Forms
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  readonly navLinks: NavLink[] = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  readonly skillCategories: SkillCategory[] = [
    {
      name: 'Front End',
      icon: 'fa-brands fa-angular',
      skills: [
        { name: 'Angular'},
        { name: 'TypeScript'},
        { name: 'HTML5 / CSS3' },
        { name: 'RxJS'},
      ],
    },
    {
      name: 'Back End',
      icon: 'fa-solid fa-server',
      skills: [
        { name: 'Java'},
        { name: 'Spring Boot'},
        { name: 'REST APIs'},
        { name: 'Spring Security'},
      ],
    },
    {
      name: 'Database',
      icon: 'fa-solid fa-database',
      skills: [
        { name: 'MySQL'},
        { name: 'JPA / Hibernate'},
        { name: 'Query Optimization'},
      ],
    },
    {
      name: 'Tools & Workflow',
      icon: 'fa-solid fa-toolbox',
      skills: [
        { name: 'Git & GitHub'},
        { name: 'Postman'},
        { name: 'VS Code / IntelliJ'},
      ],
    },
  ];

  readonly education: EducationItem[] = [
    {
      period: '2023 — Present',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'IGNOU',
      description: 'Focused on core programming, data structures, databases, and web application development.',
    },
    {
      period: 'Late 2025 — Early 2026',
      degree: 'Java Full Stack Development',
      institution: 'Self-directed & guided training',
      description: 'Angular, Spring Boot, MySQL, and REST API design through project-based learning.',
    },
  ];

  readonly certificates: Certificate[] = [
    { emoji: '📜', title: 'Java Full Stack Development', issuer: 'Training Program', date: '2026' },
  ];

  readonly projects: Project[] = [
    {
      id: 1,
      title: 'Conference Room Booking System',
      description: 'A full-stack application for managing conference room bookings with real-time availability, scheduling, and conflict resolution.',
      tech: 'Angular • Spring Boot • MySQL',
      image: 'project1.png',
      github: 'https://github.com/',
      live: 'https://example.com/',
    },
    {
      id: 2,
      title: 'Portfolio Website',
      description: 'My personal portfolio built with Angular, featuring a modern UI with glassmorphism, responsive design, and smooth animations.',
      tech: 'Angular • TypeScript • CSS',
      image: 'project2.png',
      github: 'https://github.com/',
      live: 'https://example.com/',
    },
  ];

  // Submit contact form
  onSubmitContact(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      alert('Thank you for your message! I\'ll get back to you soon.');
      this.contactForm.reset();
    }
  }

  // Getter methods for form controls
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  ngAfterViewInit(): void {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      this.setupRevealObserver();
      this.setupSkillObserver();
    }, 100);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.skillObserver?.disconnect();
  }

  // ---------- Mobile nav ----------
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  // ---------- Hero parallax ----------
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

  // ---------- Projects carousel ----------
  scrollCarousel(direction: 1 | -1): void {
    const el = this.carouselTrack?.nativeElement;
    if (!el) return;
    const cardWidth = el.querySelector('.project-card')?.clientWidth ?? 400;
    el.scrollBy({ left: direction * (cardWidth + 26), behavior: 'smooth' });
  }

  // ---------- Scroll-triggered reveal animations ----------
  private setupRevealObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    // Disconnect existing observer if any
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Optionally unobserve after animation
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Get all elements with .reveal class
    const elements = document.querySelectorAll('.reveal');
    console.log('Found reveal elements:', elements.length);
    
    if (elements.length === 0) {
      // If no elements found, try again after a delay
      setTimeout(() => {
        const retryElements = document.querySelectorAll('.reveal');
        console.log('Retry found reveal elements:', retryElements.length);
        retryElements.forEach((el) => this.observer?.observe(el));
      }, 500);
    } else {
      elements.forEach((el) => this.observer?.observe(el));
    }
  }

  private setupSkillObserver(): void {
    if (typeof IntersectionObserver === 'undefined' || !this.skillCards) return;

    // Disconnect existing observer if any
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
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Watch for changes in skillCards
    this.skillCards.forEach((card) => {
      this.skillObserver?.observe(card.nativeElement);
    });
  }
}