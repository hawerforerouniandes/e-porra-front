import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarreraService } from 'src/app/carrera/carrera.service';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { Apuesta } from '../apuesta';
import { ApuestaService } from '../apuesta.service';


@Component({
  selector: 'app-apuesta-list',
  templateUrl: './apuesta-list.component.html',
  styleUrls: ['./apuesta-list.component.css']
})
export class ApuestaListComponent implements OnInit {

  constructor(
    private apuestaService: ApuestaService,
    private carreraService: CarreraService,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
  ) { }

  userId: number
  token: string
  apuestas: Array<Apuesta>
  mostrarApuestas: Array<Apuesta>
  apuestaSeleccionada: Apuesta
  indiceSeleccionado: number = 0
  nombreCarrera: string
  nombreCompetidor: string
  nombreApostador: string
  usuario: any


  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.usuario = localStorage.getItem('usuario')
      this.usuario = JSON.parse(this.usuario)

      if(this.usuario.es_apostador){
        this.getApuestasApostador();
      }else{
        this.getApuestas();
      }
    }
  }

  getApuestas(): void {
    this.apuestaService.getApuestas(this.token)
      .subscribe(apuestas => {
        this.apuestas = apuestas
        this.mostrarApuestas = apuestas
        this.onSelect(this.mostrarApuestas[0], 0)
      })
  }

  getApuestasApostador(): void {
    this.apuestaService.getApuestasApostador(this.token, this.usuario.id)
      .subscribe(apuestas => {
        this.apuestas = apuestas
        this.mostrarApuestas = apuestas
        this.onSelect(this.mostrarApuestas[0], 0)
      })
  }

  onSelect(apuesta: Apuesta, indice: number) {
    if (apuesta != null) {
      this.indiceSeleccionado = indice
      this.apuestaSeleccionada = apuesta
      this.getInfo()
    }
  }

  getInfo(): void {
    this.carreraService.getCarrera(this.apuestaSeleccionada.id_carrera, this.token)
      .subscribe(carrera => {
        this.nombreCarrera = carrera.nombre_carrera
        var competidor = carrera.competidores.filter(x => x.id == this.apuestaSeleccionada.id_competidor)[0]
        this.nombreCompetidor = competidor.nombre_competidor
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

    this.usuarioService.getApostador(this.apuestaSeleccionada.id_apostador, this.token)
      .subscribe(apostador => {
        this.nombreApostador = apostador.nombres
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

  buscarApuesta(busqueda: string) {
    let apuestasBusqueda: Array<Apuesta> = []
    /*this.apuestas.map(apuesta => {
      if (apuesta.nombre_apostador.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())) {
        apuestasBusqueda.push(apuesta)
      }
    })*/
    this.mostrarApuestas = apuestasBusqueda
  }

  irCrearApuesta() {
    this.routerPath.navigate([`/apuestas/crear/${this.userId}/${this.token}`])
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
