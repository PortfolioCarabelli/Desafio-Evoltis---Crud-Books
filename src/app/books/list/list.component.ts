import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';
import { invokeBooksAPI, invokeDeleteBookAPI } from '../store/books.action';
import { selectBooks } from '../store/books.selector';
import { Books } from '../store/books';
import { Table } from "primeng/table";
import { PrimeNGConfig, MessageService } from 'primeng/api';

declare var window: any;

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [MessageService]
})

export class ListComponent implements OnInit {
  books$ = this.store.pipe(select(selectBooks));
  books!: Books[];
  deleteModal: any;
  idToDelete: number = 0;

  //Modal de Carga
  loading: boolean = true;
  
  //Paginacion
  totalItems!: number;

  @ViewChild("dt") table!: Table;
  
  constructor(private store: Store, private appStore: Store<Appstate>, private primengConfig: PrimeNGConfig,   private messageService: MessageService) { }


  ngOnInit(): void {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    );

    this.store.dispatch(invokeBooksAPI());
    this.books$.subscribe((books: Books[]) => {
      this.books = books;      
    });

    this.primengConfig.ripple = true;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Con Stock':
        return 'success';
      case 'Bajo Stock':
        return 'warning';
      case 'Sin Stock':
        return 'danger';
      default:
        return 'Sin Asignar'; 
    }
  }

  showLoadingModal() {
    this.messageService.add({ severity: 'info', summary: 'Cargando', detail: 'Eliminando libro...' });
  }

  hideLoadingModal() {
    this.messageService.clear();
  }

  showSuccessToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Libro eliminado exitosamente' });
  }

  hideSuccessToast() {
    this.messageService.clear();
  }
  openDeleteModal(id: number) {
    this.idToDelete = id;
    this.deleteModal.show();
  }

  delete() {
    this.showLoadingModal()
    this.store.dispatch(
      invokeDeleteBookAPI({
        id: this.idToDelete,
      })
    );
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.hideLoadingModal()
        this.deleteModal.hide();
        this.showSuccessToast() 
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
      }
    });
  }

}
