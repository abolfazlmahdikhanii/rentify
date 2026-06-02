import { z } from "zod";
const authSchema = z.object({
  email: z.email(),
});


export { authSchema };
