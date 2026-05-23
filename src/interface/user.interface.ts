export interface user{
    UserID: number,
    username: string,
    email: string, 
    phonenumber: number;
    password: string,
     role?: string;
    profile_picture?: string;
    skills?: string;
    bio?: string;
}