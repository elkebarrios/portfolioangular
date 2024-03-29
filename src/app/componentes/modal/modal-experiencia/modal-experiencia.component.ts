import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Experiencia } from 'src/app/modelos/experiencia';
import { ExperienciaService } from 'src/app/servicios/experiencia.service';


@Component({
  selector: 'app-modal-experiencia',
  templateUrl: './modal-experiencia.component.html',
  styleUrls: ['./modal-experiencia.component.css']
})
export class ModalExperienciaComponent implements OnInit {
  form: FormGroup;
  experiencias: Experiencia[] = [];
  constructor(private formBuilder: FormBuilder, private ExperienciaS: ExperienciaService) {
    //Creamos el grupo de controles para el formulario
    this.form = this.formBuilder.group({
      id: [''],
      cargo: ['', [Validators.required]],
      nombreEmpresa: ['', [Validators.required]],
      descripcionCargo: ['', [Validators.required]],
      empleoActual: [''],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      aptitud: ['', [Validators.required]],
      logoEmpresa: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.cargarExperiencia();
  }

  cargarExperiencia(): void {
    this.ExperienciaS.verExperiencias().subscribe(
      data => {
        this.experiencias = data;
      }
    )
  }

  cargarDetalle(id: number) {
    this.ExperienciaS.verExperiencia(id).subscribe(
      {
        next: (data) => {
          this.form.setValue(data);
        },
        error: (e) => {
          console.error(e)
          alert("error al modificar")
        },
        complete: () => console.info('complete')
      }
    )
  }

  //👇 esto es solo para hacer pruebas en local
  onImagenSeleccionada(e: any) {
    let nombreImagen = e.target.files[0].name
    let url = 'assets/img/' + nombreImagen;
    this.form.patchValue({ logoEmpresa: url });
    console.log(url);
  }

  guardar() {
    let exp = this.form.value;

    if (exp.id == '') {
      this.ExperienciaS.agregarExperiencia(exp).subscribe(
        data => {
          alert("Experiencia añadida");
          this.cargarExperiencia();
          this.form.reset();
        }
      )
    } else {
      this.ExperienciaS.updateExperiencia(exp).subscribe(
        data => {
          alert("Experiencia modificada");
          this.cargarExperiencia();
          this.form.reset();
        }
      )
    }
  }

  borrar(id: number) {
    this.ExperienciaS.eliminarExperiencia(id).subscribe(
      {
        next: data => {
          alert("se pudo eliminar satisfactoriamente");
          this.cargarExperiencia()
        },
        error: err => {
          console.error(err)
          alert("No se pudo eliminar")
        }
      }
    )
  }
}
