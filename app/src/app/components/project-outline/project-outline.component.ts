import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { IdeaService } from '../../services/idea-service.service';
import { ProjectStateService } from '../../services/project-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-outline',
  templateUrl: './project-outline.component.html',
  styleUrls: ['./project-outline.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MarkdownModule
  ]
})
export class ProjectOutlineComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() projectId: number = 0;
  @Output() titleUpdated = new EventEmitter<string>();
  @Output() summaryUpdated = new EventEmitter<string>();
  @Output() businessCaseUpdated = new EventEmitter<string>();

  title: string = '';
  summary: string = '';
  business_case: string = '';

  isEditingTitle = false;
  isEditingSummary = false;
  isEditingBusinessCase = false;

  editingTitle = '';
  editingSummary = '';
  editingBusinessCase = '';

  private stateSubscription: Subscription;
  private dataLoaded = false;

  constructor(
    private ideaService: IdeaService,
    private projectStateService: ProjectStateService
  ) {
    this.stateSubscription = this.projectStateService.getProjectState().subscribe(state => {
      this.title = state.title;
      this.summary = state.summary;
      this.business_case = state.businessCase;
      this.dataLoaded = true;
    });
  }

  ngOnInit() {
    // Initial setup
  }

  ngAfterViewInit() {
    // Ensure data is loaded after view initialization
    if (this.projectId && !this.dataLoaded) {
      this.loadData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['projectId'] && !changes['projectId'].firstChange) {
      this.loadData();
    }
  }

  loadData() {
    if (this.projectId) {
      this.projectStateService.fetchProjectData(this.projectId);
    }
  }

  startEditing(field: string) {
    switch (field) {
      case 'title':
        this.isEditingTitle = true;
        this.editingTitle = this.title;
        break;
      case 'summary':
        this.isEditingSummary = true;
        this.editingSummary = this.summary;
        break;
      case 'business_case':
        this.isEditingBusinessCase = true;
        this.editingBusinessCase = this.business_case;
        break;
    }
  }

  cancelEditing(field: string) {
    switch (field) {
      case 'title':
        this.isEditingTitle = false;
        break;
      case 'summary':
        this.isEditingSummary = false;
        break;
      case 'business_case':
        this.isEditingBusinessCase = false;
        break;
    }
  }

  saveEditing(field: string) {
    switch (field) {
      case 'title':
        this.ideaService.updateProjectContent(this.projectId, 'title', this.editingTitle).subscribe({
          next: () => {
            this.title = this.editingTitle;
            this.isEditingTitle = false;
            this.titleUpdated.emit(this.title);
            this.projectStateService.updateProjectState({ title: this.title });
          },
          error: (error: Error) => {
            console.error('Error saving title:', error);
          }
        });
        break;
      case 'summary':
        this.ideaService.updateProjectContent(this.projectId, 'summary', this.editingSummary).subscribe({
          next: () => {
            this.summary = this.editingSummary;
            this.isEditingSummary = false;
            this.summaryUpdated.emit(this.summary);
            this.projectStateService.updateProjectState({ summary: this.summary });
          },
          error: (error: Error) => {
            console.error(error);
          }
        });
        break;
      case 'business_case':
        this.ideaService.updateProjectContent(this.projectId, 'business_case', this.editingBusinessCase).subscribe({
          next: () => {
            this.business_case = this.editingBusinessCase;
            this.isEditingBusinessCase = false;
            this.businessCaseUpdated.emit(this.business_case);
            this.projectStateService.updateProjectState({ businessCase: this.business_case });
          },
          error: (error: Error) => {
            console.error(error);
          }
        });
        break;
    }
  }

  getCleanSummary(): string {
    return this.summary || 'Loading summary...';
  }

  getCleanBusinessCase(): string {
    return this.business_case || 'Loading business case...';
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
