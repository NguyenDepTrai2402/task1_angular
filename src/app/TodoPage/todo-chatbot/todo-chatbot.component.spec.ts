import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoChatbotComponent } from './todo-chatbot.component';

describe('TodoChatbotComponent', () => {
  let component: TodoChatbotComponent;
  let fixture: ComponentFixture<TodoChatbotComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
