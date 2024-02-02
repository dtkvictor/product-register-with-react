import { createContext } from "react";
import Dataservice, { DataserviceInterface } from "@/Helpers/Dataservice";

export interface UserInterface extends DataserviceInterface {
    profile?: string,
    name: string,
    email: string,
    password: string
}

export interface UserContextProps {
    addEventListener: (event: 'global'|'insert'|'update'|'delete', callback: () => void) => void, 
    removeEventListener: (event: 'global'|'insert'|'update'|'delete') => void,
    find: (id: number) => UserInterface;
    get: () => UserInterface[],
    insert: (category: UserInterface) => void,
    update: (category: UserInterface) => void,
    delete: (id:number) => void,
}

export class UserModel extends Dataservice
{
    constructor() {
        super('users');
        this.setDefaultUser();
    }

    public setDefaultUser()
    {
        const defaultUser = this.get().find(user => user.id == 1);
        if(defaultUser) return;

        this.insert({
            id: 1,
            profile: 'https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG.png',
            name: 'Super Admin',
            email: 'admin@super.com',
            password: '3decd49a6c6dce88c16a85b9a8e42b51aa36f1e2',
            created_at: null,
            updated_at: null
        })
    }

    public get(): UserInterface[]
    {
        return super.get();
    }

    public insert(user: UserInterface): void 
    {
        super.insert(user)
    }

    public update(user: UserInterface): void 
    {
        super.update(user)        
    }
}

export const UserContext = createContext<UserModel|undefined>(undefined);