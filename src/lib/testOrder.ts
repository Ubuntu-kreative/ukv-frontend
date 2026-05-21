import { supabase } from "./supabase";

export async function createTestOrder() {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: "Ubuntu Test Customer",
        phone: "254700000000",
        items: [
          {
            name: "Cheese Burger",
            quantity: 2,
            price: 1500
          }
        ],
        subtotal: 3000,
        delivery_fee: 0,
        total: 3000,
        payment_status: "pending"
      }
    ])
    .select();

  if (error) {
    console.error(error);
    return;
  }

  console.log("ORDER CREATED:", data);
}