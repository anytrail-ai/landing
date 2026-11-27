import {
  Boxes,
  FileText,
  Package,
  Receipt,
  Search,
  ShoppingCart,
  Split,
  Tag,
  Users,
} from 'lucide-react'

// One icon per module id (copyPlatform.js modules.items), shared by the
// module grid and the hero mockup's sidebar.
export const MODULE_ICONS = {
  crm: Users,
  quotes: FileText,
  pim: Package,
  ecommerce: ShoppingCart,
  orders: Split,
  sourcing: Search,
  pricing: Tag,
  inventory: Boxes,
  ar: Receipt,
}
