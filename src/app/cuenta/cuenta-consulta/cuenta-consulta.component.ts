import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cuenta } from '../cuenta';
import { ToastrService } from 'ngx-toastr';
import { CuentaService } from '../cuenta.service';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cuenta-consulta',
  templateUrl: './cuenta-consulta.component.html',
  styleUrls: ['./cuenta-consulta.component.css']
})
export class CuentaConsultaComponent implements OnInit {
  userId: number
  token: string
  saldo: any
  cuentas: Array<Cuenta>
  mostrarCuentas: Array<Cuenta>
  pipe = new DatePipe('en-US');
  constructor(private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService,
    private cuentaService: CuentaService,
    private usuarioService: UsuarioService,
    ) {
   }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getApostador()
      this.getMovimientos()

    }
  }

  getMovimientos(): void {
    this.cuentaService.getMovimientos(this.userId, this.token)
      .subscribe(datos => {
        this.cuentas = datos
        this.mostrarCuentas = datos
      },
        error => {
          console.log(error)
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
