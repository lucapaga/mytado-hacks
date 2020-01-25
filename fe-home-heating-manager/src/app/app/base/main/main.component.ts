import { Component, OnInit } from '@angular/core';
import { MytadoDirectLoginService } from 'src/app/scvs/mytado-direct-login.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private loginService: MytadoDirectLoginService) { }

  ngOnInit() {
  }

  doLogin() {
    this.loginService.login("omissis", "omissis").subscribe(mta => {
      console.log("Authorization Object: ", mta);
    });
  }

}
