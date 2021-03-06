import { LoadAccountByAccessToken } from '../../../domain/use-cases/load-account-by-access-token'
import { AccountModel } from '../../../domain/models/account'
import { TokenReader } from '../../protocols/cryptography/token-reader'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import emptyString from '../../../utils/empty-string'
import { exists } from '../../../utils/object-exists'

export class DBLoadAccountByToken implements LoadAccountByAccessToken {
  constructor (private readonly tokenDecrypter: TokenReader, private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository) {

  }

  async loadAccount (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.tokenDecrypter.decrypt(accessToken)
    if (!emptyString(token)) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (exists(account)) {
        return account
      }
    }
    return null
  }
}
