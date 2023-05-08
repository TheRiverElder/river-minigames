export default class Side {

    public static readonly SERVER = new Side(true, false);
    public static readonly CLIENT = new Side(false, true);
    public static readonly BOTH = new Side(true, true);
    public static readonly NONE = new Side(false, false);

    readonly activeOnServer: boolean;
    readonly activeOnClient: boolean;

    private constructor(activeOnServer: boolean, activeOnClient: boolean) {
        this.activeOnServer = activeOnServer;
        this.activeOnClient = activeOnClient;
    }
}