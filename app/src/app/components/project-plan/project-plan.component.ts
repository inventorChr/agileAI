import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { IdeaService, GoalResponse, ObjectiveResponse, ScopeDeliverablesResponse, WorkBreakdownStructureResponse, TimelineMilestonesResponse, BudgetResourceResponse, RiskAssumptionResponse, TaskResponse } from '../../services/idea-service.service';

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
export class ProjectPlanComponent implements OnInit {
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

  constructor(private ideaService: IdeaService) {}

  ngOnInit() {
    if (this.projectId) {
      this.fetchProjectPlan();
    }
  }

  fetchProjectPlan() {
    // Fetch goals
    this.ideaService.getGoal(this.projectId.toString()).subscribe({
      next: (response: GoalResponse) => {
        if (response?.goal) {
          this.goals = response.goal;
        }
      },
      error: (error: Error) => {
        console.error('Error fetching goals:', error);
      }
    });

    // Fetch objectives
    this.ideaService.getObjective(this.projectId.toString()).subscribe({
      next: (response: ObjectiveResponse) => {
        if (response?.objective) {
          this.objectives = response.objective;
        }
      },
      error: (error: Error) => {
        console.error('Error fetching objectives:', error);
      }
    });

    // Fetch scope and deliverables
    this.ideaService.getScopeDeliverables(this.projectId.toString()).subscribe({
      next: (response: ScopeDeliverablesResponse) => {
        if (response?.scopeDeliverables) {
          this.scopeDeliverables = response.scopeDeliverables;
        }
      },
      error: (error: Error) => {
        console.error('Error fetching scope and deliverables:', error);
      }
    });

    // Fetch work breakdown structure
    this.ideaService.getWorkBreakdownStructure(this.projectId.toString()).subscribe({
      next: (response: WorkBreakdownStructureResponse) => {
        if (response?.workBreakdownStructure) {
          this.workBreakdownStructure = response.workBreakdownStructure;
        }
      },
      error: (error: Error) => {
        console.error('Error fetching work breakdown structure:', error);
      }
    });

    // Fetch timeline and milestones
    this.ideaService.getTimelineMilestones(this.projectId.toString()).subscribe({
      next: (response: TimelineMilestonesResponse) => {
        if (response?.timelineMilestones) {
          this.timelineMilestones = response.timelineMilestones;
        }
      },
      error: (error: Error) => {
        console.error('Error fetching timeline and milestones:', error);
      }
    });

    // Fetch budget and resources
    this.ideaService.getBudgetResource(this.projectId.toString()).subscribe({
      next: (response: BudgetResourceResponse) => {
        if (response?.budgetResource) {
          this.budgetResources = response.budgetResource;
        }
      },
      error: (error: Error) => {
        console.error('Error fetching budget and resources:', error);
      }
    });

    // Fetch risks and assumptions
    this.ideaService.getRiskAssumption(this.projectId.toString()).subscribe({
      next: (response: RiskAssumptionResponse) => {
        if (response?.riskAssumption) {
          this.riskAssumptions = response.riskAssumption;
        }
      },
      error: (error: Error) => {
        console.error('Error fetching risks and assumptions:', error);
      }
    });

    // Fetch task breakdown
    this.ideaService.getTask(this.projectId.toString()).subscribe({
      next: (response: TaskResponse) => {
        if (response?.task) {
          this.taskBreakdown = response.task;
        }
      },
      error: (error: Error) => {
        console.error('Error fetching task breakdown:', error);
      }
    });
  }

  // Start editing methods
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

  // Cancel editing methods
  cancelEditing(section: string) {
    switch (section) {
      case 'goals':
        this.isEditingGoals = false;
        this.editingGoals = '';
        break;
      case 'objectives':
        this.isEditingObjectives = false;
        this.editingObjectives = '';
        break;
      case 'scope_deliverables':
        this.isEditingScopeDeliverables = false;
        this.editingScopeDeliverables = '';
        break;
      case 'work_breakdown_structure':
        this.isEditingWorkBreakdownStructure = false;
        this.editingWorkBreakdownStructure = '';
        break;
      case 'timeline_milestones':
        this.isEditingTimelineMilestones = false;
        this.editingTimelineMilestones = '';
        break;
      case 'budget_resources':
        this.isEditingBudgetResources = false;
        this.editingBudgetResources = '';
        break;
      case 'risk_assumptions':
        this.isEditingRiskAssumptions = false;
        this.editingRiskAssumptions = '';
        break;
      case 'task_breakdown':
        this.isEditingTaskBreakdown = false;
        this.editingTaskBreakdown = '';
        break;
    }
  }

  // Save editing methods
  saveEditing(section: string) {
    switch (section) {
      case 'goals':
        this.ideaService.updateProjectContent(this.projectId, 'goals', this.editingGoals).subscribe({
          next: () => {
            this.goals = this.editingGoals;
            this.isEditingGoals = false;
          },
          error: (error: Error) => {
            console.error('Error updating goals:', error);
          }
        });
        break;
      case 'objectives':
        this.ideaService.updateProjectContent(this.projectId, 'objectives', this.editingObjectives).subscribe({
          next: () => {
            this.objectives = this.editingObjectives;
            this.isEditingObjectives = false;
          },
          error: (error: Error) => {
            console.error('Error updating objectives:', error);
          }
        });
        break;
      case 'scope_deliverables':
        this.ideaService.updateProjectContent(this.projectId, 'scope_deliverables', this.editingScopeDeliverables).subscribe({
          next: () => {
            this.scopeDeliverables = this.editingScopeDeliverables;
            this.isEditingScopeDeliverables = false;
          },
          error: (error: Error) => {
            console.error('Error updating scope and deliverables:', error);
          }
        });
        break;
      case 'work_breakdown_structure':
        this.ideaService.updateProjectContent(this.projectId, 'work_breakdown_structure', this.editingWorkBreakdownStructure).subscribe({
          next: () => {
            this.workBreakdownStructure = this.editingWorkBreakdownStructure;
            this.isEditingWorkBreakdownStructure = false;
          },
          error: (error: Error) => {
            console.error('Error updating work breakdown structure:', error);
          }
        });
        break;
      case 'timeline_milestones':
        this.ideaService.updateProjectContent(this.projectId, 'timeline_milestones', this.editingTimelineMilestones).subscribe({
          next: () => {
            this.timelineMilestones = this.editingTimelineMilestones;
            this.isEditingTimelineMilestones = false;
          },
          error: (error: Error) => {
            console.error('Error updating timeline and milestones:', error);
          }
        });
        break;
      case 'budget_resources':
        this.ideaService.updateProjectContent(this.projectId, 'budget_resources', this.editingBudgetResources).subscribe({
          next: () => {
            this.budgetResources = this.editingBudgetResources;
            this.isEditingBudgetResources = false;
          },
          error: (error: Error) => {
            console.error('Error updating budget and resources:', error);
          }
        });
        break;
      case 'risk_assumptions':
        this.ideaService.updateProjectContent(this.projectId, 'risk_assumptions', this.editingRiskAssumptions).subscribe({
          next: () => {
            this.riskAssumptions = this.editingRiskAssumptions;
            this.isEditingRiskAssumptions = false;
          },
          error: (error: Error) => {
            console.error('Error updating risks and assumptions:', error);
          }
        });
        break;
      case 'task_breakdown':
        this.ideaService.updateProjectContent(this.projectId, 'task_breakdown', this.editingTaskBreakdown).subscribe({
          next: () => {
            this.taskBreakdown = this.editingTaskBreakdown;
            this.isEditingTaskBreakdown = false;
          },
          error: (error: Error) => {
            console.error('Error updating task breakdown:', error);
          }
        });
        break;
    }
  }

  // Clean content methods
  getCleanContent(content: string): string {
    return content ? content.trim() : '';
  }

  updateGoals(): void {
    if (this.projectId) {
      this.ideaService.updateProjectContent(this.projectId, 'goals', this.goals).subscribe({
        next: () => {
          this.isEditingGoals = false;
        },
        error: (error: Error) => {
          console.error('Error updating goals:', error);
        }
      });
    }
  }

  updateObjectives(): void {
    if (this.projectId) {
      this.ideaService.updateProjectContent(this.projectId, 'objectives', this.objectives).subscribe({
        next: () => {
          this.isEditingObjectives = false;
        },
        error: (error: Error) => {
          console.error('Error updating objectives:', error);
        }
      });
    }
  }

  updateBudgetResources(): void {
    if (this.projectId) {
      this.ideaService.updateProjectContent(this.projectId, 'budgetResources', this.budgetResources).subscribe({
        next: () => {
          this.isEditingBudgetResources = false;
        },
        error: (error: Error) => {
          console.error('Error updating budget and resources:', error);
        }
      });
    }
  }

  updateRiskAssumptions(): void {
    if (this.projectId) {
      this.ideaService.updateProjectContent(this.projectId, 'riskAssumptions', this.riskAssumptions).subscribe({
        next: () => {
          this.isEditingRiskAssumptions = false;
        },
        error: (error: Error) => {
          console.error('Error updating risks and assumptions:', error);
        }
      });
    }
  }

  updateTaskBreakdown(): void {
    if (this.projectId) {
      this.ideaService.updateProjectContent(this.projectId, 'taskBreakdown', this.taskBreakdown).subscribe({
        next: () => {
          this.isEditingTaskBreakdown = false;
        },
        error: (error: Error) => {
          console.error('Error updating task breakdown:', error);
        }
      });
    }
  }
}
