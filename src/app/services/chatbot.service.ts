import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from '../models/todo.model';

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export interface BotAction {
  type: 'add_todo' | 'complete_todo' | 'delete_todo';
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string | null;
  todoId?: string;
}

export interface BotResponse {
  reply: string;
  actions: BotAction[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiUrl =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';

  private history: { role: string; text: string }[] = [];

  constructor(private readonly http: HttpClient) {}

  async sendMessage(userText: string, todos: Todo[]): Promise<BotResponse> {
    const now = new Date();
    const todayStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    const todoContext = todos.map((t) => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      priority: t.priority,
      dueDate: t.dueDate
        ? new Date(t.dueDate).toISOString().slice(0, 10)
        : null
    }));

    const systemPrompt =
      'Bạn là trợ lý quản lý công việc trong app Todo, nói tiếng Việt thân thiện, ngắn gọn. ' +
      `Hôm nay là ${todayStr}. ` +
      `Danh sách todo hiện tại (JSON): ${JSON.stringify(todoContext)}. ` +
      'Nhiệm vụ: đọc tin nhắn của user, quyết định cần làm gì với danh sách todo. ' +
      'LUÔN trả về đúng 1 JSON duy nhất, không thêm chữ giải thích bên ngoài, theo format: ' +
      '{"reply": "câu trả lời tiếng Việt cho user", "actions": [' +
      '{"type": "add_todo", "title": "...", "description": "...", "priority": "low|medium|high", "dueDate": "YYYY-MM-DD hoặc null"}, ' +
      '{"type": "complete_todo", "todoId": "id của todo"}, ' +
      '{"type": "delete_todo", "todoId": "id của todo"}]}. ' +
      'Quy tắc: chỉ dùng "actions" khi user muốn thêm/hoàn thành/xóa việc, hỏi đáp thông thường thì actions là mảng rỗng. ' +
      'dueDate: từ "mai", "tuần sau", "3h chiều mai" thì tự suy ra ngày YYYY-MM-DD dựa vào hôm nay, không có hạn thì null. ' +
      'priority mặc định là "medium" nếu user không nói. ' +
      'Khi user nói "xong việc A" thì tìm todo có title gần giống nhất và dùng complete_todo với đúng todoId.';

    this.history.push({ role: 'user', text: userText });
    if (this.history.length > 10) {
      this.history = this.history.slice(-10);
    }

    const contents = this.history.map((m) => ({
      role: m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.7
      }
    };

    const headers = new HttpHeaders({
  'x-goog-api-key': environment.geminiApiKey,
  'Content-Type': 'application/json'
});

    const response = await firstValueFrom(
  this.http.post<any>(
    this.apiUrl,
    body,
    { headers }
    )
    );

    const rawText: string =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    this.history.push({ role: 'bot', text: rawText });
    if (this.history.length > 10) {
      this.history = this.history.slice(-10);
    }

    try {
      const parsed = JSON.parse(rawText) as BotResponse;
      return {
        reply: parsed.reply ?? 'Ok nhé',
        actions: Array.isArray(parsed.actions) ? parsed.actions : []
      };
    } catch {
      return {
        reply: rawText || 'Có lỗi xảy ra, thử lại nhé',
        actions: []
      };
    }
  }

  clearHistory(): void {
    this.history = [];
  }
}
