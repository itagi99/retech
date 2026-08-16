"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteCustomerSession } from "@/lib/customer-session";

export async function logoutCustomer() {
  await deleteCustomerSession();
  revalidatePath("/");
  revalidatePath("/account");
  redirect("/login");
}
