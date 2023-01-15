import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Guest } from 'src/app/models/guest.model';
import { HospedagemService } from 'src/app/services/hospedagem.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent {

  checkInForm!: FormGroup;
  errorTip = 'Campo obrigatório';
  activeId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private hospedagemService: HospedagemService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.load();
    this.createForm();
  }

  createForm(): void {
    this.checkInForm = this.formBuilder.group({
      nome: [{ value: null, disabled: true}, [Validators.required, Validators.minLength(4)]],
      cpf: [{ value: null, disabled: true}, [Validators.required]],
      telefone: [{ value: null, disabled: true}, [Validators.required]],
      dataEntrada: [{ value: null, disabled: true}, [Validators.required]],
      dataSaida: [{ value: null, disabled: true}, [Validators.required]],
      veiculo: [{ value: null, disabled: true}, [Validators.required]],
    })
  }

  load(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.activeId = id as string;
    this.hospedagemService.readById(id!).subscribe( response => {
      this.checkInForm.get('nome')?.setValue(response.nome);
      this.checkInForm.get('cpf')?.setValue(response.cpf);
      this.checkInForm.get('telefone')?.setValue(response.telefone);
      this.checkInForm.get('dataEntrada')?.setValue(response.checkIn);
      this.checkInForm.get('dataSaida')?.setValue(moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"));
      this.checkInForm.get('veiculo')?.setValue(
        response.veiculo == false ? "Não" : "Sim"
      );
    }); 
  }

  onChangeCheckIn(item: string): void {
    console.log(item)
    const dataEntrada = moment(this.checkInForm.get('dataEntrada')?.value).weekday()
    console.log(dataEntrada);

  }

  onChangeCheckOut(item: string): void {
    console.log(item);
  }

  calculaPreco(): number {
    const diariaDiaDeSemana = 120;
    const diariaFinalDeSemana = 150;
    const vagaGaragemDiaDeSemana = 15;
    const vagaGaragemFinalDeSemana = 20;
    let valorTotal: number = 0

    const dias = moment(this.checkInForm.get('dataSaida')?.value).diff(moment(this.checkInForm.get('dataEntrada')?.value), 'days')
    console.log(dias);
    
    if(this.checkInForm.get('veiculo')?.value == "Sim") {
      valorTotal = (diariaDiaDeSemana + vagaGaragemDiaDeSemana) * dias
      return valorTotal;
    }

    if(this.checkInForm.get('veiculo')?.value == "Não") {
      valorTotal = diariaDiaDeSemana * dias
      return valorTotal;
    }

    return valorTotal;
  }

  validaDatas(): boolean {
    const datasInvalidas = moment(this.checkInForm.get('dataSaida')?.value).isBefore(this.checkInForm.get('dataEntrada')?.value)
    const dataEntradaInvalida = moment(this.checkInForm.get('dataEntrada')?.value).isBefore(new Date())
    
    if(datasInvalidas){
      this.notification.error('Datas Inválidas', 'A data de saída deve ser posterior à data de entrada.')
      this.checkInForm.get('dataSaida')?.setErrors([Validators.requiredTrue]);
      return false
    }

    if(dataEntradaInvalida) {
      this.notification.error('Datas Inválidas', 'A data de entrada deve ser igual ou posterior à data atual.')
      this.checkInForm.get('dataEntrada')?.setErrors([Validators.requiredTrue]);
      return false
    }

    return true;
  }

  submitForm(): void {

    for (const i in this.checkInForm.controls) {
      this.checkInForm.controls[i].markAsDirty();
      this.checkInForm.controls[i].updateValueAndValidity();
    }

    const newGuest: Guest = {
      id: parseInt(this.activeId),
      nome: this.checkInForm.get('nome')?.value,
      cpf: this.checkInForm.get('cpf')?.value,
      telefone: this.checkInForm.get('telefone')?.value,
      checkIn: this.checkInForm.get('dataEntrada')?.value,
      checkOut: this.checkInForm.get('dataSaida')?.value,
      veiculo: this.checkInForm.get('veiculo')?.value === "Sim" ? true : false,
      preco: this.calculaPreco()
    }

    if (this.checkInForm.valid && this.validaDatas()) {
      this.hospedagemService.update(newGuest).subscribe(() => {
        this.checkInForm.reset();
        this.notification.success('Informações Atualizadas', 'Informações atualizadas com sucesso.')
        this.router.navigate(['/']);
      })
    } else {
      this.notification.error('Erro no formulário', 'Erro no preechimento do formulário.')
      console.log('Erro na validação do formulário. Preencha corretamente.')
    }    
  }

}
