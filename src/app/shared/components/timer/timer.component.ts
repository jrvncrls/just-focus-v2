import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnInit {
  time = input(0);
  textColor = input('#4a90e2');
  hasFinished = output<boolean>();

  countdown = computed(() => this.formatTime(this.totalSeconds()));
  private totalSeconds = signal(this.time() * 60);
  private timerSubscription!: Subscription;
  private startTime!: number;
  private duration!: number; // store how long the timer should run (in seconds)
  private startAudio = new Audio('start.mp3');
  private finishAudio = new Audio('finish.mp3');
  private stopAudio = new Audio('stop.mp3');

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

  ngOnInit(): void {
    this.startAudio.load();
    this.finishAudio.load();
    this.stopAudio.load();
  }

  startCountdown(): void {
    this.startAudio.currentTime = 0;
    this.startAudio.play();

    this.isRunning.set(true);

    this.duration = this.totalSeconds();
    this.startTime = Date.now();

    this.timerSubscription = interval(1000).subscribe(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const remaining = this.duration - elapsed;

      if (remaining > 0) {
        this.totalSeconds.set(remaining);
      } else {
        this.totalSeconds.set(0);
        this.stopCountdown(true);
        this.hasFinished.emit(true);
      }
    });
  }

  stopCountdown(hasFinish = false): void {
    const audio = hasFinish ? this.finishAudio : this.stopAudio;
    audio.currentTime = 0;
    audio.play();

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
