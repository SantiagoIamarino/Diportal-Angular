import { Component, OnInit } from '@angular/core';
import { Anuncio } from '../../../models/anuncio.model';
import { UploadFileService } from '../../../services/upload-file.service';
import { AnuncioService } from '../../../services/anuncio.service';
import { Router } from '@angular/router';


import sweetAlert from 'sweetalert';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


declare function updateStyles();

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.component.html',
  styleUrls: ['./anuncio.component.css']
})
export class AnuncioComponent implements OnInit {

  anuncio: Anuncio = new Anuncio();

  uploadPercentage: string = null;

  errors: string;

  descEng = false;

  constructor(
    private uploadFileService: UploadFileService,
    private anuncioService: AnuncioService,
    private router: Router
  ) { }

  ngOnInit() {
    updateStyles();
  }

  checkboxChange( checkBox, event ) {
      if (checkBox === 'diario') {
        this.anuncio.vacacional.diario.desea = event.srcElement.checked;
      }

      if (checkBox === 'semanal') {
        this.anuncio.vacacional.semanal.desea = event.srcElement.checked;
      }

      if (checkBox === 'mensual') {
        this.anuncio.vacacional.mensual.desea = event.srcElement.checked;
      }
  }

  moreOrLessInput(type, isLess) {
    if ( type === 'habitaciones' ) {
      if ( isLess ) {
        // tslint:disable-next-line: radix
        this.anuncio.ambientes = (parseInt(this.anuncio.ambientes) - 1).toString();
      } else {
        // tslint:disable-next-line: radix
        this.anuncio.ambientes = (parseInt(this.anuncio.ambientes) + 1).toString();
      }
    } else {
      if ( isLess ) {
        // tslint:disable-next-line: radix
        this.anuncio.bathrooms = (parseInt(this.anuncio.bathrooms) - 1).toString();
      } else {
        // tslint:disable-next-line: radix
        this.anuncio.bathrooms = (parseInt(this.anuncio.bathrooms) + 1).toString();
      }
    }
  }

  uploadAnuncio() {

    if (this.uploadFileService.images.length === 0) {
      this.errors = 'Debes añadir por lo menos una imagen';
      return;
    }

    if (!this.validateQueDesea()) {
      return;
    }

    if (!this.anuncioService.address.calle) {
      this.errors = 'Debe agregar una dirección';
      return false;
    } else {
      this.anuncio.address = this.anuncioService.address;
    }


    // this.uploadFileService.images.forEach((image, index) => {

    //   this.uploadFileService.uploadImage(image).subscribe( uploadPercentage => {

    //     this.uploadPercentage = uploadPercentage + '%';

    //     if (uploadPercentage === 100) {
    //       if ( index === this.uploadFileService.images.length - 1 ) {

    //         this.anuncioService.uploadAnuncio( this.anuncio ).then( res => {
    //           sweetAlert(
    //             'Anuncio subido correctamente.',
    //             'Podras verlo o editarlo cuando lo desees',
    //             'success')
    //           .then((value) => {
    //             this.router.navigate(['/post', this.anuncio.id]);
    //           });
    //         } );

    //       }
    //     }

    //   } );

    // });

  }

  validateQueDesea() {

    const queDesea = this.anuncio.queDesea;

    if (queDesea === 'comprar' || queDesea === 'alquilar') {
      if (!this.anuncio.precio) {
        this.errors = 'Debes incluir un precio';
        return false;
      // tslint:disable-next-line: radix
      } else if (!parseInt(this.anuncio.precio)) {
        this.errors = 'El precio debe ser numerico';
        return false;
      }
    }

    if (queDesea === 'vacacional') {

      if (this.anuncio.vacacional.diario.desea) {
        if (!this.anuncio.vacacional.diario.precio) {
          this.errors = 'Debes agregar un precio diario';
          return false;

        // tslint:disable-next-line: radix
        } else if ( !parseInt(this.anuncio.vacacional.diario.precio) ) {
          this.errors = 'El precio diario debe ser un número';
          return false;
        }
      } else if (this.anuncio.vacacional.semanal.desea) {
        if (!this.anuncio.vacacional.semanal.precio) {
          this.errors = 'Debes agregar un precio semanal';
          return false;
          // tslint:disable-next-line: radix
        } else if ( !parseInt(this.anuncio.vacacional.semanal.precio) ) {
          this.errors = 'El precio semanal debe ser un número';
          return false;
        }
      } else if (this.anuncio.vacacional.mensual.desea) {
        if (!this.anuncio.vacacional.mensual.precio) {
          this.errors = 'Debes agregar un precio mensual';
          return false;
        // tslint:disable-next-line: radix
        } else if ( !parseInt(this.anuncio.vacacional.mensual.precio) ) {
          this.errors = 'El precio mensual debe ser un número';
          return false;
        }
      } else {
        this.errors = 'Selecciona alguna forma de pago diaria/semanal/mensual';
        return false;
      }

    }

    if (!this.anuncio.superficie) {
      this.errors = 'Debes ingresar una superficie aproximada';
      return false;
    // tslint:disable-next-line: radix
    } else if ( !parseInt(this.anuncio.superficie) ) {
      this.errors = 'La superficie debe ser numerica';
      return false;
    }

    return true;
  }


}