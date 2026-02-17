declare module 'xlsx' {
  export interface WorkSheet {
    [cell: string]: any;
  }

  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [sheet: string]: WorkSheet };
  }

  export interface WritingOptions {
    type?: 'base64' | 'binary' | 'buffer' | 'file' | 'array' | 'string';
    bookType?: 'xlsx' | 'xlsm' | 'xlsb' | 'xls' | 'csv' | 'txt' | 'html';
    bookSST?: boolean;
    compression?: boolean;
  }

  export interface AOA2SheetOpts {
    dateNF?: string;
    cellDates?: boolean;
    sheetStubs?: boolean;
  }

  export const utils: {
    book_new(): WorkBook;
    book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name?: string): void;
    aoa_to_sheet(data: any[][], opts?: AOA2SheetOpts): WorkSheet;
    json_to_sheet(data: any[], opts?: any): WorkSheet;
    sheet_to_json(worksheet: WorkSheet, opts?: any): any[];
    sheet_to_csv(worksheet: WorkSheet, opts?: any): string;
    sheet_to_html(worksheet: WorkSheet, opts?: any): string;
  };

  export function read(data: any, opts?: any): WorkBook;
  export function write(workbook: WorkBook, opts?: WritingOptions): any;
  export function writeFile(workbook: WorkBook, filename: string, opts?: WritingOptions): void;
  export function writeFileXLSX(workbook: WorkBook, filename: string, opts?: WritingOptions): void;
}
