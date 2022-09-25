import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera, Competidor } from 'src/app/carrera/carrera';
import { CarreraService } from 'src/app/carrera/carrera.service';
import { Apuesta } from '../apuesta';
import { ApuestaService } from '../apuesta.service';
import { Usuario } from 'src/app/usuario/usuario';
import { UsuarioService } from 'src/app/usuario/usuario.service';


@Component({
  selector: 'app-apuesta-create',
  templateUrl: './apuesta-create.component.html',
  styleUrls: ['./apuesta-create.component.css']
})
export class ApuestaCreateComponent implements OnInit {

  userId: number
  token: string
  apuestaForm: FormGroup
  carreras: Array<Carrera>
  competidores: Array<Competidor>
  apostadores: Array<Usuario>
  usuario: any;
  es_apostador: boolean;

  constructor(
    private apuestaService: ApuestaService,
    private carreraService: CarreraService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.usuario = localStorage.getItem('usuario');
      this.usuario = JSON.parse(this.usuario);

      let valorApostador = this.usuario.es_apostador ? this.userId : "";

      this.token = this.router.snapshot.params.userToken
      this.apuestaForm = this.formBuilder.group({
        id_carrera: ["", [Validators.required]],
        id_competidor: ["", [Validators.required]],
        id_apostador: [{"value": valorApostador, disabled: this.usuario.es_apostador}, [Validators.required]],
        valor_apostado: [0, [Validators.required]]
      })
      this.getCarreras()
      this.getApostadores()
    }
  }

  onCarreraSelect(event: any): void {
    if (event != null && event != "") {
      var carreraSeleccionada = this.carreras.filter(x => x.id == event)[0]
      this.competidores = carreraSeleccionada.competidores
    }
  }

  getCarreras(): void {
    this.carreraService.getCarrerasAll(this.token)
      .subscribe(carreras => {
        this.carreras = carreras
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

  getApostadores(): void {
    this.usuarioService.getApostadores(this.token)
      .subscribe(apostadores => {
        this.apostadores = apostadores
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


  createApuesta(newApuesta: Apuesta) {
    if(newApuesta.id_apostador == undefined){
       newApuesta.id_apostador = this.userId
    }
    this.apuestaService.crearApuesta(newApuesta, this.token)
      .subscribe(apuesta => {
        this.showSuccess(apuesta)
        this.apuestaForm.reset()
        this.routerPath.navigate([`/apuestas/${this.userId}/${this.token}`])
      },
        error => {
          if (error.statusText === "UNAUTHORIZED") {
            this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
          }
          else if (error.statusText === "UNPROCESSABLE ENTITY") {
            this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
          }
          else {
            if (error.error.message != undefined || error.error.message != null)
            {
              this.showError(`Ha ocurrido un error: ${error.error.message}`)
            }else {
              this.showError(`Ha ocurrido un error: ${error.message}`)
            }
          }
        })
  }

  cancelCreate() {
    this.apuestaForm.reset()
    this.routerPath.navigate([`/apuestas/${this.userId}/${this.token}`])
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess(apuesta: Apuesta) {
    this.toastr.success(`La apuesta fue creada`, "Creación exitosa");
  }


}
