import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent {
  time = input(0);
  textColor = input('#4a90e2');
  hasFinished = output<boolean>();

  countdown = computed(() => this.formatTime(this.totalSeconds()));
  private totalSeconds = signal(this.time() * 60);
  private timerSubscription!: Subscription;

  isRunning = signal(false);

  constructor() {
    effect(
      () => {
        this.totalSeconds.set(this.time() * 60);
        this.stopCountdown();
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  startCountdown(): void {
    // const audio = new Audio();
    // audio.src = 'assets/start.mp3';
    // audio.load();
    // audio.play();

    this.isRunning.set(true);

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.totalSeconds() > 0) {
        this.totalSeconds.set(this.totalSeconds() - 1);
      } else {
        this.stopCountdown(true);
        this.hasFinished.emit(true);
      }
    });
  }

  stopCountdown(hasFinish = false): void {
    // const audio = new Audio();
    // audio.src = hasFinish ? 'assets/finish.mp3' : 'assets/stop.mp3';
    // audio.load();
    // audio.play();

    if (this.timerSubscription) {
      this.isRunning.set(false);
      this.timerSubscription.unsubscribe();
    }
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
