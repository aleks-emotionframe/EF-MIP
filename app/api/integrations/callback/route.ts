import { NextRequest } from "next/server"
import { exchangeCodeForTokens, type PlatformType } from "@/lib/api/types"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  const error = request.nextUrl.searchParams.get("error")

  if (error) {
    return new Response(callbackHTML("error", error), {
      headers: { "Content-Type": "text/html" },
    })
  }

  if (!code || !state) {
    return new Response(callbackHTML("error", "Missing code or state"), {
      headers: { "Content-Type": "text/html" },
    })
  }

  let stateData: { organizationId: string; platform: PlatformType; userId: string }
  try {
    stateData = JSON.parse(Buffer.from(state, "base64url").toString())
  } catch {
    return new Response(callbackHTML("error", "Invalid state"), {
      headers: { "Content-Type": "text/html" },
    })
  }

  try {
    const tokens = await exchangeCodeForTokens(stateData.platform, code)

    // Save integration to database if available
    if (prisma) {
      await prisma.integration.upsert({
        where: {
          organizationId_platform_externalId: {
            organizationId: stateData.organizationId,
            platform: stateData.platform,
            externalId: stateData.userId,
          },
        },
        update: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? undefined,
          tokenExpiresAt: tokens.expires_in
            ? new Date(Date.now() + tokens.expires_in * 1000)
            : undefined,
          status: "CONNECTED",
          scopes: tokens.scope ?? undefined,
        },
        create: {
          organizationId: stateData.organizationId,
          platform: stateData.platform,
          externalId: stateData.userId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? undefined,
          tokenExpiresAt: tokens.expires_in
            ? new Date(Date.now() + tokens.expires_in * 1000)
            : undefined,
          status: "CONNECTED",
          scopes: tokens.scope ?? undefined,
        },
      })
    }

    return new Response(callbackHTML("success", stateData.platform), {
      headers: { "Content-Type": "text/html" },
    })
  } catch (err: any) {
    return new Response(callbackHTML("error", err.message), {
      headers: { "Content-Type": "text/html" },
    })
  }
}

function callbackHTML(status: "success" | "error", message: string): string {
  return `<!DOCTYPE html>
<html>
<head><title>Integration ${status === "success" ? "verbunden" : "Fehler"}</title></head>
<body>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: "oauth-callback", status: "${status}", message: "${message}" }, "*");
    window.close();
  } else {
    window.location.href = "/dashboard/settings/integrations?status=${status}";
  }
</script>
<p>${status === "success" ? "Verbindung erfolgreich! Fenster schliesst sich..." : "Fehler: " + message}</p>
</body>
</html>`
}
