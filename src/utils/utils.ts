/* eslint-disable @typescript-eslint/no-extraneous-class */
export default {
  whatis (value: any): string {
    return Object
      .prototype
      .toString
      .call(value)
      .replace(/^\[object\s+([a-z]+)\]$/i, '$1')
      .toLowerCase()
  },

  deepCopy (object: any[] | object): any {
    return JSON.parse(JSON.stringify(object))
  }
}
