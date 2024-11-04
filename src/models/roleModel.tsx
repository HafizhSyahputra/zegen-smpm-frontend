export const roleSearchColumn = ["id", "name", "code", "type", "description"]  

export interface IRoleModel {  
    id: number  
    name: string  
    code: string  
    type: string  
    description?: string | null  
}