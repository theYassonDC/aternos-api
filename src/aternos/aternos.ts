import puppeteer, { Page } from "puppeteer";
import { config } from "./config";

const { hostname, aternos_user, aternos_password } = config

async function connect(req: (page: Page) => Promise<any>) {
  try {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto(`${hostname}/go`)
    await new Promise((r) => setTimeout(r, 3000))
    await page.type('div > .username', aternos_user as string)
    await page.type('div > .password', aternos_password as string)
    await page.click('button.login-button.btn.btn-main.join-left')
    await new Promise((r) => setTimeout(r, 2000))
    await req(page)
    await browser.close()
  } catch (error) {
    throw error
  }
}

async function getinfo(id: string) {
  try {
    const info: any[] = []
    await new Promise<void>((resolve, reject) => {
      try {
        connect(async (page: Page) => {
          await page.click(`div.server-body[data-id=${id}]`, { delay: 3000 })
          await new Promise((r) => setTimeout(r, 3000))
          const l = await page.evaluate(() => {
            const name = document.querySelector('div.navigation-server-name')?.textContent
            const ip = document.querySelector('span#ip')?.textContent
            const version = document.querySelector('span#version')?.textContent
            const status = document.querySelector('span.statuslabel-label')?.textContent
            return {
              name: name?.trim(),
              ip,
              version,
              status: status?.trim()
            }
          })
          info.push(l)
          resolve()
        })
      } catch (e) {
        reject(e)
      }
    })
    return info[0]
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getStatus(page: Page) {
  let stats;
  let status = await page.$eval('span.statuslabel-label', el => el.innerText)
  switch (status) {
    case 'Offline':
      stats = false
      break;
    case 'Loading ...':
      stats = false
      break;
    case 'Online':
      stats = true
      return true
    default:
      break;
  }
  return stats
} // Working function

async function start(id: string, wait: number = 4000) {
  try {
    let msg;
    await new Promise<void>((resolve, reject) => {
      try {
        connect(async (page: Page) => {
          await page.click(`div.server-body[data-id=${id}]`, { delay: 300 })
          await new Promise((r) => setTimeout(r, wait))
          await page.click('div#start.btn.btn-huge.btn-success')
          // await page?.click('button.btn.btn-danger')
          await new Promise((r) => setTimeout(r, wait * 4))
          msg = `Status: online`
          resolve()
        })
      } catch (e) {
        reject(e)
      }
    })
    return msg
  } catch (error) {
    return error
  }
}

async function stop(id: string, wait: number = 4000) {
  try {
    let msg;
    await new Promise<void>((resolve, reject) => {
      try {
        connect(async (page: Page) => {
          await page.click(`div.server-body[data-id=${id}]`, { delay: 300 })
          await new Promise((r) => setTimeout(r, wait))
          await page.click('div#stop.btn.btn-huge.btn-danger')
          msg = 'Status: Offline'
        })
      } catch (e) {
        reject(e)
        return e
      }
    })
    return msg
  } catch (error) {

  }
}

export {
  getinfo,
  start,
  stop
}