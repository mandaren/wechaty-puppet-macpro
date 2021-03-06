import fs     from 'fs-extra'
import os     from 'os'
import path   from 'path'

import { FlashStore } from 'flash-store'

import { log } from './config'
import {
  FileCache,
  MacproContactPayload,
  MacproRoomPayload,
  MacproRoomInvitationPayload,
  MacproRoomMemberPayload,
} from './schemas'
import { FriendshipPayload } from 'wechaty-puppet'

const PRE = 'CacheManager'

export class CacheManager {

  /**
   * ************************************************************************
   *                Static Methods
   * ************************************************************************
   */
  private static _instance?: CacheManager

  public static get Instance () {
    if (!this._instance) {
      throw new Error(`${PRE} cache manager instance not initialized.`)
    }
    return this._instance
  }

  public static async init (userId: string) {
    log.verbose(PRE, `init()`)
    if (this._instance) {
      log.verbose(PRE, `init() CacheManager has been initialized, no need to initialize again.`)
      return
    }
    this._instance = new CacheManager()
    await this._instance.initCache(userId)
  }

  public static async release () {
    log.verbose(PRE, `release()`)
    if (!this._instance) {
      log.verbose(PRE, `release() CacheManager not exist, no need to release it.`)
      return
    }
    await this._instance.releaseCache()
    this._instance = undefined
  }

  /**
   * ************************************************************************
   *                Instance Methods
   * ************************************************************************
   */
  private cacheContactRawPayload?    : FlashStore<string, MacproContactPayload>
  private cacheRoomMemberRawPayload? : FlashStore<string, {
    [contactId: string]: MacproRoomMemberPayload,
  }>
  private cacheRoomRawPayload?       : FlashStore<string, MacproRoomPayload>
  private cacheRoomInvitationRawPayload? : FlashStore<string, MacproRoomInvitationPayload>
  private cacheFriendshipRawPayload? : FlashStore<string, FriendshipPayload>
  private cacheFile? : FlashStore<string, FileCache>

  /**
   * -------------------------------
   * Contact Section
   * --------------------------------
   */
  public async getContact (
    contactId: string,
  ): Promise<MacproContactPayload | undefined> {
    if (!this.cacheContactRawPayload) {
      throw new Error(`${PRE} getContact() has no cache.`)
    }
    return this.cacheContactRawPayload.get(contactId)
  }

  public async setContact (
    contactId: string,
    payload: MacproContactPayload
  ): Promise<void> {
    if (!this.cacheContactRawPayload || !contactId) {
      throw new Error(`${PRE} setContact() has no cache.`)
    }
    await this.cacheContactRawPayload.set(contactId, payload)
  }

  public async deleteContact (
    contactId: string,
  ): Promise<void> {
    if (!this.cacheContactRawPayload) {
      throw new Error(`${PRE} deleteContact() has no cache.`)
    }
    await this.cacheContactRawPayload.delete(contactId)
  }

  public async getContactIds (): Promise<string[]> {
    if (!this.cacheContactRawPayload) {
      throw new Error(`${PRE} getContactIds() has no cache.`)
    }
    const result: string[] = []
    for await (const key of this.cacheContactRawPayload.keys()) {
      result.push(key)
    }

    return result
  }

  public async getAllContacts (): Promise<MacproContactPayload[]> {
    if (!this.cacheContactRawPayload) {
      throw new Error(`${PRE} getAllContacts() has no cache.`)
    }
    const result: MacproContactPayload[] = []
    for await (const value of this.cacheContactRawPayload.values()) {
      result.push(value)
    }
    return result
  }

  public async hasContact (contactId: string): Promise<boolean> {
    if (!this.cacheContactRawPayload) {
      throw new Error(`${PRE} hasContact() has no cache.`)
    }
    return this.cacheContactRawPayload.has(contactId)
  }

  public async getContactCount (): Promise<number> {
    if (!this.cacheContactRawPayload) {
      throw new Error(`${PRE} getContactCount() has no cache.`)
    }
    return this.cacheContactRawPayload.size
  }

  /**
   * -------------------------------
   * Room Section
   * --------------------------------
   */
  public async getRoom (
    roomId: string,
  ): Promise<MacproRoomPayload | undefined> {
    if (!this.cacheRoomRawPayload) {
      throw new Error(`${PRE} getRoom() has no cache.`)
    }
    return this.cacheRoomRawPayload.get(roomId)
  }

  public async setRoom (
    roomId: string,
    payload: MacproRoomPayload
  ): Promise<void> {
    if (!this.cacheRoomRawPayload) {
      throw new Error(`${PRE} setRoom() has no cache.`)
    }
    await this.cacheRoomRawPayload.set(roomId, payload)
  }

  public async deleteRoom (
    roomId: string,
  ): Promise<void> {
    if (!this.cacheRoomRawPayload) {
      throw new Error(`${PRE} setRoom() has no cache.`)
    }
    await this.cacheRoomRawPayload.delete(roomId)
  }

  public async getRoomIds (): Promise<string[]> {
    if (!this.cacheRoomRawPayload) {
      throw new Error(`${PRE} getRoomIds() has no cache.`)
    }
    const result: string[] = []
    for await (const key of this.cacheRoomRawPayload.keys()) {
      result.push(key)
    }
    return result
  }

  public async getRoomCount (): Promise<number> {
    if (!this.cacheRoomRawPayload) {
      throw new Error(`${PRE} getRoomCount() has no cache.`)
    }
    return this.cacheRoomRawPayload.size
  }

  public async hasRoom (roomId: string): Promise<boolean> {
    if (!this.cacheRoomRawPayload) {
      throw new Error(`${PRE} hasRoom() has no cache.`)
    }
    return this.cacheRoomRawPayload.has(roomId)
  }
  /**
   * -------------------------------
   * Room Member Section
   * --------------------------------
   */
  public async getRoomMember (
    roomId: string,
  ): Promise<{ [contactId: string]: MacproRoomMemberPayload } | undefined> {
    if (!this.cacheRoomMemberRawPayload) {
      throw new Error(`${PRE} getRoomMember() has no cache.`)
    }
    return this.cacheRoomMemberRawPayload.get(roomId)
  }

  public async setRoomMember (
    roomId: string,
    payload: { [contactId: string]: MacproRoomMemberPayload }
  ): Promise<void> {
    if (!this.cacheRoomMemberRawPayload) {
      throw new Error(`${PRE} setRoomMember() has no cache.`)
    }
    await this.cacheRoomMemberRawPayload.set(roomId, payload)
  }

  public async deleteRoomMember (
    roomId: string,
  ): Promise<void> {
    if (!this.cacheRoomMemberRawPayload) {
      throw new Error(`${PRE} deleteRoomMember() has no cache.`)
    }
    await this.cacheRoomMemberRawPayload.delete(roomId)
  }

  /**
   * -------------------------------
   * Room Invitation Section
   * --------------------------------
   */
  public async getRoomInvitation (
    messageId: string,
  ): Promise<MacproRoomInvitationPayload | undefined> {
    if (!this.cacheRoomInvitationRawPayload) {
      throw new Error(`${PRE} getRoomInvitationRawPayload() has no cache.`)
    }
    return this.cacheRoomInvitationRawPayload.get(messageId)
  }

  public async setRoomInvitation (
    messageId: string,
    payload: MacproRoomInvitationPayload,
  ): Promise<void> {
    if (!this.cacheRoomInvitationRawPayload) {
      throw new Error(`${PRE} setRoomInvitationRawPayload() has no cache.`)
    }
    await this.cacheRoomInvitationRawPayload.set(messageId, payload)
  }

  public async deleteRoomInvitation (
    messageId: string,
  ): Promise<void> {
    if (!this.cacheRoomInvitationRawPayload) {
      throw new Error(`${PRE} deleteRoomInvitation() has no cache.`)
    }
    await this.cacheRoomInvitationRawPayload.delete(messageId)
  }
  /**
   * -------------------------------
   * CDN File Cache Section
   * --------------------------------
   */
  public async getFileCache (
    fileId: string
  ): Promise<FileCache | undefined> {
    if (!this.cacheFile) {
      throw new Error(`${PRE} getFileCache() has no cache.`)
    }

    const fileCache = await this.cacheFile.get(fileId)

    if (!fileCache) {
      return fileCache
    }

    return this.parseJSON(JSON.stringify(fileCache))
  }

  public async setFileCache (
    fileId: string,
    cache: FileCache
  ): Promise<void> {
    if (!this.cacheFile) {
      throw new Error(`${PRE} setFileCache() has no cache.`)
    }
    log.silly(PRE, `setFileCache(${fileId}, ${JSON.stringify(cache)})`)
    await this.cacheFile.set(fileId, cache)
  }

  /**
   * -------------------------------
   * Friendship Cache Section
   * --------------------------------
   */
  public async getFriendshipRawPayload (id: string) {
    if (!this.cacheFriendshipRawPayload) {
      throw new Error(`${PRE} getFriendshipRawPayload() has no cache.`)
    }
    return this.cacheFriendshipRawPayload.get(id)
  }

  public async setFriendshipRawPayload (
    id: string,
    payload: FriendshipPayload,
  ) {
    if (!this.cacheFriendshipRawPayload) {
      throw new Error(`${PRE} setFriendshipRawPayload() has no cache.`)
    }
    await this.cacheFriendshipRawPayload.set(id, payload)
  }

  /**
   * -------------------------------
   * Private Method Section
   * --------------------------------
   */

  private parseJSON (payload: any) {
    log.silly(PRE, `parseJSON(${payload})`)
    return JSON.parse(payload, (_, v) => {
      if (
        v !== null
        && typeof v === 'object'
        && 'type' in v
        && v.type === 'Buffer'
        && 'data' in v
        && Array.isArray(v.data)
      ) {
        return Buffer.from(v.data)
      }
      return v
    })
  }

  private async initCache (
    userId: string,
  ): Promise<void> {
    log.verbose(PRE, 'initCache(%s)', userId)

    if (this.cacheContactRawPayload
        || this.cacheFile
    ) {
      throw new Error('cache exists')
    }

    const baseDir = path.join(
      os.homedir(),
      path.sep,
      '.wechaty',
      'puppet-macpro-cache',
      path.sep,
      'flash-store-v0.14',
      path.sep,
      userId,
    )

    const baseDirExist = await fs.pathExists(baseDir)

    if (!baseDirExist) {
      await fs.mkdirp(baseDir)
    }

    this.cacheContactRawPayload        = new FlashStore(path.join(baseDir, 'contact-raw-payload'))
    this.cacheRoomMemberRawPayload     = new FlashStore(path.join(baseDir, 'room-member-raw-payload'))
    this.cacheRoomRawPayload           = new FlashStore(path.join(baseDir, 'room-raw-payload'))
    this.cacheFile                     = new FlashStore(path.join(baseDir, 'file-cache'))
    this.cacheFriendshipRawPayload     = new FlashStore(path.join(baseDir, 'friendship'))

    const contactTotal = this.cacheContactRawPayload.size

    log.verbose(PRE, `initCache() inited ${await contactTotal} Contacts,  cachedir="${baseDir}"`)
  }

  private async releaseCache () {
    log.verbose(PRE, 'releaseCache()')

    if (this.cacheContactRawPayload
        && this.cacheRoomMemberRawPayload
        && this.cacheRoomRawPayload
        && this.cacheFile
        && this.cacheFriendshipRawPayload
    ) {
      log.silly(PRE, 'releaseCache() closing caches ...')

      await Promise.all([
        this.cacheContactRawPayload.close(),
        this.cacheRoomMemberRawPayload.close(),
        this.cacheRoomRawPayload.close(),
        this.cacheFile.close(),
        this.cacheFriendshipRawPayload.close(),
      ])

      this.cacheContactRawPayload    = undefined
      this.cacheRoomMemberRawPayload = undefined
      this.cacheRoomRawPayload       = undefined
      this.cacheFile                 = undefined
      this.cacheFriendshipRawPayload = undefined

      log.silly(PRE, 'releaseCache() cache closed.')
    } else {
      log.verbose(PRE, 'releaseCache() cache not exist.')
    }
  }

}
