import { createAction, props } from '@ngrx/store';
import { Books } from './books';

export const invokeBooksAPI = createAction(
  '[API de Libros] Invocar API de Búsqueda de Libros'
  );
  
  export const booksFetchAPISuccess = createAction(
  '[API de Libros] Éxito en la Búsqueda de Libros',
  props<{ allBooks: Books[] }>()
  );
  
  export const invokeSaveNewBookAPI = createAction(
  '[API de Libros] Invocar API para Guardar un Nuevo Libro',
  props<{ newBook: Books }>()
  );
  
  export const saveNewBookAPISucess = createAction(
  '[API de Libros] Éxito en la API de Guardar un Nuevo Libro',
  props<{ newBook: Books }>()
  );
  
  export const invokeUpdateBookAPI = createAction(
  '[API de Libros] Invocar API para Actualizar un Libro',
  props<{ updateBook: Books }>()
  );
  
  export const updateBookAPISucess = createAction(
  '[API de Libros] Éxito en la API de Actualizar un Libro',
  props<{ updateBook: Books }>()
  );
  
  export const invokeDeleteBookAPI = createAction(
  '[API de Libros] Invocar API para Eliminar un Libro',
  props<{id:number}>()
  );
  
  export const deleteBookAPISuccess = createAction(
  '[API de Libros] Éxito en la API de Eliminar un Libro',
  props<{id:number}>()
  );