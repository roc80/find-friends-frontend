declare namespace API {
    type CurrentUser = {
        userName: string;
        avatarUrl: string;
        userId: number;
        gender: string;
        email: string;
        phone: string;
        userRole: string;
        createDatetime: string;
        state: string;
        tags: string;
    };
}