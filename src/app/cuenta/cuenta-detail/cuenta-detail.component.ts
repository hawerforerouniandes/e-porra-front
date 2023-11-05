import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/usuario/usuario.service';

@Component({
  selector: 'app-cuenta-detail',
  templateUrl: './cuenta-detail.component.html',
  styleUrls: ['./cuenta-detail.component.css']
})
export class CuentaDetailComponent implements OnInit {

  saldo: any;
  token: string
  userId: number
  usuario: any


  constructor(
    private usuarioService: UsuarioService,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
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

  goDepositar() {
    const userId = parseInt(this.router.snapshot.params.userId)
    const token = this.router.snapshot.params.userToken

    this.routerPath.navigate([`/cuenta/crear/${userId}/${token}`])

  }

  goRetirar() {
    const userId = parseInt(this.router.snapshot.params.userId)
    const token = this.router.snapshot.params.userToken

    this.routerPath.navigate([`/cuenta/retirar/${userId}/${token}`])

  }


  verMovimientos() {
    const userId = parseInt(this.router.snapshot.params.userId)
    const token = this.router.snapshot.params.userToken
    this.routerPath.navigate([`/cuenta/consultar/${userId}/${token}`])


  }
  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showError(error: string) {
    this.toastr.error(error, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`La apuesta fue eliminada`, "Eliminada exitosamente");
  }

}
