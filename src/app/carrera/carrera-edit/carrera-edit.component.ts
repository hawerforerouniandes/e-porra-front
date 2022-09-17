import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera } from '../carrera';
import { CarreraService } from '../carrera.service';

@Component({
  selector: 'app-carrera-edit',
  templateUrl: './carrera-edit.component.html',
  styleUrls: ['./carrera-edit.component.css']
})
export class CarreraEditComponent implements OnInit {

  userId: number;
  token: string;
  carreraId: number;
  carreraForm!: FormGroup;
  marcador: boolean;

  constructor(

    private carreraService: CarreraService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router) { }

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.carreraService.getCarrera(parseInt(this.router.snapshot.params.carreraId), this.token)
        .subscribe(carrera => {
          this.carreraId = carrera.id
          this.marcador = carrera.marcador
          this.carreraForm = this.formBuilder.group({
            nombre: [carrera.nombre_carrera, [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
            marcador: [carrera.marcador, [Validators.required]],
            competidores: new FormArray([])
          })

          if (carrera.competidores.length > 0) {
            carrera.competidores.forEach((item, index) => {
              if(carrera.marcador){
                var item_marcador = this.formBuilder.group({
                  id: [item.id],
                  nombre_competidor: [{value:item.nombre_competidor, disabled: true}, [Validators.required, Validators.minLength(1), Validators.maxLength(128)],],
                  probabilidad: [item.probabilidad, [Validators.required, Validators.min(0), Validators.max(1)]]
                });
                this.competidorformArray.push(item_marcador);
              }else{
                this.competidorformArray.push(this.createCompetidorForm(item));
              }
            });
          }
        })
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
      id: [item == null ? '' : item.id],
      nombre_competidor: [item == null ? '' : item.nombre_competidor, [Validators.required, Validators.minLength(1), Validators.maxLength(128)]],
      probabilidad: [item == null ? '' : Number(item.probabilidad).toFixed(2), [Validators.required, Validators.min(0), Validators.max(1)]]
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

  editarCarrera(newCarrera: Carrera) {
    if(this.marcador){
      newCarrera.competidores[0].nombre_competidor = "Local";
      newCarrera.competidores[1].nombre_competidor = "Empate";
      newCarrera.competidores[2].nombre_competidor = "Visitante";
    }
    this.carreraService.editarCarrera(this.token, this.carreraId, newCarrera)
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
      var len = this.competidorformArray.length
      for (let index = 0; index < len; index++) {
        this.onRemoveCompetidor(0)
      }

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
      var len = this.competidorformArray.length
      for (let index = 0; index < len; index++) {
        this.onRemoveCompetidor(0)
      }
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
    this.toastr.success(`La carrera ${carrera.nombre_carrera} fue editada`, "Edición exitosa");
  }

}
