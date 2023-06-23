import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';
import { Books } from '../store/books';
import { invokeSaveNewBookAPI } from '../store/books.action';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [MessageService]
})
export class AddComponent implements OnInit {
  bookForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private appStore: Store<Appstate>,
    private router: Router,
    private messageService: MessageService
  ) {
    this.bookForm = this.formBuilder.group({
      name: ['', Validators.required],
      author: ['', Validators.required],
      cost: [0, Validators.required],
      quantity: [0, Validators.required],
    });
  }

  ngOnInit(): void {}

  showLoadingModal() {
    this.messageService.add({ severity: 'info', summary: 'Cargando', detail: 'Creando libro...' });
  }

  hideLoadingModal() {
    this.messageService.clear();
  }

  showSuccessToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Libro agregado exitosamente' });
  }

  hideSuccessToast() {
    this.messageService.clear();
  }

  limparForm() {
    this.bookForm.reset();
  }

  save() {
    if (this.bookForm.invalid) {
      return;
    }

    this.showLoadingModal(); 

    let text: string;

    if (this.bookForm.value.quantity != null) {
      const quantity = this.bookForm.value.quantity;
      console.log(quantity);
      if (quantity >= 10) {
        text = 'Con Stock';
      } else if (quantity <= 5 && quantity > 0) {
        text = 'Bajo Stock';
      } else if (quantity === 0) {
        text = 'Sin Stock';
      } else {
        text = 'Sin Asignar'; 
      }
    } else {
      text = 'Sin Asignar';
    }

    const newBook: Books = {
      id: 0,
      author: this.bookForm.value.author,
      name: this.bookForm.value.name,
      cost: this.bookForm.value.cost,
      quantity: this.bookForm.value.quantity,
      status: text
    };

    this.store.dispatch(invokeSaveNewBookAPI({ newBook }));
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        this.hideLoadingModal();
        this.showSuccessToast();
        this.limparForm();
      }
    });
  }
}
