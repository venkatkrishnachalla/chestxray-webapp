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

  /*** init function, it will handle the error messages ***/
  ngOnInit(): void {
    this.eventEmitterService.invokeDisplayErrorMessage.subscribe(
      (errorResponse) => {
        this.showError = true;
        this.errorStatus = 'Error' + ' ' + errorResponse.data.status;
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
          case 415:
            this.errorMessage = 'Method Not Allowed';
            break;
          case 415:
            this.errorMessage = 'Unsupported Media Type';
            break;
          case 500:
            this.errorMessage = 'Internal Server Error';
            break;
          case 501:
            this.errorMessage = 'Not Implemented';
            break;
          case 502:
            this.errorMessage = 'Bad Gateway';
            break;
          case 503:
            this.errorMessage = 'Service Unavailable';
            break;
          case 504:
            this.errorMessage = 'Gateway Timeout';
            break;

          default:
            this.errorStatus = '';
            this.errorMessage = 'Unknown Error Occurred';
            break;
        }
        return (this.errorMessage = errorResponse.error.error.message);
      }
    );
  }
}
