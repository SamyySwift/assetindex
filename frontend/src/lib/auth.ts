import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getDataFromToken() {
    try {
        const token = (await cookies()).get("token")?.value || '';
        if (!token) return null;

        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_please_change');
        return decodedToken.id;
    } catch (error: any) {
        return null; // Invalid token
    }
}
