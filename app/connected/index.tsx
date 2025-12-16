// app/(connected)/screens/_index.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/connected/screens/acceuil");
  }, [router]);

  return null;
}
