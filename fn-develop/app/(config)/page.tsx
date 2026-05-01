"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Redrict = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      router.push("/auth"); 
    } else if (status === "authenticated") {
      setIsLoading(false);
      const userRole = session?.user?.role;
      if (userRole === "librarian") {
        router.push("/library"); 
      } else if (userRole) {
        router.push(`/${userRole}`); 
      }
    }
  }, [status, session, router]);

  return (
    <>
      {isLoading && <p></p>} 
    </>
  );
};

export default Redrict;
