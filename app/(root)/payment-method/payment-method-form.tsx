'use client';

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import {paymentMethodSchema} from "@/lib/validators";
import CheckoutSteps from "@/components/shared/checkout-steps";

const PaymentmethodForm = ({ preferredPaymentMethod }: { preferredPaymentMethod: string | null }) => {
    return (<>
        Form
    </>);
}

export default PaymentmethodForm;