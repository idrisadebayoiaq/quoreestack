import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");

    if (authHeader) {
      const supabaseUser = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } },
      );

      const {
        data: { user },
      } = await supabaseUser.auth.getUser();
      userId = user?.id ?? null;
    }

    const { slug } = await req.json();
    if (
      typeof slug !== "string" ||
      slug.length > 120 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ) {
      return json({ error: "A valid app slug is required" }, 400);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: app, error: appError } = await supabaseAdmin
      .from("mobile_apps")
      .select("id, name, slug, status")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (appError || !app) {
      return json({ error: "App not found" }, 404);
    }

    const { data: version, error: versionError } = await supabaseAdmin
      .from("app_versions")
      .select("id, apk_path, version")
      .eq("app_id", app.id)
      .eq("is_latest", true)
      .single();

    if (versionError || !version) {
      return json({ error: "No APK available" }, 404);
    }

    const expiresIn = 900;
    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("apks")
      .createSignedUrl(version.apk_path, expiresIn, {
        download: `${app.slug}-v${version.version}.apk`,
      });

    if (signError || !signed?.signedUrl) {
      return json({ error: "Failed to generate download URL" }, 500);
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? null;
    const { error: logError } = await supabaseAdmin.from("downloads").insert({
      user_id: userId,
      app_id: app.id,
      version_id: version.id,
      ip_address: ipAddress,
      user_agent: req.headers.get("user-agent"),
    });

    if (logError) {
      console.error("Failed to log APK download", logError);
    }

    return json({
      signedUrl: signed.signedUrl,
      expiresIn,
      version: version.version,
    });
  } catch (error) {
    console.error("download-apk failed", error);
    return json({ error: "Internal server error" }, 500);
  }
});
