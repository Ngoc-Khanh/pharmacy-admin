import { RouterProvider, ThemeProvider } from "@/providers";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="admin-ui-theme">
        <HelmetProvider>
          <RouterProvider />
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App