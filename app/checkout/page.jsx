"use client"

import { useEffect, useState } from "react"
import api from "@/utils/axios"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"

import {
    SquareCheck,
    MapPinHouse,
    ShoppingCart,
    CreditCard
} from "lucide-react"

const CheckoutPage = () => {
    const [cart, setCart] = useState({
        items: [],
        total_quantity: 0,
        total_price: 0
    })

    const [addresses, setAddresses] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState(null)
    const [selectedGateway, setSelectedGateway] = useState("mock")
    const [loading, setLoading] = useState(true)
    const [checkoutLoading, setCheckoutLoading] = useState(false)

    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const fetchCartAndAddress = async () => {
        try {
            const [cartResponse, addressResponse] = await Promise.all([
                api.get("/api/carts"),
                api.get("/api/shippings/addresses")
            ])

            setCart(cartResponse.data)
            setAddresses(addressResponse.data)

            console.log("cart-------", cartResponse.data)

        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                "Failed to load checkout data"
            )
        } finally {
            setLoading(false)
        }
    }

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a shipping address.")
            return
        }

        if (!selectedGateway) {
            toast.error("Please select a payment gateway.")
            return
        }

        try {
            setCheckoutLoading(true)

            const response = await api.post("/api/orders/checkout", {
                amount: cart.total_price,
                shipping_address_id: selectedAddressId,
                gateway: selectedGateway,
                simulate_success: true,
            })

            console.log("checkout success", response.data)

            toast.success("Order placed successfully!")

            // clear frontend cart ONLY after success
            setCart({
                items: [],
                total_quantity: 0,
                total_price: 0
            })

            router.push("/user/order")

        } catch (error) {
            console.log(error)

            toast.error(
                error.response?.data?.detail ||
                "Checkout failed. Try again."
            )

        } finally {
            setCheckoutLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login?redirect=/checkout")
            } else {
                fetchCartAndAddress()
            }
        }
    }, [authLoading, user])

    if (loading || authLoading) {
        return (
            <div className="text-center py-8 text-gray-600">
                Loading checkout...
            </div>
        )
    }

    if (!cart?.items || cart.items.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600">
                🛒 Your cart is empty
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                Order Summary
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Shipping Address */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        <MapPinHouse className="inline mr-2" />
                        Select Shipping Address
                    </h2>

                    {addresses.length === 0 ? (
                        <p className="text-gray-500">
                            No saved addresses found.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {addresses.map((addr) => (
                                <label
                                    key={addr.id}
                                    className={`block border rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 ${
                                        selectedAddressId === addr.id
                                            ? "border-blue-600 shadow-md"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value={addr.id}
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => setSelectedAddressId(addr.id)}
                                        className="hidden"
                                    />

                                    <div className="space-y-1 text-sm">
                                        <p className="font-semibold">
                                            {addr.name}
                                        </p>

                                        <p>{addr.address_line1}</p>

                                        {addr.address_line2 && (
                                            <p>{addr.address_line2}</p>
                                        )}

                                        <p>
                                            {addr.city}, {addr.state} - {addr.pin_code}
                                        </p>

                                        <p>{addr.country}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        <ShoppingCart className="inline mr-2" />
                        Your Cart
                    </h2>

                    <div className="space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-lg p-4 shadow-sm"
                            >
                                <div className="grid grid-cols-6 items-center">
                                    <div className="col-span-3">
                                        <h3 className="font-semibold">
                                            {item.product_title}
                                        </h3>
                                    </div>

                                    <div className="col-span-2 text-center text-sm text-gray-600">
                                        ৳{item.price} × {item.quantity}
                                    </div>

                                    <div className="col-span-1 text-right font-medium">
                                        ৳{item.total}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">
                            <CreditCard className="inline mr-2" />
                            Payment Method
                        </h2>

                        <div className="flex gap-4">
                            <label
                                className={`px-4 py-2 border rounded-lg cursor-pointer ${
                                    selectedGateway === "mock"
                                        ? "border-green-600 bg-green-50"
                                        : "border-gray-300"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="gateway"
                                    value="mock"
                                    checked={selectedGateway === "mock"}
                                    onChange={() => setSelectedGateway("mock")}
                                    className="hidden"
                                />

                                Mock Payment
                            </label>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="mt-6 border-t pt-4 text-right">
                        <p className="text-lg font-semibold">
                            Total ({cart.total_quantity} items):
                            {" "}৳{cart.total_price}
                        </p>

                        <button
                            onClick={handleCheckout}
                            disabled={checkoutLoading}
                            className="mt-4 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition disabled:opacity-50"
                        >
                            <SquareCheck className="inline mr-2" />

                            {checkoutLoading
                                ? "Processing..."
                                : "Checkout Now"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage