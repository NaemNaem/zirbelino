import { CommerceProvider } from "@/components/commerce/CommerceProvider";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  getCategoryRepository,
  getContentRepository,
} from "@/repositories";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [navigation, categories] = await Promise.all([
    getContentRepository().getNavigation(),
    getCategoryRepository().getAll(),
  ]);

  return (
    <CommerceProvider>
      <SiteHeader navigation={navigation} categories={categories} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <CartDrawer />
    </CommerceProvider>
  );
}
