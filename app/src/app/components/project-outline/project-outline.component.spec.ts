import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOutlineComponent } from './project-outline.component';

describe('ProjectOutlineComponent', () => {
  let component: ProjectOutlineComponent;
  let fixture: ComponentFixture<ProjectOutlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectOutlineComponent]
    });
    fixture = TestBed.createComponent(ProjectOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
