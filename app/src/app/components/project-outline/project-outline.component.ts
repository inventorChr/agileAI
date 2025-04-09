import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { IdeaService } from '../../services/idea-service.service';

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
export class ProjectOutlineComponent implements OnInit, OnChanges, OnDestroy {
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

  private titlePollingInterval: any;
  private maxTitlePollingAttempts = 8;
  private titlePollingAttempts = 0;
  private pollingInterval = 5000;
  private initialDelay = 5000;

  private summaryPollingInterval: any;
  private maxSummaryPollingAttempts = 8;
  private summaryPollingAttempts = 0;
  private summaryPollingTime = 10000; // 10 seconds for summary polling
  private summaryInitialDelay = 5000; // 5 seconds delay after title loads

  private businessCasePollingInterval: any;
  private maxBusinessCasePollingAttempts = 8;
  private businessCasePollingAttempts = 0;
  private businessCasePollingTime = 15000; // 15 seconds for business case polling
  private businessCaseInitialDelay = 5000; // 5 seconds delay after summary loads

  constructor(private ideaService: IdeaService) {}

  ngOnInit() {
    if (this.projectId) {
      this.fetchAllData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['projectId'] && !changes['projectId'].firstChange) {
      this.fetchAllData();
    }
  }

  fetchAllData() {
    setTimeout(() => {
      this.getTitle();
    }, this.initialDelay);
  }

  getTitle() {
    console.log('Fetching title for project ID:', this.projectId);
    if (!this.projectId) {
      console.warn('Project ID is not set, cannot fetch title');
      return;
    }
    
    // Clear any existing polling interval
    if (this.titlePollingInterval) {
      clearInterval(this.titlePollingInterval);
    }

    // Reset polling attempts
    this.titlePollingAttempts = 0;

    const fetchTitle = () => {
      this.ideaService.getTitle(this.projectId.toString()).subscribe({
        next: (response) => {
          console.log('Title response:', response);
          if (response && response.title) {
            // Title is available, stop polling
            if (this.titlePollingInterval) {
              clearInterval(this.titlePollingInterval);
            }

            const titleMatch = response.title.match(/^#[^"]*"([^"]+)"/);
            if (titleMatch && titleMatch[1]) {
              this.title = titleMatch[1];
            } else {
              this.title = response.title
                .replace(/^#\s*Project Title:\s*\n/i, '')
                .replace(/^["']|["']$/g, '')
                .trim();
            }
            console.log('Title set to:', this.title);
            this.titleUpdated.emit(this.title);
            
            // Title is loaded, now fetch summary after a delay
            setTimeout(() => {
              this.getSummary();
            }, this.summaryInitialDelay);
          } else {
            // Title not available yet, continue polling
            this.titlePollingAttempts++;
            console.log(`Title polling attempt ${this.titlePollingAttempts} of ${this.maxTitlePollingAttempts}`);
            if (this.titlePollingAttempts >= this.maxTitlePollingAttempts) {
              console.warn('Max polling attempts reached, stopping title polling');
              if (this.titlePollingInterval) {
                clearInterval(this.titlePollingInterval);
              }
              // Even if title fails, try to get summary after a delay
              setTimeout(() => {
                this.getSummary();
              }, this.summaryInitialDelay);
            }
          }
        },
        error: (error: Error) => {
          console.error('Error fetching title:', error);
          if (this.titlePollingInterval) {
            clearInterval(this.titlePollingInterval);
          }
          this.title = '';
          // Even if title fails, try to get summary after a delay
          setTimeout(() => {
            this.getSummary();
          }, this.summaryInitialDelay);
        }
      });
    };

    // Initial fetch
    fetchTitle();

    // Set up polling with longer interval
    this.titlePollingInterval = setInterval(fetchTitle, this.pollingInterval);
  }

  getSummary() {
    if (!this.projectId) {
      console.warn('Project ID is not set, cannot fetch summary');
      return;
    }
    
    // Clear any existing polling interval
    if (this.summaryPollingInterval) {
      clearInterval(this.summaryPollingInterval);
    }

    // Reset polling attempts
    this.summaryPollingAttempts = 0;

    const fetchSummary = () => {
      this.ideaService.getSummary(this.projectId.toString()).subscribe({
        next: (response) => {
          console.log('Summary response:', response);
          if (response?.summary) {
            // Summary is available, stop polling
            if (this.summaryPollingInterval) {
              clearInterval(this.summaryPollingInterval);
            }

            this.summary = response.summary
              .replace(/\r\n/g, '\n')
              .replace(/^\s*[-*]\s/gm, '* ')
              .replace(/^\s*(\d+)\.\s/gm, '$1. ')
              .trim();
            console.log('Summary set to:', this.summary);
            this.summaryUpdated.emit(this.summary);
            
            // Summary is loaded, now fetch business case after a delay
            setTimeout(() => {
              this.getBusinessCase();
            }, this.businessCaseInitialDelay);
          } else {
            // Summary not available yet, continue polling
            this.summaryPollingAttempts++;
            console.log(`Summary polling attempt ${this.summaryPollingAttempts} of ${this.maxSummaryPollingAttempts}`);
            if (this.summaryPollingAttempts >= this.maxSummaryPollingAttempts) {
              console.warn('Max polling attempts reached, stopping summary polling');
              if (this.summaryPollingInterval) {
                clearInterval(this.summaryPollingInterval);
              }
              // Even if summary fails, try to get business case after a delay
              setTimeout(() => {
                this.getBusinessCase();
              }, this.businessCaseInitialDelay);
            }
          }
        },
        error: (error: Error) => {
          console.error('Error fetching summary:', error);
          if (this.summaryPollingInterval) {
            clearInterval(this.summaryPollingInterval);
          }
          this.summary = '';
          // Even if summary fails, try to get business case after a delay
          setTimeout(() => {
            this.getBusinessCase();
          }, this.businessCaseInitialDelay);
        }
      });
    };

    // Initial fetch
    fetchSummary();

    // Set up polling with longer interval (10 seconds)
    this.summaryPollingInterval = setInterval(fetchSummary, this.summaryPollingTime);
  }

  getBusinessCase() {
    if (!this.projectId) {
      console.warn('Project ID is not set, cannot fetch business case');
      return;
    }
    
    // Clear any existing polling interval
    if (this.businessCasePollingInterval) {
      clearInterval(this.businessCasePollingInterval);
    }

    // Reset polling attempts
    this.businessCasePollingAttempts = 0;

    const fetchBusinessCase = () => {
      this.ideaService.getBusinessCase(this.projectId.toString()).subscribe({
        next: (response) => {
          console.log('Business case response:', response);
          if (response?.businessCase) {
            // Business case is available, stop polling
            if (this.businessCasePollingInterval) {
              clearInterval(this.businessCasePollingInterval);
            }

            this.business_case = response.businessCase;
            console.log('Business case set to:', this.business_case);
            this.businessCaseUpdated.emit(this.business_case);
            
            // Schedule a repoll after a delay to ensure we have the most accurate data
            setTimeout(() => {
              this.repollBusinessCase();
            }, this.businessCasePollingTime);
          } else {
            // Business case not available yet, continue polling
            this.businessCasePollingAttempts++;
            console.log(`Business case polling attempt ${this.businessCasePollingAttempts} of ${this.maxBusinessCasePollingAttempts}`);
            if (this.businessCasePollingAttempts >= this.maxBusinessCasePollingAttempts) {
              console.warn('Max polling attempts reached, stopping business case polling');
              if (this.businessCasePollingInterval) {
                clearInterval(this.businessCasePollingInterval);
              }
            }
          }
        },
        error: (error: Error) => {
          console.error('Error fetching business case:', error);
          if (this.businessCasePollingInterval) {
            clearInterval(this.businessCasePollingInterval);
          }
          this.business_case = '';
        }
      });
    };

    // Initial fetch
    fetchBusinessCase();

    // Set up polling with longer interval (15 seconds)
    this.businessCasePollingInterval = setInterval(fetchBusinessCase, this.businessCasePollingTime);
  }
  
  // New method to repoll the business case after initial load
  repollBusinessCase() {
    if (!this.projectId) {
      console.warn('Project ID is not set, cannot repoll business case');
      return;
    }
    
    console.log('Repolling business case to ensure most accurate data');
    
    this.ideaService.getBusinessCase(this.projectId.toString()).subscribe({
      next: (response) => {
        if (response?.businessCase) {
          // Update business case if it has changed
          if (this.business_case !== response.businessCase) {
            console.log('Business case updated with more accurate data');
            this.business_case = response.businessCase;
            this.businessCaseUpdated.emit(this.business_case);
          } else {
            console.log('Business case data is already up to date');
          }
        } else {
          console.warn('Business case not available during repoll');
        }
      },
      error: (error: Error) => {
        console.error('Error repolling business case:', error);
      }
    });
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
          },
          error: (error: Error) => {
            console.error(error);
          }
        });
        break;
    }
  }

  getCleanTitle(): string {
    return this.title || '';
  }

  getCleanSummary(): string {
    return this.summary || 'Loading summary...';
  }

  getCleanBusinessCase(): string {
    return this.business_case || 'Loading business case...';
  }

  ngOnDestroy() {
    // Clean up polling intervals when component is destroyed
    if (this.titlePollingInterval) {
      clearInterval(this.titlePollingInterval);
    }
    if (this.summaryPollingInterval) {
      clearInterval(this.summaryPollingInterval);
    }
    if (this.businessCasePollingInterval) {
      clearInterval(this.businessCasePollingInterval);
    }
  }
}
