import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../usuario.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-usuario-update',
  templateUrl: './usuario-update.component.html',
  styleUrls: ['./usuario-update.component.css']
})
export class UsuarioUpdateComponent implements OnInit {

  helper = new JwtHelperService();
  usuarioForm: FormGroup;

  token: string;
  userId: number;
  usuario: any;
  saldo: any;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
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
    
    this.usuarioForm = this.formBuilder.group({
      usuario: [this.usuario.usuario, []],
      numero_tarjeta: [this.usuario.numero_tarjeta, [Validators.required, Validators.maxLength(50)]],
      email: [this.usuario.email, [Validators.required, Validators.maxLength(50), Validators.email]],
      nombres: [this.usuario.nombres, [Validators.required, Validators.maxLength(100)]],
      apellidos: [this.usuario.apellidos, [Validators.required, Validators.maxLength(100)]],
      contrasena: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(4)]],
      confirmPassword: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(4)]]
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

  actualizarUsuario() {
    this.usuarioService.userUpdate(
        this.usuarioForm.value,
        this.userId,
        this.token
      )
      .subscribe(res => {
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        //const decodedToken = this.helper.decodeToken(res.token);

        this.showSuccess()
      },
        error => {
          if (error.error.message != undefined || error.error.message != null)
          {
            this.showError(`Ha ocurrido un error: ${error.error.message}`)
          }else {
            this.showError(`Ha ocurrido un error: ${error.message}`)
          }
        })
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showError(error: string) {
    this.toastr.error(error, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`Editar Perfil`, "exitosamente");
  }

}
