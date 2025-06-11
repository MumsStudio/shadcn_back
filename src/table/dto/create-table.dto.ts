export class CreateTableDto {
  locale: string;
  name: string;
  resources?: any[];
  sheetOrder?: any[];
  sheets?: any;
  styles?: any;
  workbookId: string;
}