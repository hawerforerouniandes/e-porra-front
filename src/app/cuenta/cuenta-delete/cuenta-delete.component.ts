import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cuenta } from '../cuenta';
import { CuentaService } from '../cuenta.service';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-cuenta-delete',
  templateUrl: './cuenta-delete.component.html',
  styleUrls: ['./cuenta-delete.component.css']
})
export class CuentaDeleteComponent implements OnInit {

  userId: number
  token: string
  cuentaForm: FormGroup
  usuario: any
  saldo: any

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService,
    private cuentaService: CuentaService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.cuentaForm = this.formBuilder.group({
        valor: [0, [Validators.required, Validators.min(0.1),]]
      })

      this.usuario = localStorage.getItem('usuario')
      this.usuario = JSON.parse(this.usuario)

      this.getApostador();

    }
  }

  getApostador() {
    this.usuarioService.getApostador(this.userId, this.token)
    .subscribe(apostador => {
      this.saldo = apostador.saldo
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

  retirarDinero(newCuenta: Cuenta) {
    newCuenta.tipo = false;
    let date = new Date();
    newCuenta.fecha_registro = date;
    newCuenta.numero_tarjeta = ""
    newCuenta.valor = newCuenta.valor * (-1)
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
    this.toastr.success(`El retiro fue registrado`, "Retiro exitoso");
  }

}
