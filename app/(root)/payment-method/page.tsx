import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@/auth";
import { Metadata } from "next";
import PaymentmethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
    title: "Select Payment Method",
}


const PaymentMethodPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error('User not found');

    const user = await getUserById(userId);
    return (<>
        <CheckoutSteps current={2} />
        <PaymentmethodForm preferredPaymentMethod={user.paymentMethod} />
    </>);
}

export default PaymentMethodPage;