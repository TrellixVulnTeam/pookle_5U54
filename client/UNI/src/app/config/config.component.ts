import { Component, OnInit } from '@angular/core';
import { ConfigService } from './config.service';
import { Config } from './config';

@Component({
  selector: 'config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  constructor(private configService:ConfigService) { }

  ngOnInit() {
  }
  config: Config;

  showConfig() {
    this.configService.getConfig()
      .subscribe((data: Config) => this.config = { ...data });
  }
}
