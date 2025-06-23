import { RouterProvider, ThemeProvider } from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="admin-ui-theme">
        <HelmetProvider>
          <Toaster richColors />
          <RouterProvider />
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App