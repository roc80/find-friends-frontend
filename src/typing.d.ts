declare namespace API {
    type User = {
        userName: string;
        avatarUrl: string;
        userId: number;
        gender: string;
        email: string;
        phone: string;
        userRole: string;
        createDatetime: string;
        state: string;
        tags?: string;
    };
}