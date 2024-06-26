import DrawerElement from '@/elements/drawer-element'

class SearchDrawer extends DrawerElement {
  openHandler(): void {
    this.toggleOpen(!this.open)
  }
}

export default SearchDrawer
