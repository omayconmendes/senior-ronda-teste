import { Guest } from './../../models/guest.model';
import { Component, Input } from '@angular/core';
import { HospedagemService } from 'src/app/services/hospedagem.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { isTemplateRef } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  guests: Guest[] = []

  constructor(
    private hospedagemService: HospedagemService,
  ) {}

  ngOnInit(): void {
    this.hospedagemService.read().subscribe( (response: Guest[]) => {
      this.guests = response
      this.guests.forEach((item) => {
        item.checkIn = moment(item.checkIn).format('DD/MM/YYYY')
        item.checkOut = moment(item.checkOut).format('DD/MM/YYYY')
      })
    });
  }

}
