// Angular.
import { Injectable, signal } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

// 3rd party.
import { map, filter, distinctUntilChanged } from 'rxjs';

export interface Breadcrumb {
  label: string;
  routerLink?: string;
  icon?: string;
}

/**
 * Breadcrumb service.
 */
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  static readonly defaults = {
    dataProperty: 'title',
    home: {
      label: 'Home',
      routerLink: '/',
    },
  };

  readonly breadcrumbs = signal<Breadcrumb[]>([]);

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
        map(() => this.buildBreadcrumbs(this.route.root))
      )
      .subscribe((breadcrumbs) => this.breadcrumbs.set(breadcrumbs));
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL) {
        url += `/${routeURL}`;
      }

      const property = BreadcrumbService.defaults.dataProperty;
      const breadcrumbTitle = child.snapshot.data[property];

      if (breadcrumbTitle) {
        breadcrumbs.push({
          label: breadcrumbTitle,
          routerLink: url,
        });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
