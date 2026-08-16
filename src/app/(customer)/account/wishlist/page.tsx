import { getWishlist } from "@/actions/wishlist";
import AccountWishlistClient from "@/components/account/wishlist-client";

export default async function AccountWishlistPage() {
  const items = await getWishlist();

  return <AccountWishlistClient initialItems={items} />;
}