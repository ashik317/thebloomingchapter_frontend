export type User = {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  avatar: string | null;
  is_email_verified: boolean;
  is_staff: boolean;
  is_active?: boolean;
  auth_provider: "email" | "google";
  has_password: boolean;
  date_joined: string;
  last_login?: string | null;
};

export type AuthResponse = { access: string; refresh: string; user: User };

export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

export type Category = { id: number; name: string; slug: string; description?: string; book_count?: number };
export type Author = { id: number; name: string; slug: string; bio?: string; photo?: string | null };

export type Book = {
  id: number;
  title: string;
  slug: string;
  author: string;
  categories: string[];
  cover: string | null;
  language: string;
  is_free_read: boolean;
  download_price: string | null;
  physical_price: string | null;
  stock: number;
  sells_download: boolean;
  sells_physical: boolean;
  has_pdf: boolean;
  is_featured: boolean;
};

export type BookDetail = Omit<Book, "author" | "categories"> & {
  author: Author;
  categories: Category[];
  description: string;
  isbn: string;
  publisher: string;
  published_year: number | null;
  page_count: number | null;
  preview_pages: number;
  access: { can_read: boolean; can_read_full: boolean; can_download: boolean; owns_download: boolean; is_saved: boolean };
};

export type MenuItem = {
  id: number;
  name: string;
  slug: string;
  category: number;
  category_name: string;
  kind: string;
  description: string;
  image: string | null;
  price: string;
  is_available: boolean;
  is_featured: boolean;
};

export type Flower = {
  id: number;
  name: string;
  slug: string;
  category: number;
  category_name: string;
  description: string;
  image: string | null;
  color: string;
  occasion: string;
  price: string;
  stock: number;
  is_available: boolean;
  is_featured: boolean;
};

export type ItemType = "book_physical" | "book_digital" | "menu" | "flower";

export type LineItem = {
  id: number;
  item_type: ItemType;
  product_id: number | null;
  product_slug: string | null;
  name: string;
  image: string | null;
  unit_price: string;
  quantity: number;
  line_total: string;
};

export type Cart = {
  id: number;
  items: LineItem[];
  subtotal: string;
  item_count: number;
  only_digital: boolean;
  needs_shipping: boolean;
};

export type Order = {
  id: number;
  order_number: string;
  status: string;
  status_display: string;
  payment_status: "unpaid" | "paid" | "failed" | "refunded";
  payment_method: string;
  fulfillment: string;
  fulfillment_display: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  city: string;
  note: string;
  subtotal: string;
  delivery_fee: string;
  total: string;
  is_payable: boolean;
  paid_at: string | null;
  created_at: string;
  items: LineItem[];
  customer_email?: string;
};

export type Notification = {
  id: number;
  kind: string;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
};

export type ChatMessage = {
  id: number;
  body: string;
  is_from_staff: boolean;
  sender_name: string;
  is_read: boolean;
  created_at: string;
};

export type Conversation = {
  id: number;
  customer_email: string;
  customer_name: string;
  is_closed: boolean;
  last_message_at: string | null;
  unread: number;
  last_message: string;
};

export type ReadingProgress = { book: Book; last_page: number; updated_at: string };
export type DigitalPurchase = { id: number; book: Book; download_count: number; created_at: string };
export type SavedBook = { id: number; book: Book; created_at: string };
