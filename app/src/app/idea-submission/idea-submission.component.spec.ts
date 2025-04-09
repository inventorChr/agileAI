import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaSubmissionComponent } from './idea-submission.component';

describe('IdeaSubmissionComponent', () => {
  let component: IdeaSubmissionComponent;
  let fixture: ComponentFixture<IdeaSubmissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaSubmissionComponent]
    });
    fixture = TestBed.createComponent(IdeaSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
