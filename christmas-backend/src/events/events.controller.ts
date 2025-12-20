import { Controller, Sse } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse()
  sse(): Observable<any> {
    return this.eventsService.stream().pipe(
      map(data => ({ data })),
    );
  }
}
