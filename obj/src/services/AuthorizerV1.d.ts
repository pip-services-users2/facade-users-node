export declare class AuthorizerV1 {
    private basicAuth;
    private roleAuth;
    anybody(): (req: any, res: any, next: () => void) => void;
    signed(): (req: any, res: any, next: () => void) => void;
    owner(idParam?: string): (req: any, res: any, next: () => void) => void;
    admin(): (req: any, res: any, next: () => void) => void;
    ownerOrAdmin(idParam?: string): (req: any, res: any, next: () => void) => void;
    private access;
}
