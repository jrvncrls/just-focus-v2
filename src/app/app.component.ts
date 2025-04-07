import { Component } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isFocus = true;

  toggleTheme(isFocus = true): void {
    this.isFocus = isFocus;
    const themeClass = this.isFocus ? 'dark-theme' : '';
    document.documentElement.className = themeClass;
  }
}
