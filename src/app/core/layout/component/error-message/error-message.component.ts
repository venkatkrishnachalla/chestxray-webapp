import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

@Component({
  selector: 'cxr-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent implements OnInit {
  showError: boolean;
  errorMessage: string;
  errorStatus: any;

  constructor(private eventEmitterService: EventEmitterService) {}

  ngOnInit(): void {
    this.eventEmitterService.invokeDisplayErrorMessage.subscribe(
      (errorResponse) => {
        console.log('errorResponse.data.status', errorResponse.data.status);
        this.showError = true;
        this.errorStatus = errorResponse.data;
        switch (errorResponse.data.status) {
          case 404:
            this.errorMessage = 'Not Found';
            break;
          case 204:
            this.errorMessage = 'No Content';
            break;
          case 401:
            this.errorMessage = 'Unauthorized';
            break;
          case 403:
            this.errorMessage = 'Forbidden';
            break;
          case 500:
            this.errorMessage = 'Internal Server Error';
            break;

          default:
            break;
        }
        return (this.errorMessage = errorResponse.error.error.message);
      }
    );
  }
}
