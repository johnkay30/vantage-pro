export const getColVal = (row: any, key: string) => {
  return row[key] !== undefined ? row[key] : '';
};