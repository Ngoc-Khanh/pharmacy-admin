import { AuthProvider, RouterProvider, ThemeProvider } from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (import.meta.env.DEV) console.log({ failureCount, error });
          if (failureCount >= 0 && import.meta.env.DEV) return false;
          if (failureCount >= 3 && import.meta.env.PROD) return false;
          return !(
            error instanceof AxiosError &&
            [401, 403].includes(error.response?.status ?? 0)
          )
        },
        refetchOnWindowFocus: import.meta.env.PROD,
        staleTime: 10 * 1000, // 10 seconds
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="admin-ui-theme">
          <AuthProvider>
            <RouterProvider />
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App