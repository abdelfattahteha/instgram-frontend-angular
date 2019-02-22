import { User } from "./user.model";

export interface Post {
    id: string;
    user: User;
    content: string;
    imageUrl: string;
    comments: any[];
    likes: any[];
    createdAt: Date;
}