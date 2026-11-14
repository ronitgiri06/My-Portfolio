import { Component, signal, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface NavLink { label: string; href: string; }
interface SkillGroup { name: string; skills: string[]; }
interface EducationItem { period: string; title: string; institution: string; description: string; }
interface Certificate { title: string; issuer: string; year: string; }
interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  github: string;
  liveUrl?: string;
}
interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}
interface ExperienceItem {
  period: string;
  title: string;
  organization: string;
  description: string;
  bullets: string[];
}
interface Language {
  name: string;
  level: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly mobileMenuOpen = signal(false);
  readonly currentYear = new Date().getFullYear();

  // Carousel state
  readonly activeProject = signal(0);

  // Review state
  readonly reviews = signal<Review[]>([
    {
      id: 1,
      name: 'Om Institute of Technology',
      rating: 5,
      comment: 'Ronit assisted with our institute management portal and delivered the frontend, backend and database modules. Reliable, detail-oriented, and easy to work with.',
      date: 'Sep 2026',
    },
  ]);
  readonly newRating = signal(0);
  readonly newName = signal('');
  readonly newComment = signal('');

  readonly navLinks: NavLink[] = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Projects', href: '#projects' },
    // { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  readonly skillGroups: SkillGroup[] = [
    {
      name: 'Programming Languages',
      skills: ['Java', 'JavaScript', 'TypeScript', 'C', 'C++'],
    },
    {
      name: 'Frontend Development',
      skills: ['Angular', 'HTML5', 'CSS3', 'RxJS', 'Angular Signals', 'Responsive Web Design'],
    },
    {
      name: 'Backend Development',
      skills: ['Spring Boot', 'Spring Data JPA', 'REST APIs', 'CRUD Operations'],
    },
    {
      name: 'Database',
      skills: ['MySQL', 'SQL', 'Relational Database Design'],
    },
    {
      name: 'Tools & Version Control',
      skills: ['Visual Studio Code', 'IntelliJ IDEA', 'Postman', 'Git', 'GitHub'],
    },
    {
      name: 'Additional Knowledge',
      skills: ['OOP', 'Exception Handling', 'SDLC (Waterfall)', 'Stripe Checkout Integration', 'Basic Linux & CLI'],
    },
  ];

  readonly experience: ExperienceItem[] = [
    {
      period: 'May 2026 – Oct 2026',
      title: 'Technical Project Assistance',
      organization: 'Om Institute of Technology',
      description: 'Unpaid role (6 months) supporting student college projects; guided by an institute teacher.',
      bullets: [
        "Implemented full-stack modules for a student's institute management project using Angular, Spring Boot, and MySQL.",
        "Developed the institute's responsive landing page using Angular and TypeScript.",
      ],
    },
  ];

  readonly education: EducationItem[] = [
    {
      period: 'Oct 2026',
      title: 'Bachelor of Computer Applications (BCA)',
      institution: 'Indira Gandhi National Open University (IGNOU)',
      description: 'Percentage: 66.21%',
    },
    {
      period: 'Apr 2026',
      title: 'Java Full Stack Development',
      institution: 'Om Institute of Technology',
      description: 'Completed 6-month training program. Grade: A.',
    },
  ];

  readonly certificates: Certificate[] = [
    { title: 'Java Full Stack Development', issuer: 'Om Institute of Technology', year: '2026' },
  ];

  readonly languages: Language[] = [
    { name: 'English', level: 'Intermediate' },
    { name: 'Hindi', level: 'Fluent' },
  ];

  readonly projects: Project[] = [
    {
      title: 'RoomPilot — Conference Room Booking',
      description:
        'Full-stack booking app with user auth, room management, availability checking, booking and cancellation, booking history, and an admin dashboard. Includes role-based logic and Stripe Checkout payments.',
      tech: ['Angular', 'Spring Boot', 'MySQL', 'JPA', 'Stripe', 'REST APIs'],
      image: 'project1.png',
      github: 'https://github.com/ronitgiri06/roompilot',
    },
    {
      title: 'OIT Landing Page',
      description:
        'Responsive website for Om Institute of Technology presenting institute information, courses, facilities, and contact details. Built with reusable standalone components and responsive layouts.',
      tech: ['Angular', 'TypeScript', 'HTML5', 'CSS3'],
      image: 'project3.png',
      github: 'https://github.com/ronitgiri06/OIT',
      liveUrl: 'https://oit-institute.netlify.app/',
    },
    {
      title: 'Personal Portfolio Website',
      description:
        'This live, responsive developer portfolio with About, Technical Skills, Projects, Education, and Contact sections, animations, and a downloadable resume.',
      tech: ['Angular', 'TypeScript', 'HTML5', 'CSS3'],
      image: 'project2.png',
      github: 'https://github.com/ronitgiri06/My-Portfolio',
      liveUrl: 'https://ronit-portfolio0.netlify.app/',
    },
  ];

  // --- Carousel Methods ---
  nextProject(): void {
    const nextIndex = this.activeProject() + 1;
    this.activeProject.set(nextIndex >= this.projects.length ? 0 : nextIndex);
  }

  prevProject(): void {
    const prevIndex = this.activeProject() - 1;
    this.activeProject.set(prevIndex < 0 ? this.projects.length - 1 : prevIndex);
  }

  goToProject(index: number): void {
    if (index >= 0 && index < this.projects.length) {
      this.activeProject.set(index);
    }
  }

  // --- Review Methods ---
  setRating(value: number): void {
    this.newRating.set(value);
  }

  submitReview(): void {
    const rating = this.newRating();
    const name = this.newName().trim();
    const comment = this.newComment().trim();

    if (!rating || !name || !comment) return;

    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    this.reviews.update((list) => [
      {
        id: Date.now(),
        name,
        rating,
        comment,
        date: today,
      },
      ...list,
    ]);

    // Reset form
    this.newRating.set(0);
    this.newName.set('');
    this.newComment.set('');
  }

  // --- Mobile Menu Methods ---
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  // --- Swipe Support ---
  private touchStartX = 0;
  private touchEndX = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    if (this.touchStartX - this.touchEndX > swipeThreshold) this.nextProject();
    if (this.touchEndX - this.touchStartX > swipeThreshold) this.prevProject();
  }
}