import { Guest } from './../../models/guest.model';
import { Component } from '@angular/core';
import { HospedagemService } from 'src/app/services/hospedagem.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  consultaForm!: FormGroup;
  guests: Guest[] = []
  listOfDisplayGuests!: Guest[]

  constructor(
    private formBuilder: FormBuilder,
    private hospedagemService: HospedagemService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.load()
  }

  createForm(): void {
    this.consultaForm = this.formBuilder.group({
      filtro: [{ value: null, disabled: false}],
    })
  }

  load(): void {
    this.hospedagemService.read().subscribe( (response: Guest[]) => {
      this.guests = response
      this.guests.forEach((item) => {
        item.checkIn = moment(item.checkIn).format('DD/MM/YYYY')
        item.checkOut = moment(item.checkOut).format('DD/MM/YYYY')
      })
    });


  }

  onChangeFiltro(item: any): Array<Guest> {
    const dataAtual = new Date()

    if (item == 'ainda presentes') {
      this.guests = this.guests.filter((i: Guest) => i.checkOut > moment(dataAtual).format('DD/MM/YYYY'))
      return this.guests
    }

    if (item == 'deixaram o hotel') {
      this.guests = this.guests.filter((i: Guest) => i.checkOut < moment(dataAtual).format('DD/MM/YYYY'))
      return this.guests
    }

    return this.guests
  }

}
