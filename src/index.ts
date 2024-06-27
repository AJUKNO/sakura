import CartRemoveItemButton from '@/elements/cart-remove-item-button'
import Cart from '@/elements/cart'
import { Sakura } from '@/sakura'
import ProductForm from '@/elements/product-form'
import ProductInfo from '@/elements/product-info'
import VariantPicker from '@/elements/variant-picker'
import QuantitySelector from '@/elements/quantity-selector'
import { Paginator, PaginatorNavigation } from '@/elements/paginator'
import Accordion from '@/elements/accordion'
import CartDrawer from '@/elements/cart-drawer'
import CartItem from '@/elements/cart-item'
import Filter from '@/elements/filter'
import ProductRecommendations from '@/elements/product-recommendations'
import LocalizationForm from '@/elements/localization-form'
import CustomCursor from '@/elements/cursor'
import SearchDrawer from '@/elements/search-drawer'
import PredictiveSearch from '@/elements/predictive-search'
import { animations } from '@/utils/animations'
import { animateSvgLogo, initEasterEgg } from '@/utils/general'

const sakura = new Sakura(
  {
    debug: true,
    kawaii: {
      art: 'yuuka',
      greeting: 'Hello from Sakura!',
    },
  },
  () => {
    animations()
    initEasterEgg()
    animateSvgLogo()
  },
)

sakura.define([
  {
    tagName: 'cmp-product-form',
    elementClass: ProductForm,
  },
  {
    tagName: 'cmp-product-info',
    elementClass: ProductInfo,
  },
  {
    tagName: 'cmp-variant-picker',
    elementClass: VariantPicker,
  },
  {
    tagName: 'cmp-quantity-selector',
    elementClass: QuantitySelector,
  },
  {
    tagName: 'cmp-paginator-nav',
    elementClass: PaginatorNavigation,
  },
  {
    tagName: 'cmp-paginator',
    elementClass: Paginator,
  },
  {
    tagName: 'cmp-accordion',
    elementClass: Accordion,
  },
  {
    tagName: 'cmp-cart',
    elementClass: Cart,
  },
  {
    tagName: 'cmp-cart-drawer',
    elementClass: CartDrawer,
  },
  {
    tagName: 'cmp-cart-item',
    elementClass: CartItem,
  },
  {
    tagName: 'cmp-cart-remove-item-button',
    elementClass: CartRemoveItemButton,
  },
  {
    tagName: 'cmp-filter',
    elementClass: Filter,
  },
  {
    tagName: 'cmp-product-recommendations',
    elementClass: ProductRecommendations,
  },
  {
    tagName: 'cmp-localization-form',
    elementClass: LocalizationForm,
  },
  {
    tagName: 'cmp-cursor',
    elementClass: CustomCursor,
  },
  {
    tagName: 'cmp-search-drawer',
    elementClass: SearchDrawer,
  },
  {
    tagName: 'cmp-predictive-search',
    elementClass: PredictiveSearch,
  },
])

window.sakura = sakura
