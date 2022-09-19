import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cuenta } from '../cuenta';
import { ToastrService } from 'ngx-toastr';
import { CuentaService } from '../cuenta.service';

@Component({
  selector: 'app-cuenta-consulta',
  templateUrl: './cuenta-consulta.component.html',
  styleUrls: ['./cuenta-consulta.component.css']
})
export class CuentaConsultaComponent implements OnInit {
  userId: number
  token: string
  saldo: number
  constructor(private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService,
    private cuentaService: CuentaService,) {
   }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken

    }
  }

  cerrar() {

    this.routerPath.navigate([`/cuenta/${this.userId}/${this.token}`])
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess(cuenta: Cuenta) {
    this.toastr.success(`El deposito fue registrado`, "Creación exitosa");
  }

}
