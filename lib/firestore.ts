import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const DATA_PACKAGES = {
  MTN: [
    { id: "mtn-1", name: "1GB", validity: "1 Day", price: 5.5 },
    { id: "mtn-2", name: "2GB", validity: "3 Days", price: 9.5 },
    { id: "mtn-3", name: "3GB", validity: "7 Days", price: 14 },
    { id: "mtn-4", name: "5GB", validity: "14 Days", price: 22 },
    { id: "mtn-5", name: "10GB", validity: "30 Days", price: 40 },
    { id: "mtn-6", name: "20GB", validity: "30 Days", price: 75 },
  ],
  Telecel: [
    { id: "tel-1", name: "1GB", validity: "1 Day", price: 5 },
    { id: "tel-2", name: "2GB", validity: "3 Days", price: 9 },
    { id: "tel-3", name: "3GB", validity: "7 Days", price: 13 },
    { id: "tel-4", name: "5GB", validity: "14 Days", price: 21 },
    { id: "tel-5", name: "10GB", validity: "30 Days", price: 38 },
    { id: "tel-6", name: "20GB", validity: "30 Days", price: 72 },
  ],
  "AirtelTigo": [
    { id: "at-1", name: "1GB", validity: "1 Day", price: 5 },
    { id: "at-2", name: "2GB", validity: "3 Days", price: 9 },
    { id: "at-3", name: "3GB", validity: "7 Days", price: 13 },
    { id: "at-4", name: "5GB", validity: "14 Days", price: 20 },
    { id: "at-5", name: "10GB", validity: "30 Days", price: 37 },
    { id: "at-6", name: "20GB", validity: "30 Days", price: 70 },
  ],
};

export const AIRTIME_NETWORKS = ["MTN", "Telecel", "AirtelTigo"];

export async function purchaseData(
  userId: string,
  userName: string,
  network: string,
  bundle: { id: string; name: string; validity: string; price: number },
  recipientPhone: string,
  walletBalance: number
) {
  if (walletBalance < bundle.price) throw new Error("Insufficient wallet balance");

  // Deduct from wallet
  await updateDoc(doc(db, "users", userId), {
    walletBalance: increment(-bundle.price),
  });

  // Record transaction
  await addDoc(collection(db, "transactions"), {
    userId,
    userName,
    type: "data_purchase",
    network,
    bundle: bundle.name,
    validity: bundle.validity,
    recipientPhone,
    amount: bundle.price,
    status: "success",
    createdAt: serverTimestamp(),
  });
}

export async function purchaseAirtime(
  userId: string,
  userName: string,
  network: string,
  recipientPhone: string,
  amount: number,
  walletBalance: number
) {
  if (walletBalance < amount) throw new Error("Insufficient wallet balance");

  await updateDoc(doc(db, "users", userId), {
    walletBalance: increment(-amount),
  });

  await addDoc(collection(db, "transactions"), {
    userId,
    userName,
    type: "airtime",
    network,
    recipientPhone,
    amount,
    status: "success",
    createdAt: serverTimestamp(),
  });
}

export async function fundWallet(userId: string, userName: string, amount: number, reference: string) {
  await updateDoc(doc(db, "users", userId), {
    walletBalance: increment(amount),
  });

  await addDoc(collection(db, "transactions"), {
    userId,
    userName,
    type: "wallet_fund",
    amount,
    reference,
    status: "success",
    createdAt: serverTimestamp(),
  });
}

export async function getUserTransactions(userId: string) {
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllTransactions() {
  const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllUsers() {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function adminCreditWallet(userId: string, amount: number, adminName: string) {
  await updateDoc(doc(db, "users", userId), {
    walletBalance: increment(amount),
  });
  await addDoc(collection(db, "transactions"), {
    userId,
    type: "admin_credit",
    amount,
    adminName,
    status: "success",
    createdAt: serverTimestamp(),
  });
}
