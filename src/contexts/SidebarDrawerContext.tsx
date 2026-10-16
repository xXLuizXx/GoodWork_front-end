import { ReactNode, createContext, useContext, useEffect } from "react";
import { UseDisclosureReturn, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";

// Abre e fecha o menu lateral em telas pequenas, onde ele vira uma gaveta (botão ☰ no Header)
const SidebarDrawerContext = createContext({} as UseDisclosureReturn);

interface SidebarDrawerProviderProps {
  children: ReactNode;
}

export function SidebarDrawerProvider({ children }: SidebarDrawerProviderProps) {
  const disclosure = useDisclosure();
  const router = useRouter();

  // Fecha a gaveta ao navegar para outra página
  useEffect(() => {
    router.events.on("routeChangeStart", disclosure.onClose);
    return () => router.events.off("routeChangeStart", disclosure.onClose);
  }, [router.events, disclosure.onClose]);

  return (
    <SidebarDrawerContext.Provider value={disclosure}>
      {children}
    </SidebarDrawerContext.Provider>
  );
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext);
