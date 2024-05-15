import 'dotenv/config'

export const config = {
  hostname: process.env.ATERNOS_HOST,
  aternos_user: process.env.ATERNOS_USER,
  aternos_password: process.env.ATERNOS_PASSWORD
}