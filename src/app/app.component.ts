import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CategoryService } from './data-access/categories/categories.service';
import { NavSidebarComponent } from './components/nav-sidebar/nav-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, NavSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      if (categories.length > 0) {
        const mainCategory = categories.find((c) => c.isMain);
        if (mainCategory) {
          this.router.navigate(['/list/daily', mainCategory._id]);
        }
      }
    });
  }
}
