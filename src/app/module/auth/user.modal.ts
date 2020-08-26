// User class implementation  
export default class User {
  constructor(
    public email: string,
    public id: string,
    public _token: string,
    private _tokenExpirationDate: Date,
    public username: string,
    public userroles: any[]

  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
