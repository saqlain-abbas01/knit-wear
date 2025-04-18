export interface Product {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    image: string
    category: "men" | "women"
    sizes: string[]
    colors: string[]
    brand: string
    sale?: boolean
    date: string
  }
  