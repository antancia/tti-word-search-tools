export interface Position {
  readonly row: number;
  readonly col: number;
}

export interface WordInstance {
  word: string;
  positions: Position[];
  isBackwards: boolean;
  colorId: number;
  isSecretMessage?: boolean;
}

export interface CellHighlight {
  wordInstances: WordInstance[];
}