/* eslint-disable @typescript-eslint/no-extraneous-class */
class Utils {
  static whatis (value: any): string {
    return Object
      .prototype
      .toString
      .call(value)
      .replace(/^\[object\s+([a-z]+)\]$/i, '$1')
      .toLowerCase()
  }

  static deepCopy (object: any[] | object): any {
    return JSON.parse(JSON.stringify(object))
  }
}

export default Utils
