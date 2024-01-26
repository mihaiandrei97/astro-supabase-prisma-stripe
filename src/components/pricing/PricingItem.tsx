import type { Product } from "@/lib/products";
import { useElementSize, useMouse } from "@mantine/hooks";
import { CheckIcon, ShieldCloseIcon } from "lucide-react";
import { useState } from "react";
import { useCheckoutMutation } from "./useCheckoutMutation";
import { useToast } from "@/components/ui/use-toast"
import type { ProTier } from "@prisma/client";

interface IPricingItem {
    type: 'buy' | 'upgrade';
    loggedIn: boolean;
    product: Product;
}

export default function PricingItem({
    product,
    type,
    loggedIn
}: IPricingItem) {
    const { toast } = useToast()
    const checkoutMutation = useCheckoutMutation();

    const { ref: circleEl, width, height } = useElementSize();
    const { ref: cardEl, x, y } = useMouse();

    const [position, setPosition] = useState({ left: 0, top: 0 });
    const [opacity, setOpacity] = useState(0);

    function handleMouseMove() {
        setOpacity(0.6);
        setPosition({ left: x - width / 2, top: y - height / 2 });
    }

    function handleMouseLeave() {
        setOpacity(0);
    }

    function handleSubscribe(proTier: ProTier) {
        checkoutMutation.mutate(proTier, {
            onSuccess: (data) => {
               window.location.href = data.url;
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                })
                console.log(error);
            }
        })
    }

    return (
        <div
            className="bg-purple-500 dark:bg-purple-800 relative animated-border rounded-xl before:w-[200%] shadow-[0_15px_30px_-5px_rgba(255,255,255,0.1)]"
            style={{ color: product.color }}
        >
            <div
                ref={cardEl}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="text-slate-100 p-8 rounded-xl w-[400px] max-w-full relative overflow-hidden z-10 h-full"
                key={product.proTier}
            >
                <div
                    ref={circleEl}
                    style={{
                        left: position.left,
                        top: position.top,
                        opacity,
                        background: product.color,
                    }}
                    className="absolute scale-[1.5] blur-3xl w-40 h-40 rounded-full -z-10 transition-opacity duration-300 hidden md:block"
                ></div>

                <h3 className="text-3xl font-bold text-center">
                    {product.name}
                    {/* <span className="bg-purple-800 text-sm font-medium text-white rounded px-4 py-2 shadow-[0_0_25px_2px_rgba(255,255,255,0.2)]">
                        Early Bird Price
                    </span> */}
                </h3>

                <p className="text-purple-100 my-4 text-center">
                    {product.description}
                </p>

                <div className="text-5xl mt-8 relative text-center">
                    <strong>
                        $
                        {product.price / 100}
                    </strong>
                </div>

                <p className="text-purple-100 my-2 text-center text-lg">
                    Pay once. <strong>Unlock forever!</strong>
                </p>

                <button
                    onClick={() => handleSubscribe(product.proTier)}
                    style={{ background: product.color }}
                    className={`rounded-xl text-white text-lg py-4 w-full my-8 font-semibold hover:opacity-80 group relative`}
                >
                    {checkoutMutation.status === 'pending' ? (
                        'Loading...'
                    ) : (
                        <>
                            {type === 'upgrade' ? 'Upgrade to' : 'Buy'}{' '}
                            {product.name}
                        </>
                    )}

                    {!loggedIn && (
                            <a className="hidden bg-white border-2 border-purple-900 w-full h-full text-center font-semibold rounded-xl absolute inset-0 text-black group-hover:flex items-center justify-center" href="/login">
                                You must login first
                            </a>
                    )}
                </button>

                <ul className="space-y-2">
                    {product.benefits.map((benefit: any) => (
                        <li
                            className={`flex items-center gap-2 ${
                                !benefit.available ? 'text-gray-200 dark:text-gray-400' : ''
                            }`}
                            key={benefit.text}
                        >
                            {benefit.available ? (
                                <CheckIcon />
                            ) : (
                                <span className="text-red-500">
                                    <ShieldCloseIcon />
                                </span>
                            )}
                            {benefit.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
