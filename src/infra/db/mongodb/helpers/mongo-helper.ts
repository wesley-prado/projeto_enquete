import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect (uri: string = ''): Promise<MongoClient> {
    this.client = await MongoClient.connect(uri)
    this.uri = uri

    return this.client
  },

  async disconnect (): Promise<void> {
    if (this.client !== null) {
      await this.client.close()
      this.client = null
    }
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.uri)

    return this.client.db().collection(name)
  },

  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection
    return {
      ...collectionWithoutId,
      id: _id.toString()
    }
  }

}
