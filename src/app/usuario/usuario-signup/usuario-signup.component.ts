import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../usuario.service';



@Component({
  selector: 'app-usuario-signup',
  templateUrl: './usuario-signup.component.html',
  styleUrls: ['./usuario-signup.component.css']
})
export class UsuarioSignupComponent implements OnInit {

  helper = new JwtHelperService();
  usuarioForm: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.usuarioForm = this.formBuilder.group({
      usuario: ["", [Validators.required, Validators.maxLength(50)]],
      nombres: ["", [Validators.required, Validators.maxLength(100)]],
      apellidos: ["", [Validators.required, Validators.maxLength(100)]],
      password: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(4)]],
      confirmPassword: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(4)]]
    })
  }

  registrarUsuario() {
    this.usuarioService.userSignUp(
      this.usuarioForm.get('usuario')?.value,
      this.usuarioForm.get('password')?.value,
      this.usuarioForm.get('nombres')?.value,
      this.usuarioForm.get('apellidos')?.value
      )
      .subscribe(res => {
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        const decodedToken = this.helper.decodeToken(res.token);
        this.router.navigate([`/carreras/${decodedToken.sub}/${res.token}`])

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

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showSuccess() {
    this.toastr.success(`Se ha registrado exitosamente`, "Registro exitoso");
  }

}
