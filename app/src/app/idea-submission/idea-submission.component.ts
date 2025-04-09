import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-idea-submission',
  templateUrl: './idea-submission.component.html',
  styleUrls: ['./idea-submission.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class IdeaSubmissionComponent {
  @Output() ideaSubmitted = new EventEmitter<{idea: string, additionalInfo: string}>();
  
  idea: string = '';
  additionalInfo: string = '';
  alertMessage: string = '';

  submitIdea() {
    if (this.idea.trim()) {
      this.ideaSubmitted.emit({
        idea: this.idea,
        additionalInfo: this.additionalInfo
      });
      this.idea = '';
      this.additionalInfo = '';
      this.alertMessage = 'Generating minions...';
    }
  }
}
