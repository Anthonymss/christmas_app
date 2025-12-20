import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {
  private subject = new Subject<any>();

  emit(event: any) {
    this.subject.next(event);
  }

  stream() {
    return this.subject.asObservable();
  }
}
