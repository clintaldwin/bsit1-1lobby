import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, reason: "method_not_allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!token) return json({ ok: false, reason: "unauthenticated" }, 401);

    const body = await req.json().catch(() => null);
    const accessCode =
      body && typeof body.access_code === "string" ? body.access_code.trim() : "";
    if (!accessCode) return json({ ok: false, reason: "missing_code" }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const secretKeysJson = Deno.env.get("SUPABASE_SECRET_KEYS");
    if (!supabaseUrl || !secretKeysJson) {
      console.error("Missing Supabase Edge Function environment variables");
      return json({ ok: false, reason: "server_configuration" }, 500);
    }

    const secretKeys = JSON.parse(secretKeysJson);
    const secretKey = secretKeys.default;
    if (!secretKey) {
      console.error("Default Supabase secret key is unavailable");
      return json({ ok: false, reason: "server_configuration" }, 500);
    }

    const supabaseAdmin = createClient(supabaseUrl, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) return json({ ok: false, reason: "unauthenticated" }, 401);

    const { data: sections, error: sectionError } = await supabaseAdmin
      .from("sections")
      .select("id, code")
      .eq("code", "BSIT 1-1")
      .limit(1);

    if (sectionError || !sections?.[0]) {
      console.error("Section lookup failed:", sectionError);
      return json({ ok: false, reason: "section_not_configured" }, 500);
    }

    const section = sections[0];

    const { data: credentials, error: credentialError } =
      await supabaseAdmin
        .from("section_access_credentials")
        .select("section_id, admin_password_hash, active")
        .eq("section_id", section.id)
        .eq("active", true)
        .limit(1);

    if (credentialError || !credentials?.[0]) {
      console.error("Credential lookup failed:", credentialError);
      return json({ ok: false, reason: "admin_access_not_configured" }, 500);
    }

    const submittedHash = await sha256Hex(accessCode);
    if (submittedHash !== credentials[0].admin_password_hash) {
      return json({ ok: false, reason: "invalid_code" }, 403);
    }

    const userId = userData.user.id;

    const { data: existingMember, error: memberLookupError } =
      await supabaseAdmin
        .from("members")
        .select("id")
        .eq("user_id", userId)
        .eq("section_id", section.id)
        .limit(1)
        .maybeSingle();

    if (memberLookupError) {
      console.error("Member lookup failed:", memberLookupError);
      return json({ ok: false, reason: "member_lookup_failed" }, 500);
    }

    if (existingMember?.id) {
      const { error: updateError } = await supabaseAdmin
        .from("members")
        .update({ role: "admin", status: "active" })
        .eq("id", existingMember.id);

      if (updateError) {
        console.error("Admin promotion failed:", updateError);
        return json({ ok: false, reason: "membership_update_failed" }, 500);
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("members")
        .insert({
          section_id: section.id,
          user_id: userId,
          name: "Section Administrator",
          email: userData.user.email ?? null,
          role: "admin",
          status: "active",
        });

      if (insertError) {
        console.error("Admin membership creation failed:", insertError);
        return json({ ok: false, reason: "membership_create_failed" }, 500);
      }
    }

    return json({ ok: true, section_id: section.id, role: "admin" });
  } catch (error) {
    console.error("Unhandled admin access error:", error);
    return json({ ok: false, reason: "server_error" }, 500);
  }
});
