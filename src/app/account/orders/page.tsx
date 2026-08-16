import { getUserOrders } from "@/actions/orders";
import AccountOrdersClient from "@/components/account/orders-client";

export default async function AccountOrdersPage() {
  const orders = await getUserOrders();

  return <AccountOrdersClient initialOrders={orders} />;
}