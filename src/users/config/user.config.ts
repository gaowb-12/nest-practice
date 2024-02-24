import { registerAs } from "@nestjs/config";
export default registerAs("users" ,()=>({
    username: "admin"
}))