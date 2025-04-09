import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { IdeaService } from '../../services/idea-service.service';
import { ProjectStateService } from '../../services/project-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-plan',
  templateUrl: './project-plan.component.html',
  styleUrls: ['./project-plan.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MarkdownModule
  ]
})
export class ProjectPlanComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() projectId: number = 0;

  // Project plan sections
  goals: string = '';
  objectives: string = '';
  scopeDeliverables: string = '';
  workBreakdownStructure: string = '';
  timelineMilestones: string = '';
  budgetResources: string = '';
  riskAssumptions: string = '';
  taskBreakdown: string = '';

  // Editing states
  isEditingGoals = false;
  isEditingObjectives = false;
  isEditingScopeDeliverables = false;
  isEditingWorkBreakdownStructure = false;
  isEditingTimelineMilestones = false;
  isEditingBudgetResources = false;
  isEditingRiskAssumptions = false;
  isEditingTaskBreakdown = false;

  // Editing content
  editingGoals = '';
  editingObjectives = '';
  editingScopeDeliverables = '';
  editingWorkBreakdownStructure = '';
  editingTimelineMilestones = '';
  editingBudgetResources = '';
  editingRiskAssumptions = '';
  editingTaskBreakdown = '';

  private stateSubscription: Subscription;
  private dataLoaded = false;

  constructor(
    private ideaService: IdeaService,
    private projectStateService: ProjectStateService
  ) {
    this.stateSubscription = this.projectStateService.getProjectState().subscribe(state => {
      this.goals = state.goals;
      this.objectives = state.objectives;
      this.scopeDeliverables = state.scopeDeliverables;
      this.workBreakdownStructure = state.workBreakdownStructure;
      this.timelineMilestones = state.timelineMilestones;
      this.budgetResources = state.budgetResources;
      this.riskAssumptions = state.riskAssumptions;
      this.taskBreakdown = state.taskBreakdown;
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

  loadData() {
    if (this.projectId) {
      this.projectStateService.fetchProjectData(this.projectId);
    }
  }

  startEditing(section: string) {
    switch (section) {
      case 'goals':
        this.isEditingGoals = true;
        this.editingGoals = this.goals;
        break;
      case 'objectives':
        this.isEditingObjectives = true;
        this.editingObjectives = this.objectives;
        break;
      case 'scope_deliverables':
        this.isEditingScopeDeliverables = true;
        this.editingScopeDeliverables = this.scopeDeliverables;
        break;
      case 'work_breakdown_structure':
        this.isEditingWorkBreakdownStructure = true;
        this.editingWorkBreakdownStructure = this.workBreakdownStructure;
        break;
      case 'timeline_milestones':
        this.isEditingTimelineMilestones = true;
        this.editingTimelineMilestones = this.timelineMilestones;
        break;
      case 'budget_resources':
        this.isEditingBudgetResources = true;
        this.editingBudgetResources = this.budgetResources;
        break;
      case 'risk_assumptions':
        this.isEditingRiskAssumptions = true;
        this.editingRiskAssumptions = this.riskAssumptions;
        break;
      case 'task_breakdown':
        this.isEditingTaskBreakdown = true;
        this.editingTaskBreakdown = this.taskBreakdown;
        break;
    }
  }

  cancelEditing(section: string) {
    switch (section) {
      case 'goals':
        this.isEditingGoals = false;
        break;
      case 'objectives':
        this.isEditingObjectives = false;
        break;
      case 'scope_deliverables':
        this.isEditingScopeDeliverables = false;
        break;
      case 'work_breakdown_structure':
        this.isEditingWorkBreakdownStructure = false;
        break;
      case 'timeline_milestones':
        this.isEditingTimelineMilestones = false;
        break;
      case 'budget_resources':
        this.isEditingBudgetResources = false;
        break;
      case 'risk_assumptions':
        this.isEditingRiskAssumptions = false;
        break;
      case 'task_breakdown':
        this.isEditingTaskBreakdown = false;
        break;
    }
  }

  saveEditing(section: string) {
    switch (section) {
      case 'goals':
        this.ideaService.updateProjectContent(this.projectId, 'goals', this.editingGoals).subscribe({
          next: () => {
            this.goals = this.editingGoals;
            this.isEditingGoals = false;
            this.projectStateService.updateProjectState({ goals: this.goals });
          },
          error: (error: Error) => {
            console.error('Error saving goals:', error);
          }
        });
        break;
      case 'objectives':
        this.ideaService.updateProjectContent(this.projectId, 'objectives', this.editingObjectives).subscribe({
          next: () => {
            this.objectives = this.editingObjectives;
            this.isEditingObjectives = false;
            this.projectStateService.updateProjectState({ objectives: this.objectives });
          },
          error: (error: Error) => {
            console.error('Error saving objectives:', error);
          }
        });
        break;
      case 'scope_deliverables':
        this.ideaService.updateProjectContent(this.projectId, 'scope_deliverables', this.editingScopeDeliverables).subscribe({
          next: () => {
            this.scopeDeliverables = this.editingScopeDeliverables;
            this.isEditingScopeDeliverables = false;
            this.projectStateService.updateProjectState({ scopeDeliverables: this.scopeDeliverables });
          },
          error: (error: Error) => {
            console.error('Error saving scope and deliverables:', error);
          }
        });
        break;
      case 'work_breakdown_structure':
        this.ideaService.updateProjectContent(this.projectId, 'work_breakdown_structure', this.editingWorkBreakdownStructure).subscribe({
          next: () => {
            this.workBreakdownStructure = this.editingWorkBreakdownStructure;
            this.isEditingWorkBreakdownStructure = false;
            this.projectStateService.updateProjectState({ workBreakdownStructure: this.workBreakdownStructure });
          },
          error: (error: Error) => {
            console.error('Error saving work breakdown structure:', error);
          }
        });
        break;
      case 'timeline_milestones':
        this.ideaService.updateProjectContent(this.projectId, 'timeline_milestones', this.editingTimelineMilestones).subscribe({
          next: () => {
            this.timelineMilestones = this.editingTimelineMilestones;
            this.isEditingTimelineMilestones = false;
            this.projectStateService.updateProjectState({ timelineMilestones: this.timelineMilestones });
          },
          error: (error: Error) => {
            console.error('Error saving timeline and milestones:', error);
          }
        });
        break;
      case 'budget_resources':
        this.ideaService.updateProjectContent(this.projectId, 'budget_resources', this.editingBudgetResources).subscribe({
          next: () => {
            this.budgetResources = this.editingBudgetResources;
            this.isEditingBudgetResources = false;
            this.projectStateService.updateProjectState({ budgetResources: this.budgetResources });
          },
          error: (error: Error) => {
            console.error('Error saving budget and resources:', error);
          }
        });
        break;
      case 'risk_assumptions':
        this.ideaService.updateProjectContent(this.projectId, 'risk_assumptions', this.editingRiskAssumptions).subscribe({
          next: () => {
            this.riskAssumptions = this.editingRiskAssumptions;
            this.isEditingRiskAssumptions = false;
            this.projectStateService.updateProjectState({ riskAssumptions: this.riskAssumptions });
          },
          error: (error: Error) => {
            console.error('Error saving risks and assumptions:', error);
          }
        });
        break;
      case 'task_breakdown':
        this.ideaService.updateProjectContent(this.projectId, 'task', this.editingTaskBreakdown).subscribe({
          next: () => {
            this.taskBreakdown = this.editingTaskBreakdown;
            this.isEditingTaskBreakdown = false;
            this.projectStateService.updateProjectState({ taskBreakdown: this.taskBreakdown });
          },
          error: (error: Error) => {
            console.error('Error saving task breakdown:', error);
          }
        });
        break;
    }
  }

  getCleanContent(content: string): string {
    return content || 'Loading...';
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
