import { ContactGender } from 'wechaty-puppet'
import { log } from '../config'
import { RequestStatus } from '../schemas'
import { AliasModel, MacproContactPayload } from '../schemas/contact'
import { RequestClient } from '../utils/request'

const PRE = 'MacproContact'

export default class MacproContact {

  private requestClient: RequestClient

  constructor (requestClient: RequestClient) {
    this.requestClient = requestClient
  }

  /**
   * @deprecated
   * use syncContactInfo instead
   */
  public getContactInfo = async (loginId: string, contactId: string): Promise<MacproContactPayload> => {
    log.verbose(PRE, `getContactInfo(${loginId}, ${contactId})`)

    const data = {
      account: contactId,
      my_account: loginId,
    }

    const res = await this.requestClient.request({
      apiName: 'getContactInfo',
      data,
    })
    log.silly(PRE, `get contact info from API : ${JSON.stringify(res)}`)
    const contactRawPayload: MacproContactPayload = {
      account: res.account,
      accountAlias: res.name_remark,
      city: res.area ? res.area.split('_')[1] : '',
      description: res.description,
      disturb: res.disturb,
      formName: res.form_name,
      name: res.name,
      province: res.area ? res.area.split('_')[0] : '',
      sex: parseInt(res.sex, 10) as ContactGender,
      thumb: res.thumb,
      v1: res.v1 || 'v1_mock_data',
    }

    return contactRawPayload
  }

  public syncContactInfo = async (loginId: string, contactId: string): Promise<void> => {
    log.verbose(PRE, `syncContactInfo(${loginId}, ${contactId})`)

    const data = {
      account: contactId,
      my_account: loginId,
    }

    const res = await this.requestClient.request({
      apiName: 'syncContactInfo',
      data,
    })
    log.silly(PRE, `sync contact info from API : ${JSON.stringify(res)}`)
  }

  // Set alias for contact
  public setAlias = async (aliasModel: AliasModel): Promise<RequestStatus> => {
    log.verbose(PRE, `setAlias()`)

    const data = {
      my_account: aliasModel.loginedId,
      remark: aliasModel.remark,
      to_account: aliasModel.contactId,
    }

    const res = await this.requestClient.request({
      apiName: 'modifyFriendAlias',
      data,
    })

    if (res && res.code === RequestStatus.Success) {
      return RequestStatus.Success
    } else {
      return RequestStatus.Fail
    }
  }

  // config callback endpoint for getting contact list
  public contactList = async (loginId: string): Promise<void> => {
    log.verbose(PRE, `contactList(${loginId})`)

    const data = {
      my_account: loginId,
    }

    await this.requestClient.request({
      apiName: 'getContactList',
      data,
    })
  }

}
