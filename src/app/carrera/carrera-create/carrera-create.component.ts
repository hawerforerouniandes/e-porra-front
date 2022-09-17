import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Carrera } from '../carrera';
import { CarreraService } from '../carrera.service';

@Component({
  selector: 'app-carrera-create',
  templateUrl: './carrera-create.component.html',
  styleUrls: ['./carrera-create.component.css']
})
export class CarreraCreateComponent implements OnInit {

  userId: number
  token: string
  carreraForm: FormGroup
  marcador: boolean = false
  constructor(
    private carreraService: CarreraService,
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
      this.carreraForm = this.formBuilder.group({
        nombre: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
        marcador: [false, [Validators.required]],
        competidores: new FormArray([])
      });
      this.competidorformArray.push(this.createCompetidorForm());
    }
  }

  get carreraFormControls() {
    return this.carreraForm.controls;
  }

  get competidorformArray() {
    return this.carreraFormControls.competidores as FormArray;
  }

  private createCompetidorForm(item?: any): FormGroup {
    return this.formBuilder.group({
      nombre_competidor: [item == null ? '' : item.competidor, [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      probabilidad: [item == null ? '' : item.probabilidad, [Validators.required, Validators.min(0), Validators.max(1)]]
    });
  }

  onAddCompetidor() {
    this.competidorformArray.push(this.createCompetidorForm());
  }

  onRemoveCompetidor(index: number) {
    this.competidorformArray.removeAt(index);
  }

  cancelCreate() {
    this.carreraForm.reset()
    this.routerPath.navigate([`/carreras/${this.userId}/${this.token}`])
  }

  createCarrera(newCarrera: Carrera) {
    if(this.marcador){
      newCarrera.competidores[0].nombre_competidor = "Local";
      newCarrera.competidores[1].nombre_competidor = "Empate";
      newCarrera.competidores[2].nombre_competidor = "Visitante";
    }
    console.log(newCarrera)
    this.carreraService.crearCarrera(this.userId, this.token, newCarrera)
      .subscribe(carrera => {
        this.showSuccess(carrera)
        this.carreraForm.reset()
        this.routerPath.navigate([`/carreras/${this.userId}/${this.token}`])
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

  changeCheckbox() {
    if(this.carreraForm.value.marcador){
      this.marcador = true
      this.onRemoveCompetidor(0)

      var local = this.formBuilder.group({
        nombre_competidor: [{value:'Local', disabled: true}, [Validators.required, Validators.minLength(1), Validators.maxLength(128)],],
        probabilidad: ['', [Validators.required, Validators.min(0), Validators.max(1)]]
      });
      this.competidorformArray.push(local);

      var empate = this.formBuilder.group({
        nombre_competidor: [{value:'Empate', disabled: true}, [Validators.required, Validators.minLength(1), Validators.maxLength(128)],],
        probabilidad: ['', [Validators.required, Validators.min(0), Validators.max(1)]]
      });
      this.competidorformArray.push(empate);

      var visitante = this.formBuilder.group({
        nombre_competidor: [{value:'Visitante', disabled: true}, [Validators.required, Validators.minLength(1), Validators.maxLength(128)],],
        probabilidad: ['', [Validators.required, Validators.min(0), Validators.max(1)]]
      });
      this.competidorformArray.push(visitante);

    }
    else{
      this.onRemoveCompetidor(0)
      this.onRemoveCompetidor(0)
      this.onRemoveCompetidor(0)
      this.onAddCompetidor()
    }
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess(carrera: Carrera) {
    this.toastr.success(`La carrera ${carrera.nombre_carrera} fue creada`, "Creación exitosa");
  }
}
