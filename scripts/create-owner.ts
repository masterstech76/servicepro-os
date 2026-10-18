import { createClient } from "@supabase/supabase-js";
import "./verify-env";
import { businessConfig } from "../config/business.config";
import { isRemoteSupabaseConfigured } from "../src/lib/supabase/middleware";
import { getLocalDb } from "../src/lib/server/local-db-fallback";

export async function createOwner() {
  const ownerEmail = process.env.OWNER_EMAIL?.trim() || businessConfig.email;
  const tempPassword = process.env.OWNER_INITIAL_PASSWORD?.trim() || "CoolAirOwner2026!";

  if (!isRemoteSupabaseConfigured()) {
    const db = getLocalDb();
    const biz = Array.from(db.businesses.values())[0];
    db.profiles.set("user_owner", {
      id: "user_owner",
      business_id: biz.id,
      role: "owner",
      technician_id: null,
      full_name: `${businessConfig.businessName} Owner`,
      created_at: new Date().toISOString(),
    });
    console.log(`[create-owner] Owner profile ready for ${ownerEmail} (local mode).`);
    return { userId: "user_owner", email: ownerEmail };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: biz } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", businessConfig.slug)
    .single();

  if (!biz) {
    throw new Error("Business row not found. Run `pnpm sync-config` first.");
  }

  const { data: listData } = await supabase.auth.admin.listUsers();
  let user = listData?.users.find((u) => u.email?.toLowerCase() === ownerEmail.toLowerCase());

  if (!user) {
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: ownerEmail,
      password: tempPassword,
      email_confirm: true,
    });
    if (createErr || !created.user) {
      throw new Error(`Failed to create owner auth user: ${createErr?.message}`);
    }
    user = created.user;
  }

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      business_id: biz.id,
      role: "owner",
      full_name: `${businessConfig.businessName} Owner`,
    },
    { onConflict: "id" }
  );

  console.log(`[create-owner] Owner user & profile synced for ${ownerEmail} (id: ${user.id}).`);
  return { userId: user.id, email: ownerEmail };
}

if (require.main === module) {
  createOwner().catch((err) => {
    console.error("[create-owner] Error:", err);
    process.exit(1);
  });
}
