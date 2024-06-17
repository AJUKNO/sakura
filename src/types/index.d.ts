import { ISakura } from '@/types/interfaces'
import { IShopify } from '@/types/shopify'

declare global {
  interface Window {
    sakura: ISakura
    Shopify: IShopify
  }
}
