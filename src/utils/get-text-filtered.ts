type GetTextFilteredProps = (array: string[], position: number) => string[];

export const getTextFiltered: GetTextFilteredProps = (array, position) =>
  array.map((item) => {
    const id = item.split(" ");
    return id[position];
  });
