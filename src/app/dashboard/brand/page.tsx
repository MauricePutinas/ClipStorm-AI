import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { serializeBrandProfile } from "@/lib/serializers";
import { PageHeader } from "@/components/dashboard/page-header";
import { BrandManager, type BrandProfileData } from "@/components/brand/brand-manager";

export const metadata = { title: "Brand Profile" };

export default async function BrandPage() {
  const user = await getCurrentUser();
  const profiles = await prisma.brandProfile.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  const data: BrandProfileData[] = profiles.map(serializeBrandProfile);

  return (
    <div>
      <PageHeader
        title="Brand Profile"
        description="Speichere Tonalität, Nische, Tabu-Wörter und CTA-Stil – sie fließen automatisch in die Clip-Generierung ein."
      />
      <BrandManager profiles={data} />
    </div>
  );
}
