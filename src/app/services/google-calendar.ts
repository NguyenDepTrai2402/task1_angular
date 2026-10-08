import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {

  private readonly clientId =
    '884254055134-efphp54cso4vej3karb1f2hbmfmq79es.apps.googleusercontent.com';

  private readonly scope =
    'https://www.googleapis.com/auth/calendar.events';

  private readonly calendarApiUrl =
    'https://www.googleapis.com/calendar/v3/calendars/primary/events';

  private accessToken: string | null = null;

  constructor(private readonly http: HttpClient) {}

  async signIn(): Promise<void> {
    return new Promise((resolve, reject) => {

      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: this.scope,

        callback: (response: any) => {
          if (response.error) {
            reject(response);
            return;
          }

          this.accessToken = response.access_token;
          resolve();
        }
      });

      tokenClient.requestAccessToken();
    });
  }

  async addTodoToCalendar(
    title: string,
    description: string | undefined,
    dueDate: Date
  ): Promise<string> {

    if (!this.accessToken) {
      await this.signIn();
    }

    const startDate = this.formatDate(dueDate);

    const endDate = this.formatDate(
      new Date(dueDate.getTime() + 24 * 60 * 60 * 1000)
    );

    const event = {
      summary: title,
      description: description || '',
      start: {
        date: startDate
      },
      end: {
        date: endDate
      }
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    const response = await firstValueFrom(
      this.http.post<{ id: string }>(
        this.calendarApiUrl,
        event,
        { headers }
      )
    );

    return response.id;
  }

  async deleteCalendarEvent(eventId: string): Promise<void> {

    if (!this.accessToken) {
      await this.signIn();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`
    });

    await firstValueFrom(
      this.http.delete(
        `${this.calendarApiUrl}/${eventId}`,
        { headers }
      )
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}