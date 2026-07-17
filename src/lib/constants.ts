export const APP_CONFIG = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Sg Pay 4u",
  address: process.env.NEXT_PUBLIC_ADDRESS || "123 Street, New York, USA",
  phone: process.env.NEXT_PUBLIC_PHONE || "+012 345 6789",
  phoneRaw: process.env.NEXT_PUBLIC_PHONE_RAW || "+012 345 67890",
  email: process.env.NEXT_PUBLIC_EMAIL || "info@example.com",
  workingHours: process.env.NEXT_PUBLIC_HOURS || "9.00 am - 9.00 pm",
  socials: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com",
  }
};
