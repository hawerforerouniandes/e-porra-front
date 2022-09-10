import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cuenta } from '../cuenta';
import { CuentaService } from '../cuenta.service';

@Component({
  selector: 'app-cuenta-create',
  templateUrl: './cuenta-create.component.html',
  styleUrls: ['./cuenta-create.component.css']
})
export class CuentaCreateComponent implements OnInit {

  userId: number
  token: string
  cuentaForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService,
    private cuentaService: CuentaService,
  ) { }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.cuentaForm = this.formBuilder.group({
        valor: [0, [Validators.required]],
        numero_tarjeta: [0, [Validators.required]]
      })
    }
  }


  depositarDinero(newCuenta: Cuenta) {
    newCuenta.tipo = "Deposito";
    let date = new Date();
    newCuenta.fecha_registro = date.toString();
    this.cuentaService.depositarDinero(this.userId, this.token, newCuenta)
      .subscribe(cuenta => {
        this.showSuccess(cuenta)
        this.cuentaForm.reset()
        this.routerPath.navigate([`/cuenta/${this.userId}/${this.token}`])
      },
        error => {
          if (error.statusText === "UNAUTHORIZED") {
            this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
          }
          else if (error.statusText === "UNPROCESSABLE ENTITY") {
            this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
          }
          else {
            this.showError("Ha ocurrido un error. " + error.message)
          }
        })
  }

  cancelCreate() {
    this.cuentaForm.reset()
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
