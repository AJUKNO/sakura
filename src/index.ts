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
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sakura = new Sakura({
  debug: true,
  kawaii: {
    art: 'cinnamoroll',
    greeting: 'Hello from Sakura!',
  },
})

// new LocomotiveScroll({
//   lenisOptions: {
//     infinite: true,
//     duration: 0.7,
//   },
// })

// const lenis = new Lenis({
//   infinite: true,
// })
//
// function raf(time) {
//   lenis.raf(time)
//   requestAnimationFrame(raf)
// }
//
// requestAnimationFrame(raf)

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

const tl = gsap.timeline()

gsap.registerPlugin(ScrollTrigger)

const heightOfSvg = document
  .querySelector('.himawari')
  ?.getBoundingClientRect().height

const maxHeightOfSvgs = Array.from(document.querySelectorAll('#himawari svg'))
  .map((svg) => svg.getBoundingClientRect().height)
  .reduce((acc, height) => Math.max(acc, height), 0)

tl.set('#himawari path', {
  // y: maxHeightOfSvgs,
  opacity: 0,
  // rotateZ: -10,
  scrollTrigger: {
    trigger: '#himawari',
    // start: 'top top', // When the top of the SVG is 80% from the top of the viewport
    // end: 'bottom top', // When the bottom of the SVG is 20% from the top of the viewport
    // scrub: true, // Smoothly animate with the scroll
  },
})

tl.to('#himawari path', {
  duration: 2,
  stagger: 0.1,
  ease: 'power4',
  opacity: 1,
  // y: 0,
  // rotateZ: 0,
})

// Function to get a random subset of paths
function getRandomPaths() {
  const paths = document.querySelectorAll('#himawari path')
  return Array.from(paths)
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(paths.length * 0.5))
}

// Function to animate a random subset of paths
function animatePaths() {
  const randomPaths = getRandomPaths()

  gsap.to(randomPaths, {
    duration: 1,
    stagger: 0.02,
    fill: () => getRandomColor(), // Randomly change fill color
    onComplete: animatePaths, // Recursively call the function to repeat the animation
  })
}

// Initial call to start the animation
animatePaths()

// Array of colors based on the given color
const colors = [
  '#322320', // Original color
  '#4A3A2A',
  '#5C4C3C',
  '#7A6351',
  '#948079',
  '#BBA9A0',
  '#ECB176',
  '#E6B325',
]

// Function to get a random color from the array
function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}
