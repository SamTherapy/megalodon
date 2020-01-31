import APIClient from './mastodon/api_client'
import { ProxyConfig } from './proxy_config'
import OAuth from './oauth'
import Response from './response'
import { Application } from './entities/application'
import { Account } from './entities/account'
import { Status } from './entities/status'
import { List } from './entities/list'
import { IdentityProof } from './entities/identity_proof'
import { Relationship } from './entities/relationship'
import { Filter } from './entities/filter'
import { Report } from './entities/report'
import { FeaturedTag } from './entities/featured_tag'
import { Tag } from './entities/tag'
import { Preferences } from './entities/preferences'
import { Context } from './entities/context'
import { Attachment } from './entities/attachment'
import { Poll } from './entities/poll'
import { ScheduledStatus } from './entities/scheduled_status'
import { Conversation } from './entities/conversation'
import { Marker } from './entities/marker'
import { Notification } from './entities/notification'
import { Results } from './entities/results'
import { Instance } from './entities/instance'
import { Activity } from './entities/activity'
import { Emoji } from './entities/emoji'
import { PushSubscription } from './entities/push_subscription'
import { Token } from './entities/token'
import StreamListener from './mastodon/stream_listener'
import WebSocket from './mastodon/web_socket'

const NO_REDIRECT = 'urn:ietf:wg:oauth:2.0:oob'
const DEFAULT_URL = 'https://mastodon.social'
const DEFAULT_SCOPE = 'read write follow'
const DEFAULT_UA = 'megalodon'

export interface MastodonInterface {
  verifyAppCredentials(): Promise<Response<Application>>
  registerAccount(
    username: string,
    email: string,
    password: string,
    agreement: boolean,
    locale: string,
    reason?: string | null
  ): Promise<Response<Token>>
  verifyAccountCredentials(): Promise<Response<Account>>
  updateCredentials(
    discoverable?: string | null,
    bot?: boolean | null,
    display_name?: string | null,
    note?: string | null,
    avatar?: string | null,
    header?: string | null,
    locked?: boolean | null,
    source?: {
      privacy?: string
      sensitive?: boolean
      language?: string
    } | null,
    fields_attributes?: Array<{ name: string; value: string }>
  ): Promise<Response<Account>>
  getAccount(id: string): Promise<Response<Account>>
  getAccountStatuses(id: string): Promise<Response<Array<Status>>>
  getAccountFollowers(
    id: string,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null
  ): Promise<Response<Array<Account>>>
  getAccountFollowing(
    id: string,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null
  ): Promise<Response<Array<Account>>>
  getAccountLists(id: string): Promise<Response<Array<List>>>
  getIdentityProof(id: string): Promise<Response<Array<IdentityProof>>>
  followAccount(id: string, reblog: boolean): Promise<Response<Relationship>>
  unfollowAccount(id: string): Promise<Response<Relationship>>
  blockAccount(id: string): Promise<Response<Relationship>>
  unblockAccount(id: string): Promise<Response<Relationship>>
  muteAccount(id: string, notifications: boolean): Promise<Response<Relationship>>
  unmuteAccount(id: string): Promise<Response<Relationship>>
  pinAccount(id: string): Promise<Response<Relationship>>
  unpinAccount(id: string): Promise<Response<Relationship>>
  getRelationship(ids: Array<string>): Promise<Response<Relationship>>
  searchAccount(q: string, limit?: number | null, max_id?: string | null, since_id?: string | null): Promise<Response<Array<Account>>>
  getBookmarks(
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>>
  getFavourites(limit?: number | null, max_id?: string | null, min_id?: string | null): Promise<Response<Array<Status>>>
  getMutes(limit?: number | null, max_id?: string | null, min_id?: string | null): Promise<Response<Array<Account>>>
  getBlocks(limit?: number | null, max_id?: string | null, min_id?: string | null): Promise<Response<Array<Account>>>
  getDomainBlocks(limit?: number | null, max_id?: string | null, min_id?: string | null): Promise<Response<Array<string>>>
  blockDomain(domain: string): Promise<Response<{}>>
  unblockDomain(domain: string): Promise<Response<{}>>
  getFilters(): Promise<Response<Array<Filter>>>
  getFilter(id: string): Promise<Response<Filter>>
  createFilter(
    phrase: string,
    context: Array<'home' | 'notifications' | 'public' | 'thread'>,
    irreversible?: boolean | null,
    whole_word?: boolean | null,
    expires_in?: string | null
  ): Promise<Response<Filter>>
  updateFilter(
    id: string,
    phrase: string,
    context: Array<'home' | 'notifications' | 'public' | 'thread'>,
    irreversible?: boolean | null,
    whole_word?: boolean | null,
    expires_in?: string | null
  ): Promise<Response<Filter>>
  deleteFilter(id: string): Promise<Response<Filter>>
  report(
    account_id: string,
    status_ids?: Array<string> | null,
    comment?: string | null,
    forward?: boolean | null
  ): Promise<Response<Report>>
  getFollowRequests(limit?: number): Promise<Response<Array<Account>>>
  acceptFollowRequest(id: string): Promise<Response<Relationship>>
  rejectFollowRequest(id: string): Promise<Response<Relationship>>
  getEndorsements(limit?: number | null, max_id?: string | null, since_id?: string | null): Promise<Response<Array<Account>>>
  getFeaturedTags(): Promise<Response<Array<FeaturedTag>>>
  createFeaturedTag(name: string): Promise<Response<FeaturedTag>>
  deleteFeaturedTag(id: string): Promise<Response<{}>>
  getSuggestedTags(): Promise<Response<Array<Tag>>>
  getPreferences(): Promise<Response<Preferences>>
  getSuggestions(limit?: number): Promise<Response<Array<Account>>>
  postStatus(
    status: string,
    media_ids: Array<string>,
    poll?: { options: Array<string>; expires_in: number; multiple?: boolean; hide_totals?: boolean } | null,
    in_reply_to_id?: string | null,
    sensitive?: boolean | null,
    spoiler_text?: string | null,
    visibility?: 'public' | 'unlisted' | 'private' | 'direct' | null,
    scheduled_at?: string | null,
    language?: string | null
  ): Promise<Response<Status>>
  getStatus(id: string): Promise<Response<Status>>
  deleteStatus(id: string): Promise<Response<Status>>
  getStatusContext(id: string): Promise<Response<Context>>
  getStatusRebloggedBy(id: string): Promise<Response<Array<Account>>>
  getStatusFavouritedBy(id: string): Promise<Response<Array<Account>>>
  favouriteStatus(id: string): Promise<Response<Status>>
  unfavouriteStatus(id: string): Promise<Response<Status>>
  reblogStatus(id: string): Promise<Response<Status>>
  unreblogStatus(id: string): Promise<Response<Status>>
  bookmarkStatus(id: string): Promise<Response<Status>>
  unbookmarkStatus(id: string): Promise<Response<Status>>
  muteStatus(id: string): Promise<Response<Status>>
  unmuteStatus(id: string): Promise<Response<Status>>
  pinStatus(id: string): Promise<Response<Status>>
  unpinStatus(id: string): Promise<Response<Status>>
  uploadMedia(file: any, description?: string | null, focus?: string | null): Promise<Response<Attachment>>
  updateMedia(id: string, file?: any, description?: string | null, focus?: string | null): Promise<Response<Attachment>>
  getPoll(id: string): Promise<Response<Poll>>
  votePoll(id: string, choices: Array<number>): Promise<Response<Poll>>
  getScheduledStatuses(
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<ScheduledStatus>>>
  getScheduledStatus(id: string): Promise<Response<ScheduledStatus>>
  scheduleStatus(id: string, scheduled_at?: string | null): Promise<Response<ScheduledStatus>>
  cancelScheduledStatus(id: string): Promise<Response<{}>>
  getPublicTimeline(
    local?: boolean | null,
    only_media?: boolean | null,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>>
  getTagTimeline(
    hashtag: string,
    local?: boolean | null,
    only_media?: boolean | null,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>>
  getHomeTimeline(
    local?: boolean | null,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>>
  getListTimeline(
    list_id: string,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>>
  getConversationTimeline(
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>>
  deleteConversation(id: string): Promise<Response<{}>>
  readConversation(id: string): Promise<Response<Conversation>>
  getLists(): Promise<Response<Array<List>>>
  getList(id: string): Promise<Response<List>>
  createList(title: string): Promise<Response<List>>
  updateList(id: string, title: string): Promise<Response<List>>
  deleteList(id: string): Promise<Response<{}>>
  getAccountsInList(id: string, limit?: number | null, max_id?: string | null, since_id?: string | null): Promise<Response<Array<Account>>>
  addAccountsToList(id: string, account_ids: Array<string>): Promise<Response<{}>>
  deleteAccountsFromList(id: string, account_ids: Array<string>): Promise<Response<{}>>
  getMarker(timeline: Array<'home' | 'notifications'>): Promise<Response<Marker | {}>>
  saveMarker(home?: { last_read_id: string } | null, notifications?: { last_read_id: string } | null): Promise<Response<Marker>>
  getNotifications(
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null,
    exclude_type?: Array<'follow' | 'favourite' | 'reblog' | 'mention' | 'poll'> | null,
    account_id?: string | null
  ): Promise<Response<Array<Notification>>>
  getNotification(id: string): Promise<Response<Notification>>
  dismissNotifications(): Promise<Response<{}>>
  subscribePushNotification(
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
    data?: { alerts: { follow?: boolean; favourite?: boolean; reblog?: boolean; mention?: boolean; poll?: boolean } } | null
  ): Promise<Response<PushSubscription>>
  getPushSubscription(): Promise<Response<PushSubscription>>
  updatePushSubscription(
    data?: { alerts: { follow?: boolean; favourite?: boolean; reblog?: boolean; mention?: boolean; poll?: boolean } } | null
  ): Promise<Response<PushSubscription>>
  deletePushSubscription(): Promise<Response<{}>>
  search(
    q: string,
    type: 'accounts' | 'hashtags' | 'statuses',
    limit?: number | null,
    max_id?: string | null,
    min_id?: string | null,
    resolve?: boolean | null,
    offset?: number | null,
    following?: boolean | null,
    account_id?: string | null,
    exclude_unreviewed?: boolean | null
  ): Promise<Response<Results>>
  userStream(): StreamListener
  publicStream(): StreamListener
  localStream(): StreamListener
  tagStream(tag: string): StreamListener
  listStream(list_id: string): StreamListener
  directStream(): StreamListener
  userSocket(): WebSocket
  publicSocket(): WebSocket
  localSocket(): WebSocket
  tagSocket(tag: string): WebSocket
  listSocket(list_id: string): WebSocket
  directSocket(): WebSocket
}

export default class Mastodon implements MastodonInterface {
  public client: APIClient

  constructor(
    accessToken: string,
    baseUrl: string = DEFAULT_URL,
    userAgent: string = DEFAULT_UA,
    proxyConfig: ProxyConfig | false = false
  ) {
    this.client = new APIClient(accessToken, baseUrl, userAgent, proxyConfig)
  }

  /**
   * First, call createApp to get client_id and client_secret.
   * Next, call generateAuthUrl to get authorization url.
   * @param clientName Form Data, which is sent to /api/v1/apps
   * @param options Form Data, which is sent to /api/v1/apps. and properties should be **snake_case**
   * @param baseUrl base URL of the target
   * @param proxyConfig Proxy setting, or set false if don't use proxy.
   */
  public static async registerApp(
    clientName: string,
    options: Partial<{ scopes: string; redirect_uris: string; website: string }> = {
      scopes: DEFAULT_SCOPE,
      redirect_uris: NO_REDIRECT
    },
    baseUrl = DEFAULT_URL,
    proxyConfig: ProxyConfig | false = false
  ): Promise<OAuth.AppData> {
    return APIClient.registerApp(clientName, options, baseUrl, proxyConfig)
  }

  /**
   * Call /api/v1/apps
   *
   * Create an application.
   * @param client_name your application's name
   * @param options Form Data
   * @param baseUrl target of base URL
   * @param proxyConfig Proxy setting, or set false if don't use proxy.
   */
  public static async createApp(
    client_name: string,
    options: Partial<{ redirect_uris: string; scopes: string; website: string }> = {
      redirect_uris: NO_REDIRECT,
      scopes: DEFAULT_SCOPE
    },
    baseUrl = DEFAULT_URL,
    proxyConfig: ProxyConfig | false = false
  ): Promise<OAuth.AppData> {
    return APIClient.createApp(client_name, options, baseUrl, proxyConfig)
  }

  /**
   * Generate authorization url using OAuth2.
   *
   * @param clientId your OAuth app's client ID
   * @param clientSecret your OAuth app's client Secret
   * @param options as property, redirect_uri and scope are available, and must be the same as when you register your app
   * @param baseUrl base URL of the target
   */
  public static generateAuthUrl(
    clientId: string,
    clientSecret: string,
    options: Partial<{ redirect_uri: string; scope: string }> = {
      redirect_uri: NO_REDIRECT,
      scope: DEFAULT_SCOPE
    },
    baseUrl = DEFAULT_URL
  ): Promise<string> {
    return APIClient.generateAuthUrl(clientId, clientSecret, options, baseUrl)
  }

  // ======================================
  // apps
  // ======================================

  /**
   * GET /api/v1/apps/verify_credentials
   *
   * @return An Application
   */
  public verifyAppCredentials(): Promise<Response<Application>> {
    return this.client.get<Application>('/api/v1/apps/verify_credentials')
  }

  // ======================================
  // apps/oauth
  // ======================================

  /**
   * POST /oauth/token
   *
   * Fetch OAuth access token.
   * Get an access token based client_id and client_secret and authorization code.
   * @param client_id will be generated by #createApp or #registerApp
   * @param client_secret will be generated by #createApp or #registerApp
   * @param code will be generated by the link of #generateAuthUrl or #registerApp
   * @param baseUrl base URL of the target
   * @param redirect_uri must be the same uri as the time when you register your OAuth application
   * @param proxyConfig Proxy setting, or set false if don't use proxy.
   */
  public static async fetchAccessToken(
    client_id: string,
    client_secret: string,
    code: string,
    baseUrl = DEFAULT_URL,
    redirect_uri = NO_REDIRECT,
    proxyConfig: ProxyConfig | false = false
  ): Promise<OAuth.TokenData> {
    return APIClient.fetchAccessToken(client_id, client_secret, code, baseUrl, redirect_uri, proxyConfig)
  }

  /**
   * POST /oauth/token
   *
   * Refresh OAuth access token.
   * Send refresh token and get new access token.
   * @param client_id will be generated by #createApp or #registerApp
   * @param client_secret will be generated by #createApp or #registerApp
   * @param refresh_token will be get #fetchAccessToken
   * @param baseUrl base URL or the target
   * @param proxyConfig Proxy setting, or set false if don't use proxy.
   */
  public static async refreshToken(
    client_id: string,
    client_secret: string,
    refresh_token: string,
    baseUrl = DEFAULT_URL,
    proxyConfig: ProxyConfig | false = false
  ): Promise<OAuth.TokenData> {
    return APIClient.refreshToken(client_id, client_secret, refresh_token, baseUrl, proxyConfig)
  }

  /**
   * POST /oauth/revoke
   *
   * Revoke an OAuth token.
   * @param client_id will be generated by #createApp or #registerApp
   * @param client_secret will be generated by #createApp or #registerApp
   * @param token will be get #fetchAccessToken
   * @param baseUrl base URL or the target
   * @param proxyConfig Proxy setting, or set false if don't use proxy.
   */
  public static async revokeToken(
    client_id: string,
    client_secret: string,
    token: string,
    baseUrl = DEFAULT_URL,
    proxyConfig: ProxyConfig | false = false
  ): Promise<Response<{}>> {
    return APIClient.post<{}>(
      '/oauth/revoke',
      {
        client_id,
        client_secret,
        token
      },
      baseUrl,
      proxyConfig
    )
  }

  // ======================================
  // accounts
  // ======================================

  /**
   * POST /api/v1/accounts
   *
   * @param username Username for the account.
   * @param email Email for the account.
   * @param password Password for the account.
   * @param agreement Whether the user agrees to the local rules, terms, and policies.
   * @param locale The language of the confirmation email that will be sent
   * @param reason Text that will be reviewed by moderators if registrations require manual approval.
   * @return An account token.
   */
  public registerAccount(
    username: string,
    email: string,
    password: string,
    agreement: boolean,
    locale: string,
    reason?: string | null
  ): Promise<Response<Token>> {
    let params = {
      username: username,
      email: email,
      password: password,
      agreement: agreement,
      locale: locale
    }
    if (reason) {
      params = Object.assign(params, {
        reason: reason
      })
    }
    return this.client.post<Token>('/api/v1/accounts', params)
  }

  /**
   * GET /api/v1/accounts/verify_credentials
   *
   * @return An account.
   */
  public verifyAccountCredentials(): Promise<Response<Account>> {
    return this.client.get<Account>('/api/v1/accounts/verify_credentials')
  }

  /**
   * PATCH /api/v1/accounts/update_credentials
   *
   * @return An account.
   */
  public updateCredentials(
    discoverable?: string | null,
    bot?: boolean | null,
    display_name?: string | null,
    note?: string | null,
    avatar?: string | null,
    header?: string | null,
    locked?: boolean | null,
    source?: {
      privacy?: string
      sensitive?: boolean
      language?: string
    } | null,
    fields_attributes?: Array<{ name: string; value: string }>
  ): Promise<Response<Account>> {
    let params = {}
    if (discoverable) {
      params = Object.assign(params, {
        discoverable: discoverable
      })
    }
    if (bot !== null) {
      params = Object.assign(params, {
        bot: bot
      })
    }
    if (display_name) {
      params = Object.assign(params, {
        display_name: display_name
      })
    }
    if (note) {
      params = Object.assign(params, {
        note: note
      })
    }
    if (avatar) {
      params = Object.assign(params, {
        avatar: avatar
      })
    }
    if (header) {
      params = Object.assign(params, {
        header: header
      })
    }
    if (locked !== null) {
      params = Object.assign(params, {
        locked: locked
      })
    }
    if (source) {
      params = Object.assign(params, {
        source: source
      })
    }
    if (fields_attributes) {
      params = Object.assign(params, {
        fields_attributes: fields_attributes
      })
    }
    return this.client.patch<Account>('/api/v1/accounts/update_credentials', params)
  }

  /**
   * GET /api/v1/accounts/:id
   *
   * @param id The account ID.
   * @return An account.
   */
  public getAccount(id: string): Promise<Response<Account>> {
    return this.client.get<Account>(`/api/v1/accounts/${id}`)
  }

  /**
   * GET /api/v1/accounts/:id/statuses
   *
   * @param id The account ID.
   * @return Account's statuses.
   */
  public getAccountStatuses(id: string): Promise<Response<Array<Status>>> {
    return this.client.get<Array<Status>>(`/api/v1/accounts/${id}/statuses`)
  }

  /**
   * GET /api/v1/accounts/:id/followers
   *
   * @param id The account ID.
   * @param limit Max number of results to return. Defaults to 40.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @return The array of accounts.
   */
  public getAccountFollowers(
    id: string,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null
  ): Promise<Response<Array<Account>>> {
    let params = {}
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Account>>(`/api/v1/accounts/${id}/followers`, params)
  }

  /**
   * GET /api/v1/accounts/:id/following
   *
   * @param id The account ID.
   * @param limit Max number of results to return. Defaults to 40.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @return The array of accounts.
   */
  public getAccountFollowing(
    id: string,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null
  ): Promise<Response<Array<Account>>> {
    let params = {}
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Account>>(`/api/v1/accounts/${id}/following`, params)
  }

  /**
   * GET /api/v1/accounts/:id/lists
   *
   * @param id The account ID.
   * @return The array of lists.
   */
  public getAccountLists(id: string): Promise<Response<Array<List>>> {
    return this.client.get<Array<List>>(`/api/v1/accounts/${id}/lists`)
  }

  /**
   * GET /api/v1/accounts/:id/identity_proofs
   *
   * @param id The account ID.
   * @return Array of IdentityProof
   */
  public getIdentityProof(id: string): Promise<Response<Array<IdentityProof>>> {
    return this.client.get<Array<IdentityProof>>(`/api/v1/accounts/${id}/identity_proofs`)
  }

  /**
   * POST /api/v1/accounts/:id/follow
   *
   * @param id The account ID.
   * @param reblog Receive this account's reblogs in home timeline.
   * @return Relationship
   */
  public followAccount(id: string, reblog: boolean = true): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/accounts/${id}/follow`, {
      reblog: reblog
    })
  }

  /**
   * POST /api/v1/accounts/:id/unfollow
   *
   * @param id The account ID.
   * @return Relationship
   */
  public unfollowAccount(id: string): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/accounts/${id}/unfollow`)
  }

  /**
   * POST /api/v1/accounts/:id/block
   *
   * @param id The account ID.
   * @return Relationship
   */
  public blockAccount(id: string): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/accounts/${id}/block`)
  }

  /**
   * POST /api/v1/accounts/:id/unblock
   *
   * @param id The account ID.
   * @return RElationship
   */
  public unblockAccount(id: string): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/accounts/${id}/unblock`)
  }

  /**
   * POST /api/v1/accounts/:id/mute
   *
   * @param id The account ID.
   * @param notifications Mute notifications in addition to statuses.
   * @return Relationship
   */
  public muteAccount(id: string, notifications: boolean = true): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/accounts/${id}/mute`, {
      notifications: notifications
    })
  }

  /**
   * POST /api/v1/accounts/:id/unmute
   *
   * @param id The account ID.
   * @return Relationship
   */
  public unmuteAccount(id: string): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/accounts/${id}/unmute`)
  }

  /**
   * POST /api/v1/accounts/:id/pin
   *
   * @param id The account ID.
   * @return Relationship
   */
  public pinAccount(id: string): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/accounts/${id}/pin`)
  }

  /**
   * POST /api/v1/accounts/:id/unpin
   *
   * @param id The account ID.
   * @return Relationship
   */
  public unpinAccount(id: string): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/accounts/${id}/unpin`)
  }

  /**
   * GET /api/v1/accounts/relationships
   *
   * @param ids Array of account IDs.
   * @return Relationship
   */
  public getRelationship(ids: Array<string>): Promise<Response<Relationship>> {
    return this.client.get<Relationship>('/api/v1/accounts/relationships', {
      id: ids
    })
  }

  /**
   * GET /api/v1/accounts/search
   *
   * @param q Search query.
   * @param limit Max number of results to return. Defaults to 40.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @return The array of accounts.
   */
  public searchAccount(
    q: string,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null
  ): Promise<Response<Array<Account>>> {
    let params = { q: q }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Account>>('/api/v1/accounts/search', params)
  }

  // ======================================
  // accounts/bookmarks
  // ======================================

  /**
   * GET /api/v1/bookmarks
   *
   * @param limit Max number of results to return. Defaults to 40.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of statuses.
   */
  public getBookmarks(
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>> {
    let params = {}
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    return this.client.get<Array<Status>>('/api/v1/bookmarks', params)
  }

  // ======================================
  //  accounts/favourites
  // ======================================

  /**
   * GET /api/v1/favourites
   *
   * @param limit Max number of results to return. Defaults to 40.
   * @param max_id Return results older than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of statuses.
   */
  public getFavourites(limit?: number | null, max_id?: string | null, min_id?: string | null): Promise<Response<Array<Status>>> {
    let params = {}
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Status>>('/api/v1/favourites', params)
  }

  // ======================================
  // accounts/mutes
  // ======================================

  /**
   * GET /api/v1/mutes
   *
   * @param limit Max number of results to return. Defaults to 40.
   * @param max_id Return results older than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of accounts.
   */
  public getMutes(limit?: number | null, max_id?: string | null, min_id?: string | null): Promise<Response<Array<Account>>> {
    let params = {}
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Account>>('/api/v1/mutes', params)
  }

  // ======================================
  // accounts/blocks
  // ======================================

  /**
   * GET /api/v1/blocks
   *
   * @param limit Max number of results to return. Defaults to 40.
   * @param max_id Return results older than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of accounts.
   */
  public getBlocks(limit?: number | null, max_id?: string | null, min_id?: string | null): Promise<Response<Array<Account>>> {
    let params = {}
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Account>>('/api/v1/blocks', params)
  }

  // ======================================
  // accounts/domain_blocks
  // ======================================

  /**
   * GET /api/v1/domain_blocks
   *
   * @param limit Max number of results to return. Defaults to 40.
   * @param max_id Return results older than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of domain name.
   */
  public getDomainBlocks(limit?: number | null, max_id?: string | null, min_id?: string | null): Promise<Response<Array<string>>> {
    let params = {}
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<string>>('/api/v1/domain_blocks', params)
  }

  /**
   * POST/api/v1/domain_blocks
   *
   * @param domain Domain to block.
   */
  public blockDomain(domain: string): Promise<Response<{}>> {
    return this.client.post<{}>('/api/v1/domain_blocks', {
      domain: domain
    })
  }

  /**
   * DELETE /api/v1/domain_blocks
   *
   * @param domain Domain to unblock
   */
  public unblockDomain(domain: string): Promise<Response<{}>> {
    return this.client.del<{}>('/api/v1/domain_blocks', {
      domain: domain
    })
  }

  // ======================================
  // accounts/filters
  // ======================================

  /**
   * GET /api/v1/filters
   */
  public getFilters(): Promise<Response<Array<Filter>>> {
    return this.client.get<Array<Filter>>('/api/v1/filters')
  }

  /**
   * GET /api/v1/filters/:id
   * @param id The filter ID.
   */
  public getFilter(id: string): Promise<Response<Filter>> {
    return this.client.get<Filter>(`/api/v1/filters/${id}`)
  }

  /**
   * POST /api/v1/filters
   *
   * @param phrase Text to be filtered.
   * @param context Array of enumerable strings home, notifications, public, thread. At least one context must be specified.
   * @param irreversible Should the server irreversibly drop matching entities from home and notifications?
   * @param whole_word Consider word boundaries?
   * @param expires_in ISO 8601 Datetime for when the filter expires.
   * @return Filter
   */
  public createFilter(
    phrase: string,
    context: Array<'home' | 'notifications' | 'public' | 'thread'>,
    irreversible?: boolean | null,
    whole_word?: boolean | null,
    expires_in?: string | null
  ): Promise<Response<Filter>> {
    let params = {
      phrase: phrase,
      context: context
    }
    if (irreversible !== null) {
      params = Object.assign(params, {
        irreversible: irreversible
      })
    }
    if (whole_word !== null) {
      params = Object.assign(params, {
        whole_word: whole_word
      })
    }
    if (expires_in) {
      params = Object.assign(params, {
        expires_in: expires_in
      })
    }
    return this.client.post<Filter>('/api/v1/filters', params)
  }

  /**
   * PUT /api/v1/filters/:id
   *
   * @param id The filter ID.
   * @param phrase Text to be filtered.
   * @param context Array of enumerable strings home, notifications, public, thread. At least one context must be specified.
   * @param irreversible Should the server irreversibly drop matching entities from home and notifications?
   * @param whole_word Consider word boundaries?
   * @param expires_in ISO 8601 Datetime for when the filter expires.
   * @return Filter
   */
  public updateFilter(
    id: string,
    phrase: string,
    context: Array<'home' | 'notifications' | 'public' | 'thread'>,
    irreversible?: boolean | null,
    whole_word?: boolean | null,
    expires_in?: string | null
  ): Promise<Response<Filter>> {
    let params = {
      phrase: phrase,
      context: context
    }
    if (irreversible !== null) {
      params = Object.assign(params, {
        irreversible: irreversible
      })
    }
    if (whole_word !== null) {
      params = Object.assign(params, {
        whole_word: whole_word
      })
    }
    if (expires_in) {
      params = Object.assign(params, {
        expires_in: expires_in
      })
    }
    return this.client.post<Filter>(`/api/v1/filters/${id}`, params)
  }

  /**
   * DELETE /api/v1/filters/:id
   *
   * @param id The filter ID.
   * @return Removed filter.
   */
  public deleteFilter(id: string): Promise<Response<Filter>> {
    return this.client.del<Filter>(`/api/v1/filters/${id}`)
  }

  // ======================================
  // accounts/reports
  // ======================================
  /**
   * POST /api/v1/reports
   *
   * @param account_id Target account ID.
   * @param status_ids Array of Statuses ids to attach to the report.
   * @param comment Reason of the report.
   * @param forward If the account is remote, should the report be forwarded to the remote admin?
   * @return Report
   */
  public report(
    account_id: string,
    status_ids?: Array<string> | null,
    comment?: string | null,
    forward?: boolean | null
  ): Promise<Response<Report>> {
    let params = {
      account_id: account_id
    }
    if (status_ids) {
      params = Object.assign(params, {
        status_ids: status_ids
      })
    }
    if (comment) {
      params = Object.assign(params, {
        comment: comment
      })
    }
    if (forward !== null) {
      params = Object.assign(params, {
        forward: forward
      })
    }
    return this.client.post<Report>('/api/v1/reports', params)
  }

  // ======================================
  // accounts/follow_requests
  // ======================================
  /**
   * GET /api/v1/follow_requests
   *
   * @param limit Maximum number of results.
   * @return Array of account.
   */
  public getFollowRequests(limit?: number): Promise<Response<Array<Account>>> {
    if (limit) {
      return this.client.get<Array<Account>>('/api/v1/follow_requests', {
        limit: limit
      })
    } else {
      return this.client.get<Array<Account>>('/api/v1/follow_requests')
    }
  }

  /**
   * POST /api/v1/follow_requests/:id/authorize
   *
   * @param id Target account ID.
   * @return Relationship.
   */
  public acceptFollowRequest(id: string): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/follow_requests/${id}/authorize`)
  }

  /**
   * POST /api/v1/follow_requests/:id/reject
   *
   * @param id Target account ID.
   * @return Relationship.
   */
  public rejectFollowRequest(id: string): Promise<Response<Relationship>> {
    return this.client.post<Relationship>(`/api/v1/follow_requests/${id}/reject`)
  }

  // ======================================
  // accounts/endorsements
  // ======================================
  /**
   * GET /api/v1/endorsements
   *
   * @param limit Max number of results to return. Defaults to 40.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @return Array of accounts.
   */
  public getEndorsements(limit?: number | null, max_id?: string | null, since_id?: string | null): Promise<Response<Array<Account>>> {
    let params = {}
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    return this.client.get<Array<Account>>('/api/v1/endorsements', params)
  }

  // ======================================
  // accounts/featured_tags
  // ======================================
  /**
   * GET /api/v1/featured_tags
   *
   * @return Array of featured tag.
   */
  public getFeaturedTags(): Promise<Response<Array<FeaturedTag>>> {
    return this.client.get<Array<FeaturedTag>>('/api/v1/featured_tags')
  }

  /**
   * POST /api/v1/featured_tags
   *
   * @param name Target hashtag name.
   * @return FeaturedTag.
   */
  public createFeaturedTag(name: string): Promise<Response<FeaturedTag>> {
    return this.client.post<FeaturedTag>('/api/v1/featured_tags', {
      name: name
    })
  }

  /**
   * DELETE /api/v1/featured_tags/:id
   *
   * @param id Target featured tag id.
   * @return Empty
   */
  public deleteFeaturedTag(id: string): Promise<Response<{}>> {
    return this.client.del<{}>(`/api/v1/featured_tags/${id}`)
  }

  /**
   * GET /api/v1/featured_tags/suggestions
   *
   * @return Array of tag.
   */
  public getSuggestedTags(): Promise<Response<Array<Tag>>> {
    return this.client.get<Array<Tag>>('/api/v1/featured_tags/suggestions')
  }

  // ======================================
  // accounts/preferences
  // ======================================
  /**
   * GET /api/v1/preferences
   *
   * @return Preferences.
   */
  public getPreferences(): Promise<Response<Preferences>> {
    return this.client.get<Preferences>('/api/v1/preferences')
  }

  // ======================================
  // accounts/suggestions
  // ======================================
  /**
   * GET /api/v1/suggestions
   *
   * @param limit Maximum number of results.
   * @return Array of accounts.
   */
  public getSuggestions(limit?: number): Promise<Response<Array<Account>>> {
    if (limit) {
      return this.client.get<Array<Account>>('/api/v1/suggestions', {
        limit: limit
      })
    } else {
      return this.client.get<Array<Account>>('/api/v1/suggestions')
    }
  }

  // ======================================
  // statuses
  // ======================================
  /**
   * POST /api/v1/statuses
   *
   * @param status Text content of status.
   * @param media_ids Array of Attachment ids.
   * @param poll Poll object.
   * @param in_reply_to_id ID of the status being replied to, if status is a reply.
   * @param sensitive Mark status and attached media as sensitive?
   * @param spoiler_text Text to be shown as a warning or subject before the actual content.
   * @param visibility Visibility of the posted status.
   * @param scheduled_at ISO 8601 Datetime at which to schedule a status.
   * @param language ISO 639 language code for this status.
   * @return Status
   */
  public postStatus(
    status: string,
    media_ids: Array<string> = [],
    poll?: { options: Array<string>; expires_in: number; multiple?: boolean; hide_totals?: boolean } | null,
    in_reply_to_id?: string | null,
    sensitive?: boolean | null,
    spoiler_text?: string | null,
    visibility?: 'public' | 'unlisted' | 'private' | 'direct' | null,
    scheduled_at?: string | null,
    language?: string | null
  ): Promise<Response<Status>> {
    let params = {
      status: status
    }
    if (media_ids.length > 0) {
      params = Object.assign(params, {
        media_ids: media_ids
      })
    }
    if (poll) {
      let pollParam = {
        options: poll.options,
        expires_in: poll.expires_in
      }
      if (poll.multiple !== undefined) {
        pollParam = Object.assign(pollParam, {
          multiple: poll.multiple
        })
      }
      if (poll.hide_totals) {
        pollParam = Object.assign(pollParam, {
          hide_totals: poll.hide_totals
        })
      }
      params = Object.assign(params, {
        poll: pollParam
      })
    }
    if (in_reply_to_id) {
      params = Object.assign(params, {
        in_reply_to_id: in_reply_to_id
      })
    }
    if (sensitive !== null) {
      params = Object.assign(params, {
        sensitive: sensitive
      })
    }
    if (spoiler_text) {
      params = Object.assign(params, {
        spoiler_text: spoiler_text
      })
    }
    if (visibility) {
      params = Object.assign(params, {
        visibility: visibility
      })
    }
    if (scheduled_at) {
      params = Object.assign(params, {
        scheduled_at: scheduled_at
      })
    }
    if (language) {
      params = Object.assign(params, {
        language: language
      })
    }
    return this.client.post<Status>('/api/v1/statuses', params)
  }

  /**
   * GET /api/v1/statuses/:id
   *
   * @param id The target status id.
   * @return Status
   */
  public getStatus(id: string): Promise<Response<Status>> {
    return this.client.get<Status>(`/api/v1/statuses/${id}`)
  }

  /**
   * DELETE /api/v1/statuses/:id
   *
   * @param id The target status id.
   * @return Status
   */
  public deleteStatus(id: string): Promise<Response<Status>> {
    return this.client.del<Status>(`/api/v1/statuses/${id}`)
  }

  /**
   * GET /api/v1/statuses/:id/context
   *
   * Get parent and child statuses.
   * @param id The target status id.
   * @return Context
   */
  public getStatusContext(id: string): Promise<Response<Context>> {
    return this.client.get<Context>(`/api/v1/statuses/${id}/context`)
  }

  /**
   * GET /api/v1/statuses/:id/reblogged_by
   *
   * @param id The target status id.
   * @return Array of accounts.
   */
  public getStatusRebloggedBy(id: string): Promise<Response<Array<Account>>> {
    return this.client.get<Array<Account>>(`/api/v1/statuses/${id}/reblogged_by`)
  }

  /**
   * GET /api/v1/statuses/:id/favourited_by
   *
   * @param id The target status id.
   * @return Array of accounts.
   */
  public getStatusFavouritedBy(id: string): Promise<Response<Array<Account>>> {
    return this.client.get<Array<Account>>(`/api/v1/statuses/${id}/favourited_by`)
  }

  /**
   * POST /api/v1/statuses/:id/favourite
   *
   * @param id The target status id.
   * @return Status.
   */
  public favouriteStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/favourite`)
  }

  /**
   * POST /api/v1/statuses/:id/unfavourite
   *
   * @param id The target status id.
   * @return Status.
   */
  public unfavouriteStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/unfavourite`)
  }

  /**
   * POST /api/v1/statuses/:id/reblog
   *
   * @param id The target status id.
   * @return Status.
   */
  public reblogStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/reblog`)
  }

  /**
   * POST /api/v1/statuses/:id/unreblog
   *
   * @param id The target status id.
   * @return Status.
   */
  public unreblogStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/unreblog`)
  }

  /**
   * POST /api/v1/statuses/:id/bookmark
   *
   * @param id The target status id.
   * @return Status.
   */
  public bookmarkStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/bookmark`)
  }

  /**
   * POST /api/v1/statuses/:id/unbookmark
   *
   * @param id The target status id.
   * @return Status.
   */
  public unbookmarkStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/unbookmark`)
  }

  /**
   * POST /api/v1/statuses/:id/mute
   *
   * @param id The target status id.
   * @return Status
   */
  public muteStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/mute`)
  }

  /**
   * POST /api/v1/statuses/:id/unmute
   *
   * @param id The target status id.
   * @return Status
   */
  public unmuteStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/unmute`)
  }

  /**
   * POST /api/v1/statuses/:id/pin
   * @param id The target status id.
   * @return Status
   */
  public pinStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/pin`)
  }

  /**
   * POST /api/v1/statuses/:id/unpin
   *
   * @param id The target status id.
   * @return Status
   */
  public unpinStatus(id: string): Promise<Response<Status>> {
    return this.client.post<Status>(`/api/v1/statuses/${id}/unpin`)
  }

  // ======================================
  // statuses/media
  // ======================================
  /**
   * POST /api/v1/media
   *
   * @param file The file to be attached, using multipart form data.
   * @param description A plain-text description of the media.
   * @param focus Two floating points (x,y), comma-delimited, ranging from -1.0 to 1.0.
   * @return Attachment
   */
  public uploadMedia(file: any, description?: string | null, focus?: string | null): Promise<Response<Attachment>> {
    let params = {
      file: file
    }
    if (description) {
      params = Object.assign(params, {
        description: description
      })
    }
    if (focus) {
      params = Object.assign(params, {
        focus: focus
      })
    }
    return this.client.post<Attachment>('/api/v1/media', params)
  }

  /**
   * PUT /api/v1/media/:id
   *
   * @param id Target media ID.
   * @param file The file to be attached, using multipart form data.
   * @param description A plain-text description of the media.
   * @param focus Two floating points (x,y), comma-delimited, ranging from -1.0 to 1.0.
   * @return Attachment
   */
  public updateMedia(id: string, file?: any, description?: string | null, focus?: string | null): Promise<Response<Attachment>> {
    let params = {}
    if (file) {
      params = Object.assign(params, {
        file: file
      })
    }
    if (description) {
      params = Object.assign(params, {
        description: description
      })
    }
    if (focus) {
      params = Object.assign(params, {
        focus: focus
      })
    }
    return this.client.put<Attachment>(`/api/v1/media/${id}`, params)
  }

  // ======================================
  // statuses/polls
  // ======================================
  /**
   * GET /api/v1/polls/:id
   *
   * @param id Target poll ID.
   * @return Poll
   */
  public getPoll(id: string): Promise<Response<Poll>> {
    return this.client.get<Poll>(`/api/v1/polls/${id}`)
  }

  /**
   * POST /api/v1/polls/:id/votes
   *
   * @param id Target poll ID.
   * @param choices Array of own votes containing index for each option (starting from 0).
   * @return Poll
   */
  public votePoll(id: string, choices: Array<number>): Promise<Response<Poll>> {
    return this.client.post<Poll>(`/api/v1/polls/${id}/votes`, {
      choices: choices
    })
  }

  // ======================================
  // statuses/scheduled_statuses
  // ======================================
  /**
   * GET /api/v1/scheduled_statuses
   *
   * @param limit Max number of results to return. Defaults to 20.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of scheduled statuses.
   */
  public getScheduledStatuses(
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<ScheduledStatus>>> {
    let params = {}
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    return this.client.get<Array<ScheduledStatus>>('/api/v1/scheduled_statuses', params)
  }

  /**
   * GET /api/v1/scheduled_statuses/:id
   *
   * @param id Target status ID.
   * @return ScheduledStatus.
   */
  public getScheduledStatus(id: string): Promise<Response<ScheduledStatus>> {
    return this.client.get<ScheduledStatus>(`/api/v1/scheduled_statuses/${id}`)
  }

  /**
   * PUT /api/v1/scheduled_statuses/:id
   *
   * @param id Target scheduled status ID.
   * @param scheduled_at ISO 8601 Datetime at which the status will be published.
   * @return ScheduledStatus.
   */
  public scheduleStatus(id: string, scheduled_at?: string | null): Promise<Response<ScheduledStatus>> {
    let params = {}
    if (scheduled_at) {
      params = Object.assign(params, {
        scheduled_at: scheduled_at
      })
    }
    return this.client.put<ScheduledStatus>(`/api/v1/scheduled_statuses/${id}`, params)
  }

  /**
   * DELETE /api/v1/scheduled_statuses/:id
   *
   * @param id Target scheduled status ID.
   */
  public cancelScheduledStatus(id: string): Promise<Response<{}>> {
    return this.client.del<{}>(`/api/v1/scheduled_statuses/${id}`)
  }

  // ======================================
  // timelines
  // ======================================
  /**
   * GET /api/v1/timelines/public
   *
   * @param local Show only local statuses? Defaults to false.
   * @param only_media Show only statuses with media attached? Defaults to false.
   * @param limit Max number of results to return. Defaults to 20.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of statuses.
   */
  public getPublicTimeline(
    local?: boolean | null,
    only_media?: boolean | null,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>> {
    let params = {}
    if (local !== null) {
      params = Object.assign(params, {
        local: local
      })
    }
    if (only_media !== null) {
      params = Object.assign(params, {
        only_media: only_media
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Status>>('/api/v1/timelines/public', params)
  }

  /**
   * GET /api/v1/timelines/tag/:hashtag
   *
   * @param hashtag Content of a #hashtag, not including # symbol.
   * @param local Show only local statuses? Defaults to false.
   * @param only_media Show only statuses with media attached? Defaults to false.
   * @param limit Max number of results to return. Defaults to 20.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of statuses.
   */
  public getTagTimeline(
    hashtag: string,
    local?: boolean | null,
    only_media?: boolean | null,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>> {
    let params = {}
    if (local !== null) {
      params = Object.assign(params, {
        local: local
      })
    }
    if (only_media !== null) {
      params = Object.assign(params, {
        only_media: only_media
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Status>>(`/api/v1/timelines/tag/${hashtag}`, params)
  }

  /**
   * GET /api/v1/timelines/home
   *
   * @param local Show only local statuses? Defaults to false.
   * @param limit Max number of results to return. Defaults to 20.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of statuses.
   */
  public getHomeTimeline(
    local?: boolean | null,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>> {
    let params = {}
    if (local !== null) {
      params = Object.assign(params, {
        local: local
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Status>>('/api/v1/timelines/home', params)
  }

  /**
   * GET /api/v1/timelines/list/:list_id
   *
   * @param list_id Local ID of the list in the database.
   * @param limit Max number of results to return. Defaults to 20.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of statuses.
   */
  public getListTimeline(
    list_id: string,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>> {
    let params = {}
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Status>>(`/api/v1/timelines/list/${list_id}`, params)
  }

  // ======================================
  // timelines/conversations
  // ======================================
  /**
   * GET /api/v1/conversations
   *
   * @param limit Max number of results to return. Defaults to 20.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @param min_id Return results immediately newer than ID.
   * @return Array of statuses.
   */
  public getConversationTimeline(
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null
  ): Promise<Response<Array<Status>>> {
    let params = {}
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    if (min_id) {
      params = Object.assign(params, {
        min_id: min_id
      })
    }
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    return this.client.get<Array<Status>>('/api/v1/conversations', params)
  }

  /**
   * DELETE /api/v1/conversations/:id
   *
   * @param id Target conversation ID.
   */
  public deleteConversation(id: string): Promise<Response<{}>> {
    return this.client.del<{}>(`/api/v1/conversations/${id}`)
  }

  /**
   * POST /api/v1/conversations/:id/read
   *
   * @param id Target conversation ID.
   * @return Conversation.
   */
  public readConversation(id: string): Promise<Response<Conversation>> {
    return this.client.post<Conversation>(`/api/v1/conversations/${id}/read`)
  }

  // ======================================
  // timelines/lists
  // ======================================
  /**
   * GET /api/v1/lists
   */
  public getLists(): Promise<Response<Array<List>>> {
    return this.client.get<Array<List>>('/api/v1/lists')
  }

  /**
   * GET /api/v1/lists/:id
   *
   * @param id Target list ID.
   */
  public getList(id: string): Promise<Response<List>> {
    return this.client.get<List>(`/api/v1/lists/${id}`)
  }

  /**
   * POST /api/v1/lists
   *
   * @param title List name.
   */
  public createList(title: string): Promise<Response<List>> {
    return this.client.post<List>('/api/v1/lists', {
      title: title
    })
  }

  /**
   * PUT /api/v1/lists/:id
   *
   * @param id Target list ID.
   * @param title New list name.
   */
  public updateList(id: string, title: string): Promise<Response<List>> {
    return this.client.put<List>(`/api/v1/lists/${id}`, {
      title: title
    })
  }

  /**
   * DELETE /api/v1/lists/:id
   *
   * @param id Target list ID.
   */
  public deleteList(id: string): Promise<Response<{}>> {
    return this.client.del<{}>(`/api/v1/lists/${id}`)
  }

  /**
   * GET /api/v1/lists/:id/accounts
   */
  public getAccountsInList(
    id: string,
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null
  ): Promise<Response<Array<Account>>> {
    let params = {}
    if (limit) {
      params = Object.assign(params, {
        limit: limit
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id: max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id: since_id
      })
    }
    return this.client.get<Array<Account>>(`/api/v1/lists/${id}/accounts`, params)
  }

  /**
   * POST /api/v1/lists/:id/accounts
   *
   * @param id Target list ID.
   * @param account_ids Array of account IDs to add to the list.
   */
  public addAccountsToList(id: string, account_ids: Array<string>): Promise<Response<{}>> {
    return this.client.post<{}>(`/api/v1/lists/${id}/accounts`, {
      account_ids: account_ids
    })
  }

  /**
   * DELETE /api/v1/lists/:id/accounts
   *
   * @param id Target list ID.
   * @param account_ids Array of account IDs to add to the list.
   */
  public deleteAccountsFromList(id: string, account_ids: Array<string>): Promise<Response<{}>> {
    return this.client.del<{}>(`/api/v1/lists/${id}/accounts`, {
      account_ids: account_ids
    })
  }

  // ======================================
  // timelines/markers
  // ======================================
  /**
   * GET /api/v1/markers
   *
   * @param timelines Array of timeline names, String enum anyOf home, notifications.
   * @return Marker or empty object.
   */
  public getMarker(timeline: Array<'home' | 'notifications'>): Promise<Response<Marker | {}>> {
    return this.client.get<Marker | {}>('/api/v1/markers', {
      timeline: timeline
    })
  }

  /**
   * POST /api/v1/markers
   */
  public saveMarker(home?: { last_read_id: string } | null, notifications?: { last_read_id: string } | null): Promise<Response<Marker>> {
    let params = {}
    if (home) {
      params = Object.assign(params, {
        home: home
      })
    }
    if (notifications) {
      params = Object.assign(params, {
        notifications: notifications
      })
    }
    return this.client.post<Marker>('/api/v1/markers', params)
  }

  // ======================================
  // notifications
  // ======================================
  /**
   * GET /api/v1/notifications
   *
   * @param limit Max number of results to return. Defaults to 20.
   * @param max_id Return results older than ID.
   * @param since_id Return results newer than ID.
   * @param min_id Return results immediately newer than ID.
   * @param exclude_type Array of types to exclude.
   * @param account_id Return only notifications received from this account.
   * @return Array of notifications.
   */
  public getNotifications(
    limit?: number | null,
    max_id?: string | null,
    since_id?: string | null,
    min_id?: string | null,
    exclude_type?: Array<'follow' | 'favourite' | 'reblog' | 'mention' | 'poll'> | null,
    account_id?: string | null
  ): Promise<Response<Array<Notification>>> {
    let params = {}
    if (limit) {
      params = Object.assign(params, {
        limit
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id
      })
    }
    if (since_id) {
      params = Object.assign(params, {
        since_id
      })
    }
    if (min_id) {
      params = Object.assign(params, {
        min_id
      })
    }
    if (exclude_type) {
      params = Object.assign(params, {
        exclude_type
      })
    }
    if (account_id) {
      params = Object.assign(params, {
        account_id
      })
    }
    return this.client.get<Array<Notification>>('/api/v1/notifications', params)
  }

  /**
   * GET /api/v1/notifications/:id
   *
   * @param id Target notification ID.
   * @return Notification.
   */
  public getNotification(id: string): Promise<Response<Notification>> {
    return this.client.get<Notification>(`/api/v1/notifications/${id}`)
  }

  /**
   * POST /api/v1/notifications/clear
   */
  public dismissNotifications(): Promise<Response<{}>> {
    return this.client.post<{}>('/api/v1/notifications/clear')
  }

  /**
   * POST /api/v1/notifications/:id/dismiss
   *
   * @param id Target notification ID.
   */
  public dismissNotification(id: string): Promise<Response<{}>> {
    return this.client.post<{}>(`/api/v1/notifications/${id}/dismiss`)
  }

  // ======================================
  // notifications/push
  // ======================================
  /**
   * POST /api/v1/push/subscription
   *
   * @param subscription[endpoint] Endpoint URL that is called when a notification event occurs.
   * @param subscription[keys][p256dh] User agent public key. Base64 encoded string of public key of ECDH key using prime256v1 curve.
   * @param subscription[keys] Auth secret. Base64 encoded string of 16 bytes of random data.
   * @param data[alerts][follow] Receive follow notifications?
   * @param data[alerts][favourite] Receive favourite notifications?
   * @param data[alerts][reblog] Receive reblog notifictaions?
   * @param data[alerts][mention] Receive mention notifications?
   * @param data[alerts][poll] Receive poll notifications?
   * @return PushSubscription.
   */
  public subscribePushNotification(
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
    data?: { alerts: { follow?: boolean; favourite?: boolean; reblog?: boolean; mention?: boolean; poll?: boolean } } | null
  ): Promise<Response<PushSubscription>> {
    let params = {
      subscription
    }
    if (data) {
      params = Object.assign(params, {
        data
      })
    }
    return this.client.post<PushSubscription>('/api/v1/push/subscription', params)
  }

  /**
   * GET /api/v1/push/subscription
   */
  public getPushSubscription(): Promise<Response<PushSubscription>> {
    return this.client.get<PushSubscription>('/api/v1/push/subscription')
  }

  /**
   * PUT /api/v1/push/subscription
   *
   * @param data[alerts][follow] Receive follow notifications?
   * @param data[alerts][favourite] Receive favourite notifications?
   * @param data[alerts][reblog] Receive reblog notifictaions?
   * @param data[alerts][mention] Receive mention notifications?
   * @param data[alerts][poll] Receive poll notifications?
   */
  public updatePushSubscription(
    data?: { alerts: { follow?: boolean; favourite?: boolean; reblog?: boolean; mention?: boolean; poll?: boolean } } | null
  ): Promise<Response<PushSubscription>> {
    let params = {}
    if (data) {
      params = Object.assign(params, {
        data
      })
    }
    return this.client.put<PushSubscription>('/api/v1/push/subscription', params)
  }

  /**
   * DELETE /api/v1/push/subscription
   */
  public deletePushSubscription(): Promise<Response<{}>> {
    return this.client.del<{}>('/api/v1/push/subscription')
  }

  // ======================================
  // search
  // ======================================
  /**
   * GET /api/v2/search
   *
   * @param q The search query.
   * @param type Enum of search target.
   * @param limit Maximum number of results to load, per type. Defaults to 20. Max 40.
   * @param max_id Return results older than this id.
   * @param min_id Return results immediately newer than this id.
   * @param resolve Attempt WebFinger lookup. Defaults to false.
   * @param following Only include accounts that the user is following. Defaults to false.
   * @param account_id If provided, statuses returned will be authored only by this account.
   * @param exclude_unreviewed Filter out unreviewed tags? Defaults to false.
   * @return Results.
   */
  public search(
    q: string,
    type: 'accounts' | 'hashtags' | 'statuses',
    limit?: number | null,
    max_id?: string | null,
    min_id?: string | null,
    resolve?: boolean | null,
    offset?: number | null,
    following?: boolean | null,
    account_id?: string | null,
    exclude_unreviewed?: boolean | null
  ): Promise<Response<Results>> {
    let params = {
      q,
      type
    }
    if (limit) {
      params = Object.assign(params, {
        limit
      })
    }
    if (max_id) {
      params = Object.assign(params, {
        max_id
      })
    }
    if (min_id) {
      params = Object.assign(params, {
        min_id
      })
    }
    if (resolve) {
      params = Object.assign(params, {
        resolve
      })
    }
    if (offset) {
      params = Object.assign(params, {
        offset
      })
    }
    if (following) {
      params = Object.assign(params, {
        following
      })
    }
    if (account_id) {
      params = Object.assign(params, {
        account_id
      })
    }
    if (exclude_unreviewed) {
      params = Object.assign(params, {
        exclude_unreviewed
      })
    }
    return this.client.get<Results>('/api/v2/search', params)
  }

  // ======================================
  // instance
  // ======================================
  /**
   * GET /api/v1/instance
   */
  public static getInstance(): Promise<Response<Instance>> {
    return APIClient.get<Instance>('/api/v1/instance')
  }

  /**
   * GET /api/v1/instance/peers
   */
  public static getInstancePeers(): Promise<Response<Array<string>>> {
    return APIClient.get<Array<string>>('/api/v1/instance/peers')
  }

  /**
   * GET /api/v1/instance/activity
   */
  public static getInstanceActivity(): Promise<Response<Array<Activity>>> {
    return APIClient.get<Array<Activity>>('/api/v1/instance/activity')
  }

  // ======================================
  // instance/trends
  // ======================================
  /**
   * GET /api/v1/trends
   *
   * @param limit Maximum number of results to return. Defaults to 10.
   */
  public static getInstanceTrends(limit?: number | null): Promise<Response<Array<Tag>>> {
    let params = {}
    if (limit) {
      params = Object.assign(params, {
        limit
      })
    }
    return APIClient.get<Array<Tag>>('/api/v1/trends', params)
  }

  // ======================================
  // instance/directory
  // ======================================
  /**
   * GET /api/v1/directory
   *
   * @param limit How many accounts to load. Default 40.
   * @param offset How many accounts to skip before returning results. Default 0.
   * @param order Order of results.
   * @param local Only return local accounts.
   * @return Array of accounts.
   */
  public static getInstanceDirectory(
    limit?: number | null,
    offset?: number | null,
    order?: 'active' | 'new' | null,
    local?: boolean | null
  ): Promise<Response<Array<Account>>> {
    let params = {}
    if (limit) {
      params = Object.assign(params, {
        limit
      })
    }
    if (offset) {
      params = Object.assign(params, {
        offset
      })
    }
    if (order) {
      params = Object.assign(params, {
        order
      })
    }
    if (local) {
      params = Object.assign(params, {
        local
      })
    }
    return APIClient.get<Array<Account>>('/api/v1/directory', params)
  }

  // ======================================
  // instance/custom_emojis
  // ======================================
  /**
   * GET /api/v1/custom_emojis
   */
  public static getInstanceCustomEmojis(): Promise<Response<Array<Emoji>>> {
    return APIClient.get<Array<Emoji>>('/api/v1/custom_emojis')
  }

  // ======================================
  // HTTP Streaming
  // ======================================
  public userStream(): StreamListener {
    return this.client.stream('/api/v1/streaming/user')
  }

  public publicStream(): StreamListener {
    return this.client.stream('/api/v1/streaming/public')
  }

  public localStream(): StreamListener {
    return this.client.stream('/api/v1/streaming/public/local')
  }

  public tagStream(tag: string): StreamListener {
    return this.client.stream(`/api/v1/streaming/hashtag?tag=${tag}`)
  }

  public listStream(list_id: string): StreamListener {
    return this.client.stream(`/api/v1/streaming/list?list=${list_id}`)
  }

  public directStream(): StreamListener {
    return this.client.stream('/api/v1/streaming/direct')
  }

  // ======================================
  // WebSocket
  // ======================================
  public userSocket(): WebSocket {
    return this.client.socket('/api/v1/streaming', 'user')
  }

  public publicSocket(): WebSocket {
    return this.client.socket('/api/v1/streaming', 'public')
  }

  public localSocket(): WebSocket {
    return this.client.socket('/api/v1/streaming', 'public:local')
  }

  public tagSocket(tag: string): WebSocket {
    return this.client.socket('/api/v1/streaming', 'hashtag', `tag=${tag}`)
  }

  public listSocket(list_id: string): WebSocket {
    return this.client.socket('/api/v1/streaming', 'list', `list=${list_id}`)
  }

  public directSocket(): WebSocket {
    return this.client.socket('/api/v1/streaming', 'direct')
  }
}
