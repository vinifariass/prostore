'use client'

import { updateUserSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { z } from "zod";

const UpdateUserForm = ({user}: {
    user:z.infer<typeof updateUserSchema>
}) => {
    const router = useRouter();
    
    return (  <>Update Form</>);
}
 
export default UpdateUserForm;