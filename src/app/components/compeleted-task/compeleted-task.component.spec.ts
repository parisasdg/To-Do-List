import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompeletedTaskComponent } from './compeleted-task.component';

describe('CompeletedTaskComponent', () => {
  let component: CompeletedTaskComponent;
  let fixture: ComponentFixture<CompeletedTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompeletedTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompeletedTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
