import { HospedagemService } from "./../../services/hospedagem.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Guest } from "src/app/models/guest.model";
import * as moment from "moment";

@Component({
  selector: "app-check-in",
  templateUrl: "./check-in.component.html",
  styleUrls: ["./check-in.component.css"],
})
export class CheckInComponent implements OnInit {
  checkInForm!: FormGroup;
  newGuest!: Guest;
  novoCheckIn = false;
  errorTip = "Campo obrigatório";

  constructor(
    private formBuilder: FormBuilder,
    private hospedagemService: HospedagemService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.checkInForm = this.formBuilder.group({
      nome: [
        { value: null, disabled: false },
        [Validators.required, Validators.minLength(4)],
      ],
      cpf: [{ value: null, disabled: false }, [Validators.required]],
      telefone: [{ value: null, disabled: false }, [Validators.required]],
      dataEntrada: [{ value: null, disabled: false }, [Validators.required]],
      dataSaida: [{ value: null, disabled: false }, [Validators.required]],
      veiculo: [{ value: null, disabled: false }, [Validators.required]],
    });
  }

  iniciaCheckIn(): void {
    this.novoCheckIn = true;
  }

  cancelarCheckIn(): void {
    this.novoCheckIn = false;
    this.checkInForm.reset();
  }

  calculaPreco(): number {
    const diariaDiaDeSemana = 120;
    const diariaFinalDeSemana = 150;
    const vagaGaragemDiaDeSemana = 15;
    const vagaGaragemFinalDeSemana = 20;
    let valorTotal: number = 0;

    const dias = moment(this.checkInForm.get("dataSaida")?.value).diff(
      moment(this.checkInForm.get("dataEntrada")?.value),
      "days"
    );

    if (this.checkInForm.get("veiculo")?.value == "Sim") {
      valorTotal = (diariaDiaDeSemana + vagaGaragemDiaDeSemana) * dias;
      return valorTotal;
    }

    if (this.checkInForm.get("veiculo")?.value == "Não") {
      valorTotal = diariaDiaDeSemana * dias;
      return valorTotal;
    }

    return valorTotal;
  }

  validaDatas(): boolean {
    const datasInvalidas = moment(
      this.checkInForm.get("dataSaida")?.value
    ).isBefore(this.checkInForm.get("dataEntrada")?.value);
    const dataEntradaInvalida = moment(
      this.checkInForm.get("dataEntrada")?.value
    ).isBefore(new Date());

    if (datasInvalidas) {
      this.notification.error(
        "Datas Inválidas",
        "A data de saída deve ser posterior à data de entrada."
      );
      this.checkInForm.get("dataSaida")?.setErrors([Validators.requiredTrue]);
      return false;
    }

    if (dataEntradaInvalida) {
      this.notification.error(
        "Datas Inválidas",
        "A data de entrada deve ser igual ou posterior à data atual."
      );
      this.checkInForm.get("dataEntrada")?.setErrors([Validators.requiredTrue]);
      return false;
    }

    return true;
  }

  submitForm(): void {
    for (const i in this.checkInForm.controls) {
      this.checkInForm.controls[i].markAsDirty();
      this.checkInForm.controls[i].updateValueAndValidity();
    }

    this.newGuest = {
      nome: this.checkInForm.get("nome")?.value,
      cpf: this.checkInForm.get("cpf")?.value,
      telefone: this.checkInForm.get("telefone")?.value,
      checkIn: this.checkInForm.get("dataEntrada")?.value,
      checkOut: this.checkInForm.get("dataSaida")?.value,
      veiculo: this.checkInForm.get("veiculo")?.value === "Sim" ? true : false,
      preco: this.calculaPreco(),
    };

    if (this.checkInForm.valid && this.validaDatas()) {
      this.hospedagemService.create(this.newGuest).subscribe(() => {
        this.novoCheckIn = false;
        this.checkInForm.reset();
        this.notification.success(
          "Check-in realizado",
          "Check-in realizado com sucesso."
        );
        location.reload();
      });
    } else {
      this.notification.error(
        "Erro no formulário",
        "Erro no preechimento do formulário."
      );
    }
  }
}
