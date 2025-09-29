import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'sirc-frontend';
  showBackground = false;

  private authRoutes = [
    '/auth/login',
    '/auth/registro',
    '/auth/forgot-password'
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkRoute(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  private checkRoute(url: string): void {
    this.showBackground = this.authRoutes.some(route => url.includes(route));
  }
}
