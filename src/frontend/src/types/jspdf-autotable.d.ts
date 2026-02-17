declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  export interface CellDef {
    content?: string | number;
    colSpan?: number;
    rowSpan?: number;
    styles?: Partial<Styles>;
  }

  export interface ColumnInput {
    header?: string;
    dataKey?: string;
  }

  export interface Styles {
    font?: string;
    fontStyle?: string;
    overflow?: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
    fillColor?: number | number[] | string | false;
    textColor?: number | number[] | string;
    cellWidth?: 'auto' | 'wrap' | number;
    minCellWidth?: number;
    minCellHeight?: number;
    halign?: 'left' | 'center' | 'right' | 'justify';
    valign?: 'top' | 'middle' | 'bottom';
    fontSize?: number;
    cellPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
    lineColor?: number | number[] | string;
    lineWidth?: number;
  }

  export interface UserOptions {
    head?: (string | CellDef)[][];
    body?: (string | number | CellDef)[][];
    foot?: (string | CellDef)[][];
    startY?: number;
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
    pageBreak?: 'auto' | 'avoid' | 'always';
    theme?: 'striped' | 'grid' | 'plain';
    styles?: Partial<Styles>;
    headStyles?: Partial<Styles>;
    bodyStyles?: Partial<Styles>;
    footStyles?: Partial<Styles>;
    alternateRowStyles?: Partial<Styles>;
    columnStyles?: { [key: string]: Partial<Styles> };
    didDrawPage?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    columns?: ColumnInput[];
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): void;
}
