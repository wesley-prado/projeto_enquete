import * as bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter-protocol'

export class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return hashedValue
  }
}
