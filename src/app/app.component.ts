import { Component, signal } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { TimerComponent } from './shared/components/timer/timer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, TimerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly FOCUS_TIME = 25;
  private readonly BREAK_TIME = 5;

  time = signal(this.FOCUS_TIME);
  isFocus = signal(true);

  toggleTheme(isFocus = true): void {
    this.isFocus.set(isFocus);
    this.time.set(this.isFocus() ? this.FOCUS_TIME : this.BREAK_TIME);
    const themeClass = this.isFocus() ? 'dark-theme' : '';
    document.documentElement.className = themeClass;
  }
}
