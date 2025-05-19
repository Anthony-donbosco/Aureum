export declare const authService: {
    login: (email: any, password: any) => Promise<{
        user: any;
        token: any;
    }>;
    register: (userData: any) => Promise<{
        user: any;
        token: any;
    }>;
    changePassword: (oldPassword: any, newPassword: any) => Promise<any>;
    updateProfile: (userData: any) => Promise<any>;
};
export default authService;
