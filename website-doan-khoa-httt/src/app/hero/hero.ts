import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';

type GsapContext = {
  revert: () => void;
};

type StatCard = {
  value: string;
  caption: string;
  tone: 'blue' | 'red';
  icon: 'people' | 'calendar' | 'student' | 'flag';
};

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private gsapContext?: GsapContext;

  protected readonly navItems = ['Sự kiện', 'Tin tức', 'Ban Chấp hành', 'Chưa nghĩ ra', 'Liên hệ'];

  protected readonly stats: StatCard[] = [
    { value: '120+', caption: 'Cán bộ Đoàn', tone: 'blue', icon: 'people' },
    { value: '25+', caption: 'Sự kiện mỗi năm', tone: 'red', icon: 'calendar' },
    { value: '1000+', caption: 'Sinh viên đồng hành', tone: 'blue', icon: 'people' },
    { value: '2010', caption: 'Năm thành lập', tone: 'red', icon: 'flag' },
  ];

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    const { gsap } = await import('gsap');

    this.gsapContext = gsap.context(() => {
      gsap.from('[data-hero-header]', {
        y: -18,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });

      gsap.from('[data-hero-copy-item]', {
        y: 26,
        opacity: 0,
        duration: 0.82,
        stagger: 0.09,
        delay: 0.12,
        ease: 'power3.out',
      });

      gsap.from('[data-hero-photo]', {
        x: 42,
        y: 18,
        opacity: 0,
        scale: 0.96,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('[data-hero-float]', {
        scale: 0.85,
        opacity: 0,
        duration: 0.74,
        stagger: 0.1,
        delay: 0.68,
        ease: 'back.out(1.7)',
      });
    }, this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.gsapContext?.revert();
  }
}
