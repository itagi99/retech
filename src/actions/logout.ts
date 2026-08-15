"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteCustomerSession } from "@/lib/customer-session";

export async function logoutCustomer() {
  deleteCustomerSession();
  redirect("/");
}
