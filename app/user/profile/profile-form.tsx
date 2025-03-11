'use client'
import { updateProfile } from "@/lib/actions/user.action";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const ProfileForm = () => {

    const { data: session, update } = useSession();
    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name ?? '',
            email: session?.user?.email ?? '',
        }
    });

    return (<>
        Form
    </>);
}

export default ProfileForm;