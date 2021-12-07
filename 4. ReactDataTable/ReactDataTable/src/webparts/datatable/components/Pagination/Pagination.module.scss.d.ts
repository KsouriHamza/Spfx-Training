export type Styles = {
  'buttonStyle': string;
  'pagination': string;
  'rowsPerPage': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
