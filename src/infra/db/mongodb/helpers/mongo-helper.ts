import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string = ''): Promise<MongoClient> {
    this.client = await MongoClient.connect(uri ?? process.env.MONGO_URL)

    return this.client
  },

  async disconnect (): Promise<void> {
    if (this.client !== null) await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}
