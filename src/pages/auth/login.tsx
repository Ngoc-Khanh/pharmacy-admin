import { routeNames, routes, siteConfig } from "@/config";
import { Helmet } from "react-helmet-async";

export default function LoginPage() {
  return (
    <div>
      <Helmet>
        <title>{routeNames[routes.auth.login]} | {siteConfig.name}</title>
      </Helmet>
    </div>
  );
}