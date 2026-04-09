export interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  scope?: string
}

export interface MetricData {
  metricName: string
  metricValue: number
  dimensions?: Record<string, string>
  period: string
}

export type PlatformType =
  | "GOOGLE_ANALYTICS"
  | "SEARCH_CONSOLE"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "YOUTUBE"
  | "LINKEDIN"
  | "TIKTOK"

export function getOAuthConfig(platform: PlatformType): OAuthConfig {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000"

  const configs: Record<PlatformType, OAuthConfig> = {
    GOOGLE_ANALYTICS: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirectUri: `${baseUrl}/api/integrations/callback?platform=GOOGLE_ANALYTICS`,
      scopes: [
        "https://www.googleapis.com/auth/analytics.readonly",
      ],
    },
    SEARCH_CONSOLE: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirectUri: `${baseUrl}/api/integrations/callback?platform=SEARCH_CONSOLE`,
      scopes: [
        "https://www.googleapis.com/auth/webmasters.readonly",
      ],
    },
    INSTAGRAM: {
      clientId: process.env.FACEBOOK_APP_ID ?? "",
      clientSecret: process.env.FACEBOOK_APP_SECRET ?? "",
      redirectUri: `${baseUrl}/api/integrations/callback?platform=INSTAGRAM`,
      scopes: [
        "instagram_basic",
        "instagram_manage_insights",
        "pages_show_list",
      ],
    },
    FACEBOOK: {
      clientId: process.env.FACEBOOK_APP_ID ?? "",
      clientSecret: process.env.FACEBOOK_APP_SECRET ?? "",
      redirectUri: `${baseUrl}/api/integrations/callback?platform=FACEBOOK`,
      scopes: [
        "pages_show_list",
        "pages_read_engagement",
        "read_insights",
      ],
    },
    YOUTUBE: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirectUri: `${baseUrl}/api/integrations/callback?platform=YOUTUBE`,
      scopes: [
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/yt-analytics.readonly",
      ],
    },
    LINKEDIN: {
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      redirectUri: `${baseUrl}/api/integrations/callback?platform=LINKEDIN`,
      scopes: ["r_organization_social", "rw_organization_admin"],
    },
    TIKTOK: {
      clientId: process.env.TIKTOK_CLIENT_KEY ?? "",
      clientSecret: process.env.TIKTOK_CLIENT_SECRET ?? "",
      redirectUri: `${baseUrl}/api/integrations/callback?platform=TIKTOK`,
      scopes: ["user.info.basic", "video.list"],
    },
  }

  return configs[platform]
}

export function getOAuthUrl(platform: PlatformType, state: string): string {
  const config = getOAuthConfig(platform)

  switch (platform) {
    case "GOOGLE_ANALYTICS":
    case "SEARCH_CONSOLE":
    case "YOUTUBE": {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: config.scopes.join(" "),
        access_type: "offline",
        prompt: "consent",
        state,
      })
      return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    }
    case "INSTAGRAM":
    case "FACEBOOK": {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: config.scopes.join(","),
        state,
      })
      return `https://www.facebook.com/v19.0/dialog/oauth?${params}`
    }
    case "LINKEDIN": {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: config.scopes.join(" "),
        state,
      })
      return `https://www.linkedin.com/oauth/v2/authorization?${params}`
    }
    case "TIKTOK": {
      const params = new URLSearchParams({
        client_key: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: config.scopes.join(","),
        state,
      })
      return `https://www.tiktok.com/v2/auth/authorize/?${params}`
    }
  }
}

export async function exchangeCodeForTokens(
  platform: PlatformType,
  code: string
): Promise<TokenResponse> {
  const config = getOAuthConfig(platform)

  switch (platform) {
    case "GOOGLE_ANALYTICS":
    case "SEARCH_CONSOLE":
    case "YOUTUBE": {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUri,
          grant_type: "authorization_code",
        }),
      })
      return res.json()
    }
    case "INSTAGRAM":
    case "FACEBOOK": {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?${new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUri,
          code,
        })}`
      )
      return res.json()
    }
    case "LINKEDIN": {
      const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUri,
        }),
      })
      return res.json()
    }
    case "TIKTOK": {
      const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_key: config.clientId,
          client_secret: config.clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: config.redirectUri,
        }),
      })
      const data = await res.json()
      return data.data ?? data
    }
  }
}

export async function refreshAccessToken(
  platform: PlatformType,
  refreshToken: string
): Promise<TokenResponse> {
  const config = getOAuthConfig(platform)

  switch (platform) {
    case "GOOGLE_ANALYTICS":
    case "SEARCH_CONSOLE":
    case "YOUTUBE": {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          refresh_token: refreshToken,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          grant_type: "refresh_token",
        }),
      })
      return res.json()
    }
    case "LINKEDIN": {
      const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: config.clientId,
          client_secret: config.clientSecret,
        }),
      })
      return res.json()
    }
    case "TIKTOK": {
      const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_key: config.clientId,
          client_secret: config.clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      })
      const data = await res.json()
      return data.data ?? data
    }
    default:
      // Facebook/Instagram long-lived tokens don't use refresh_token
      throw new Error(`Refresh not supported for ${platform}`)
  }
}
