import { catchError } from "rxjs/operators";
import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Guest } from "src/app/models/guest.model";
import { HospedagemService } from "src/app/services/hospedagem.service";

@Component({
  selector: "app-check-out",
  templateUrl: "./check-out.component.html",
  styleUrls: ["./check-out.component.css"],
})
export class CheckOutComponent {
  checkOutForm!: FormGroup;
  errorTip = "Campo obrigatório";
  activeId!: string;

  guest!: Guest;
  diarias!: number;
  possuiVeiculo!: string;
  totalDespesas!: number;

  constructor(
    private formBuilder: FormBuilder,
    private hospedagemService: HospedagemService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.load();
  }

  createForm(): void {
    this.checkOutForm = this.formBuilder.group({
      nome: [{ value: null, disabled: true }],
      cpf: [{ value: null, disabled: true }],
      telefone: [{ value: null, disabled: true }],
      dataEntrada: [{ value: null, disabled: true }],
      dataSaida: [{ value: null, disabled: true }],
      veiculo: [{ value: null, disabled: true }],
    });
  }

  load(): void {
    let id = this.route.snapshot.paramMap.get("id");
    this.activeId = id as string;
    this.hospedagemService.readById(id!).subscribe((response) => {
      let dataAtual = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
      this.checkOutForm.get("nome")?.setValue(response.nome);
      this.checkOutForm.get("cpf")?.setValue(response.cpf);
      this.checkOutForm.get("telefone")?.setValue(response.telefone);
      this.checkOutForm.get("dataEntrada")?.setValue(response.checkIn);
      this.checkOutForm.get("dataSaida")?.setValue(dataAtual);
      this.checkOutForm
        .get("veiculo")
        ?.setValue(response.veiculo == false ? "Não" : "Sim");
    });
  }

  calculaPreco(): number {
    const diariaDiaDeSemana = 120;
    const diariaFinalDeSemana = 150;
    const vagaGaragemDiaDeSemana = 15;
    const vagaGaragemFinalDeSemana = 20;
    let valorTotal: number = 0;
    let diasTotais;

    const horaSaida = moment(this.checkOutForm.get("dataSaida")?.value).hour();

    if (horaSaida <= 16) {
      const dias = moment(this.checkOutForm.get("dataSaida")?.value).diff(
        moment(this.checkOutForm.get("dataEntrada")?.value),
        "days"
      );
      diasTotais = dias;
    } else {
      const dias = moment(this.checkOutForm.get("dataSaida")?.value).diff(
        moment(this.checkOutForm.get("dataEntrada")?.value),
        "days"
      );
      diasTotais = dias + 1;
    }

    this.diarias = diasTotais;
    this.possuiVeiculo = this.checkOutForm.get("veiculo")?.value;

    if (this.checkOutForm.get("veiculo")?.value == "Sim") {
      valorTotal = (diariaDiaDeSemana + vagaGaragemDiaDeSemana) * diasTotais;
      this.totalDespesas = valorTotal;
      return valorTotal;
    }

    if (this.checkOutForm.get("veiculo")?.value == "Não") {
      valorTotal = diariaDiaDeSemana * diasTotais;
      this.totalDespesas = valorTotal;
      return valorTotal;
    }

    return valorTotal;
  }

  submitForm(): void {
    const checkOutGuest: Guest = {
      id: parseInt(this.activeId),
      nome: this.checkOutForm.get("nome")?.value,
      cpf: this.checkOutForm.get("cpf")?.value,
      telefone: this.checkOutForm.get("telefone")?.value,
      checkIn: this.checkOutForm.get("dataEntrada")?.value,
      checkOut: this.checkOutForm.get("dataSaida")?.value,
      veiculo: this.checkOutForm.get("veiculo")?.value === "Sim" ? true : false,
      preco: this.calculaPreco(),
    };

    console.log(checkOutGuest);

    this.hospedagemService.update(checkOutGuest).subscribe(() => {
      console.log(checkOutGuest);
      this.notification.success(
        "Check out realizado",
        "Check out realizado com sucesso."
      );
      this.router.navigate(["/"]);
    });
  }
}
