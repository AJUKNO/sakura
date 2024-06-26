export interface IShopify {
  strings: ShopifyStrings
  shop: string
  locale: string
  currency: Currency
  country: string
  theme: Theme
  cdnHost: string
  routes: Routes
  analytics: Analytics
  modules: boolean
  featureAssets: FeatureAssets
  recaptchaV3: RecaptchaV3
  PaymentButton: PaymentButton
}

export interface ShopifyStrings {
  shopUrl: string
  routes: {
    root: string
    cart: {
      add: string
      change: string
      update: string
      url: string
    }
    search: {
      predictiveSearch: string
    }
  }
  labels: {
    cart: {
      error: string
      quantityError: string
    }
    variant: {
      addToCart: string
      soldOut: string
      unavailable: string
      unavailableWithOption: string
    }
  }
}

export interface PaymentButton {
  version: string
  init: () => void
}

export interface Analytics {
  replayQueue: unknown[]
}

export interface Currency {
  active: string
  rate: string
}

export interface FeatureAssets {
  'shop-js': ShopJS
}

export interface ShopJS {}

export interface RecaptchaV3 {
  siteKey: string
}

export interface Routes {
  root: string
}

export interface Theme {
  name: string
  id: number
  theme_store_id: null
  role: string
  handle: string
  style: Style
}

export interface Style {
  id: null
  handle: null
}

export interface Variant {
  id: number
  title: string
  option1: string
  option2: null
  option3: null
  sku: string
  requires_shipping: boolean
  taxable: boolean
  featured_image: FeaturedImage
  available: boolean
  name: string
  public_title: string
  options: string[]
  price: number
  weight: number
  compare_at_price: null
  inventory_management: string
  barcode: string
  featured_media: FeaturedMedia
  requires_selling_plan: boolean
  selling_plan_allocations: any[]
  quantity_rule: QuantityRule
}

export interface FeaturedImage {
  id: number
  product_id: number
  position: number
  created_at: Date
  updated_at: Date
  alt: null
  width: number
  height: number
  src: string
  variant_ids: number[]
}

export interface FeaturedMedia {
  alt: null
  id: number
  position: number
  preview_image: PreviewImage
}

export interface PreviewImage {
  aspect_ratio: number
  height: number
  width: number
  src: string
}

export interface QuantityRule {
  min: number
  max: null
  increment: number
}
