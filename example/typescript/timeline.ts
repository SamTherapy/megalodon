import Mastodon, { Status, Response } from 'megalodon'

declare var process: {
  env: {
    MASTODON_ACCESS_TOKEN: string
  }
}

const BASE_URL: string = 'https://mastodon.social'

const access_token: string = process.env.MASTODON_ACCESS_TOKEN

const client = new Mastodon(access_token, BASE_URL + '/api/v1')

client.get<Array<Status>>('/timelines/public').then((resp: Response<Array<Status>>) => {
  console.log(resp.data)
})
