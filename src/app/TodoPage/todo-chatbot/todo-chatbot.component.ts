import {
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonSpinner
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, sendOutline } from 'ionicons/icons';
import {
  ChatbotService,
  ChatMessage,
  BotAction
} from '../../services/chatbot.service';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './todo-chatbot.component.html',
  styleUrls: ['./todo-chatbot.component.scss'],
  imports: [
    RouterLink,
    FormsModule,
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonSpinner
  ]
})
export class ChatbotPage implements AfterViewChecked {
  private readonly chatbotService = inject(ChatbotService);
  private readonly todoService = inject(TodoService);

  readonly messages = signal<ChatMessage[]>([
    {
      role: 'bot',
      text: 'Chào! Tao giúp m quản lý việc nè. Thử gõ "thêm việc họp 3h chiều mai" xem.'
    }
  ]);
  readonly isLoading = signal(false);

  inputText = '';

  @ViewChild('scrollBox') private scrollBox?: ElementRef<HTMLDivElement>;

  constructor() {
    addIcons({ trashOutline, sendOutline });
  }

  ngAfterViewChecked(): void {
    const el = this.scrollBox?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  async send(): Promise<void> {
    const text = this.inputText.trim();
    if (!text || this.isLoading()) {
      return;
    }

    this.messages.update((msgs) => [...msgs, { role: 'user', text }]);
    this.inputText = '';
    this.isLoading.set(true);

    try {
      const result = await this.chatbotService.sendMessage(
        text,
        this.todoService.todos()
      );

      this.runActions(result.actions);

      this.messages.update((msgs) => [
        ...msgs,
        { role: 'bot', text: result.reply }
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
      this.messages.update((msgs) => [
        ...msgs,
        {
          role: 'bot',
          text: 'Gọi AI bị lỗi rồi. Kiểm tra API key Gemini với mạng rồi thử lại nhé.'
        }
      ]);
    } finally {
      this.isLoading.set(false);
    }
  }

  clearChat(): void {
    this.chatbotService.clearHistory();
    this.messages.set([]);
  }

  // thuc hien cac hanh dong AI yeu cau len danh sach todo that
  private runActions(actions: BotAction[]): void {
    for (const action of actions) {
      if (action.type === 'add_todo' && action.title) {
        this.todoService.addTodo(
          action.title,
          action.description ?? '',
          action.priority ?? 'medium',
          action.dueDate ? new Date(action.dueDate) : undefined
        );
      } else if (action.type === 'complete_todo' && action.todoId) {
        const todo = this.todoService.getTodoById(action.todoId);
        if (todo && !todo.completed) {
          this.todoService.toggleTodo(action.todoId);
        }
      } else if (action.type === 'delete_todo' && action.todoId) {
        this.todoService.deleteTodo(action.todoId);
      }
    }
  }
}
