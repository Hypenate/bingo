import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { bingoWords } from './bingo.words';

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgClass],
  standalone: true,
  template: `
    <div class="bingo-container">
      @if (hasWon) {
        <div class="win-overlay" (click)="hasWon = false">
          <div class="win-text">🎉 BINGO! 🎉</div>
        </div>
      }

      @if (useWords) {
        <h1 class="title">CORPORATE BINGO!</h1>
      } @else {
        <h1 class="title">BINGO!</h1>
      }

      <div class="bingo-options">
        <label class="checkbox-label">
          <input type="checkbox" [(ngModel)]="useWords" (change)="generateBingoCard()" class="checkbox-input" />
          Use Words
        </label>

        <label class="checkbox-label">
          <input type="checkbox" [(ngModel)]="isLive" (change)="startTimer()" class="checkbox-input" />
          Live
        </label>
      </div>

      <div class="bingo-grid">
        @for (cell of bingoCard; let i = $index; track cell) {
          <button
            (click)="toggleCell(i)"
            [disabled]="i === 12"
            class="bingo-cell"
            [ngClass]="[useWords ? 'cell-word' : 'cell-number', toggledCells[i] ? 'cell-active' : 'cell-inactive']">
            {{ i === 12 ? '★' : cell }}
          </button>
        }
      </div>

      @if (!isLive) {
        <button (click)="generateCardValues()" class="generate-button">Generate {{ useWords ? 'Word' : 'Number' }}</button>

        @if (value) {
          <div class="drawn-value">Drawn {{ useWords ? 'word' : 'number' }}: {{ value }}</div>
        }
      } @else {
        <div class="timer">⏱️ {{ getFormattedTime() }}</div>
      }
    </div>
  `,
  styleUrls: ['./bingo.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BingoComponent {
  @Input() useWords = false;
  @Input() isLive = false;

  hasWon = false;
  value: string | number | null = null;
  words = bingoWords;
  bingoCard: (string | number)[] = [];
  toggledCells: boolean[] = Array.from({ length: 25 }, () => false);

  constructor() {
    this.generateBingoCard();
    this.toggledCells[12] = true; // Center cell is always marked
  }

  private intervalId?: number;
  private currentTime = 0;

  startTimer() {
    clearInterval(this.intervalId);

    this.intervalId = window.setInterval(() => {
      this.currentTime++; // Mutation won't trigger OnPush detection
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = this.currentTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  generateBingoCard() {
    if (this.useWords) {
      this.bingoCard = [...this.words].sort(() => 0.5 - Math.random()).slice(0, 25);
    } else {
      this.bingoCard = Array.from({ length: 25 }, () => Math.floor(Math.random() * 75) + 1);
    }
  }

  generateCardValues() {
    this.value = this.useWords ? this.words[Math.floor(Math.random() * this.words.length)] : Math.floor(Math.random() * 75) + 1;
  }

  toggleCell(i: number) {
    if (i === 12) return; // Center cell is always marked
    this.toggledCells[i] = !this.toggledCells[i];

    this.hasWon = this.checkWin();
  }

  checkWin(): boolean {
    // Horizontal rows
    for (let i = 0; i < 25; i += 5) {
      if (this.toggledCells.slice(i, i + 5).every((cell) => cell)) return true;
    }

    // Vertical columns
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every((j) => this.toggledCells[i + j * 5])) return true;
    }

    // Diagonals
    if ([0, 6, 12, 18, 24].every((i) => this.toggledCells[i])) return true;
    if ([4, 8, 12, 16, 20].every((i) => this.toggledCells[i])) return true;

    return false;
  }
}
