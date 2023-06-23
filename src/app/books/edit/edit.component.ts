import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';
import { Books } from '../store/books';
import { invokeUpdateBookAPI } from '../store/books.action';
import { selectBookById } from '../store/books.selector';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [MessageService]
})
export class EditComponent implements OnInit {
  bookForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store,
    private appStore: Store<Appstate>,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      author: ['', Validators.required],
      cost: [0, Validators.min(0)],
      quantity: [0, Validators.min(0)],
      status: ['']
    });

    let fetchData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        var id = Number(params.get('id'));
        return this.store.pipe(select(selectBookById(id)));
      })
    );

    fetchData$.subscribe((data) => {
      console.log(data)
      if (data) {
        this.bookForm.setValue({
          id: data.id,
          name: data.name,
          author: data.author,
          cost: data.cost,
          quantity: data.quantity,
          status: data.status
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }
  showLoadingModal() {
    this.messageService.add({ severity: 'info', summary: 'Cargando', detail: 'Actualizando libro...' });
  }

  hideLoadingModal() {
    this.messageService.clear();
  }
  update() {
    this.showLoadingModal(); 

    let text: string;

    if (this.bookForm.value.quantity != null) {
      const quantity = this.bookForm.value.quantity;

      if (quantity >= 10) {
        text = 'Con Stock';
      } else if (quantity <= 5 && quantity > 0 ) {
        text = 'Bajo Stock';
      } else if (quantity === 0) {
        text = 'Sin Stock';
      } else {
        text = 'Sin Asignar'; // Valor por defecto en caso de que quantity no coincida con ningún caso anterior.
      }
    } else {
      text = 'Sin Asignar'; // Valor por defecto si quantity es null
    }

    // Modificar la propiedad status en this.bookForm.value
    this.bookForm.value.status = text;
    this.store.dispatch(
      invokeUpdateBookAPI({ updateBook: { ...this.bookForm.value } })
    );
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        this.hideLoadingModal()
        this.router.navigate(['/']);
      }
    });
  }
}
