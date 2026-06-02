import {z} from "zod"

const userSchema=z.object({
    name:z.string().trim().min(1).max(50).optional(),
    username:z.string().trim().min(1).max(30).optional(),
    email:z.email().optional(),
    job:z.string().trim().optional().optional(),
    bio:z.string().trim().max(200).optional().optional(),
    profileImage:z.string().trim().optional().optional(),

})

export default userSchema