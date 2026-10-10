import { redirect } from "next/navigation";

export default function Home() {
  redirect("/chat"); // se não houver sessão, o guarda de (app) envia para /login
}