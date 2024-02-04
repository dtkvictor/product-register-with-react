import { createContext } from "react";
import { UserInterface, UserModel } from "./UserContext";
import { sha1 } from "@/Helpers/StringFunctions";

type AttemptData = {
    email:string, 
    password:string, 
    remember?:boolean
}

export type AuthContextProps = {
    user: () => UserInterface|undefined,
    check: () => boolean,
    attempt: (data: AttemptData) => Promise<any>,
    logout: (callback: VoidFunction) => void,
    register: (user: UserInterface) => Promise<any>,
    updateAccount: (user: UserInterface) => Promise<any>,
    updatePassword: ({password, newPassword}: {password:string, newPassword: string}) => Promise<any>,
    deleteAccount: (password: string) => Promise<any>,
}

type SessionInterface = {
    user: number,
    exp: Date
}

export class Auth
{
    private current: UserInterface|undefined;

    constructor()
    {
        this.loadSession();
    }

    public user(): UserInterface|undefined 
    {
        return this.current;
    }

    public check(): boolean
    {
        return this.current ? true : false;
    }

    public async attempt({email, password}: AttemptData)
    {
        password = await sha1(password) as string;
        const users = (new UserModel()).get() as UserInterface[];
        const user = users.find(user => user.email == email && user.password == password);
        if(user) {
            this.current = user;
            this.createSession(user.id as number);
            return;
        }
        throw new Error('Not found user');
    }

    public async register(user:UserInterface) 
    {
        user.password = await sha1(user.password) as string;
        (new UserModel()).insert(user);
    }

    public logout(callback: VoidFunction) 
    {
        this.current = undefined;
        this.destroySession();
        if(callback) callback(); 
    }

    public async updateAccount({profile, name, email, password}: UserInterface)
    {
        if(!this.check()) return;
        if(this.current?.password != (await sha1(password))) {
            throw new Error('Invalid password!');
        }

        const user = {
            ...this.current,
            profile: profile,
            name: name,
            email: email,
        } as UserInterface;
        
        (new UserModel()).update(user);
        this.current = {...user};
        return 'Account data updated successfully.'
    }

    public async updatePassword({password, newPassword}: {password:string, newPassword: string})
    {
        if(!this.check()) return;
        if(this.current?.password != (await sha1(password))) {
            throw new Error('Invalid password!');
        }

        const user = {
            ...this.current,
            password: (await sha1(newPassword))
        } as UserInterface;
        
        (new UserModel()).update(user);
        this.current = {...user};
        return 'Password updated successfully.'
    }

    public async deleteAccount(password: string)
    {
        if(!this.check()) return;
        if(this.current?.password != (await sha1(password))) {
            throw new Error('Invalid password!');
        }
        (new UserModel()).delete(this.user()?.id ?? 0);
        this.current = undefined;
    }

    private getSession(): SessionInterface|null
    {
        const json = localStorage.getItem('session');
        const session = json ? JSON.parse(json) : null;
        if(!session) return null;
        return session;
    }
    
    private createSession(userId: number): void
    {
        const currentDate = new Date();
        const exp = currentDate.setHours(currentDate.getHours() + 1);

        localStorage.setItem('session', JSON.stringify({
            user: userId,
            exp: exp
        }))

        setInterval(() => this.refreshSession(), 3600000);
    }

    private destroySession(): void
    {
        localStorage.removeItem('session')
    }

    private loadSession(): void
    {
        const session = this.getSession();
        if(!session) return;

        const currentDate = new Date();
        const expDate = new Date(session.exp);
        if(currentDate > expDate) return;

        const user = (new UserModel()).get().find(user => user.id == session.user);
        if(user) this.current = user;
        this.refreshSession()
    }

    private refreshSession(): void
    {
        const session = this.getSession();
        if(!session) return;

        const dateExp = new Date(session.exp);
        const newDateExp = dateExp.setHours(dateExp.getHours() + 1);

        localStorage.setItem('session', JSON.stringify({
            user: session.user,
            exp: newDateExp
        }))

        setTimeout(() => this.refreshSession(), 3600000);
    }
}

export const AuthContext = createContext<AuthContextProps|undefined>(undefined);