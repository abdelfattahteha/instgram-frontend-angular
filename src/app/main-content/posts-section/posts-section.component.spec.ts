import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsSectionComponent } from './posts-section.component';

describe('PostsSectionComponent', () => {
  let component: PostsSectionComponent;
  let fixture: ComponentFixture<PostsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
