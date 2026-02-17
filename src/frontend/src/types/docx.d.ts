declare module 'docx' {
  export enum WidthType {
    AUTO = 'auto',
    DXA = 'dxa',
    NIL = 'nil',
    PERCENTAGE = 'pct',
  }

  export enum AlignmentType {
    START = 'start',
    CENTER = 'center',
    END = 'end',
    BOTH = 'both',
    MEDIUM_KASHIDA = 'mediumKashida',
    DISTRIBUTE = 'distribute',
    NUM_TAB = 'numTab',
    HIGH_KASHIDA = 'highKashida',
    LOW_KASHIDA = 'lowKashida',
    THAI_DISTRIBUTE = 'thaiDistribute',
    LEFT = 'left',
    RIGHT = 'right',
  }

  export enum BorderStyle {
    SINGLE = 'single',
    DASH_DOT_STROKED = 'dashDotStroked',
    DASHED = 'dashed',
    DASH_SMALL_GAP = 'dashSmallGap',
    DOT_DASH = 'dotDash',
    DOT_DOT_DASH = 'dotDotDash',
    DOTTED = 'dotted',
    DOUBLE = 'double',
    DOUBLE_WAVE = 'doubleWave',
    INSET = 'inset',
    NIL = 'nil',
    NONE = 'none',
    OUTSET = 'outset',
    THICK = 'thick',
    THICK_THIN_LARGE_GAP = 'thickThinLargeGap',
    THICK_THIN_MEDIUM_GAP = 'thickThinMediumGap',
    THICK_THIN_SMALL_GAP = 'thickThinSmallGap',
    THIN_THICK_LARGE_GAP = 'thinThickLargeGap',
    THIN_THICK_MEDIUM_GAP = 'thinThickMediumGap',
    THIN_THICK_SMALL_GAP = 'thinThickSmallGap',
    THIN_THICK_THIN_LARGE_GAP = 'thinThickThinLargeGap',
    THIN_THICK_THIN_MEDIUM_GAP = 'thinThickThinMediumGap',
    THIN_THICK_THIN_SMALL_GAP = 'thinThickThinSmallGap',
    THREE_D_EMBOSS = 'threeDEmboss',
    THREE_D_ENGRAVE = 'threeDEngrave',
    TRIPLE = 'triple',
    WAVE = 'wave',
  }

  export interface ISpacingProperties {
    before?: number;
    after?: number;
    line?: number;
    lineRule?: string;
  }

  export interface IShadingAttributesProperties {
    fill?: string;
    color?: string;
    type?: string;
  }

  export interface IBorderOptions {
    style?: BorderStyle;
    size?: number;
    color?: string;
  }

  export interface ITableBordersOptions {
    top?: IBorderOptions;
    bottom?: IBorderOptions;
    left?: IBorderOptions;
    right?: IBorderOptions;
    insideHorizontal?: IBorderOptions;
    insideVertical?: IBorderOptions;
  }

  export interface ITableWidthProperties {
    size: number;
    type: WidthType;
  }

  export class TextRun {
    constructor(options: string | { text: string; bold?: boolean; italics?: boolean; size?: number });
  }

  export class Paragraph {
    constructor(options: {
      text?: string;
      heading?: string;
      alignment?: AlignmentType;
      spacing?: ISpacingProperties;
      children?: TextRun[];
      bold?: boolean;
    });
  }

  export class TableCell {
    constructor(options: {
      children: Paragraph[];
      shading?: IShadingAttributesProperties;
      width?: ITableWidthProperties;
    });
  }

  export class TableRow {
    constructor(options: {
      children: TableCell[];
      tableHeader?: boolean;
    });
  }

  export class Table {
    constructor(options: {
      rows: TableRow[];
      width?: ITableWidthProperties;
      borders?: ITableBordersOptions;
    });
  }

  export interface IDocumentSection {
    children: (Paragraph | Table)[];
  }

  export class Document {
    constructor(options: {
      sections: IDocumentSection[];
    });
  }

  export class Packer {
    static toBlob(doc: Document): Promise<Blob>;
    static toBuffer(doc: Document): Promise<Buffer>;
  }
}
