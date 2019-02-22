import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  errorMessage: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe( (params: Params) => {
      let errorStatus = params['status'];
      if (errorStatus == 404) {
        this.errorMessage = "Error 404, Page Not Found."
      } else if (errorStatus == 500) {
        this.errorMessage = "Something wrong happen, sorry for this";
      }
    })
  }

}
