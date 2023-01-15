import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMaskModule } from "ngx-mask";
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { CheckInComponent } from "./pages/check-in/check-in.component";
import { CheckOutComponent } from "./pages/check-out/check-out.component";
import { RevisaoComponent } from "./pages/revisao/revisao.component";

import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzListModule } from "ng-zorro-antd/list";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { registerLocaleData } from "@angular/common";
import pt from "@angular/common/locales/pt";
import { TableComponent } from "./components/table/table.component";
import { NZ_I18N, pt_BR } from "ng-zorro-antd/i18n";

registerLocaleData(pt);

@NgModule({
  declarations: [
    AppComponent,
    CheckInComponent,
    CheckOutComponent,
    RevisaoComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzCardModule,
    NzPageHeaderModule,
    NzLayoutModule,
    NzButtonModule,
    NzAlertModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzDividerModule,
    NzEmptyModule,
    NzFormModule,
    NzGridModule,
    NzIconModule,
    NzInputNumberModule,
    NzInputModule,
    NzListModule,
    NzNotificationModule,
    NzRadioModule,
    NzSelectModule,
    NzSwitchModule,
    NzUploadModule,
    NzModalModule,
    NzTableModule,
    NzPaginationModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [{ provide: NZ_I18N, useValue: pt_BR }],
  bootstrap: [AppComponent],
})
export class AppModule {}
