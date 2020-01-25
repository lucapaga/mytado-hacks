
export class MytadoAuthorization {
    public userName: string;
    public password: string;
    public accessToken: string;

    constructor(userName: string, password: string, accessToken: string) {
        this.accessToken = accessToken;
        this.userName = userName;
        this.password = password;
    }
}
