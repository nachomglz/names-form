
const pageArray = <T>(array: T[], pageCount: number): T[][] => {
  let pagedArray: T[][] = []
  let arrayCopy: T[] = [...array]

  while (arrayCopy.length > 0) {
    pagedArray.push([...arrayCopy.splice(0, pageCount)])
  }

  return pagedArray

}

export { pageArray }
