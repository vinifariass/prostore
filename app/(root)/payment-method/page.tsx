import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@/auth";
import { Metadata } from "next";
import PaymentmethodForm from "./payment-method-form";

export const metadata: Metadata = {
    title: "Select Payment Method",
}


const PaymentMethodPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) throw new Error('User not found');

    const user = await getUserById(userId);
    return (<>
        <PaymentmethodForm preferredPaymentMethod={user.paymentMethod} />
    </>);
}

export default PaymentMethodPage;