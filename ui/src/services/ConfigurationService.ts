import DefaultConfig from '@/assets/config'

export enum ConfigurationPersistenceLocation {
  cookie = 'cookie',
  localStorage = 'local-storage'
}

export default class ConfigurationService {
  private static instance: ConfigurationService

  public static readonly ITEM_DOES_NOT_EXIST_EXCEPTION: Function = (item: string) => new Error(`ITEM_DOES_NOT_EXIST: ${item}`)
  public static readonly ITEM_ALREADY_EXISTS_EXCEPTION: Function = (item: string) => new Error(`ITEM_ALREADY_EXISTS: ${item}`)

  private readonly data: { [key: string]: any }

  constructor () {
    const localData = DefaultConfig
    const persistedData = localStorage

    this.data = {
      ...localData,
      ...persistedData
    }
  }

  delete (item: string): void {
    delete this.data[item]
  }

  get (item: string, optional: boolean = false): any {
    const value = this.data[item]
    if (value === undefined && !optional) {
      throw ConfigurationService.ITEM_DOES_NOT_EXIST_EXCEPTION(item)
    }

    if (!value && optional) {
      console.log(`WARN: Parameter ${item} does not exist`)
    }

    return value
  }

  persist (item: string, location: ConfigurationPersistenceLocation = ConfigurationPersistenceLocation.localStorage) {
    const value = this.get(item)
    if (value === undefined) {
      throw ConfigurationService.ITEM_DOES_NOT_EXIST_EXCEPTION(item)
    }

    switch (location) {
      case ConfigurationPersistenceLocation.localStorage:
        localStorage.setItem(item, value)
        break
    }
  }

  set (item: string, value: any, overwrite: boolean = false): any {
    const existing = this.data[item]
    if (existing !== undefined && !overwrite) {
      throw ConfigurationService.ITEM_ALREADY_EXISTS_EXCEPTION(item)
    }

    this.data[item] = value

    return this.get(item)
  }

  static getInstance () {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService()
    }
    return ConfigurationService.instance
  }
}
