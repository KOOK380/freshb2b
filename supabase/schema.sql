-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role varchar(20) not null check (role in ('admin', 'restaurant', 'driver', 'customer')),
  phone varchar(20),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RESTAURANTS TABLE
create table public.restaurants (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  business_name text not null,
  contact_name text not null,
  address text not null,
  lat numeric,
  lng numeric,
  delivery_instructions text,
  status text default 'active' check (status in ('active', 'inactive', 'pending')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DRIVERS TABLE
create table public.drivers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  vehicle_type text not null,
  vehicle_plate text not null,
  license_number text not null,
  status text default 'available' check (status in ('available', 'busy', 'offline')),
  current_lat numeric,
  current_lng numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CATEGORIES TABLE
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories on delete set null,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  unit text not null, -- e.g., 'kg', 'box', 'piece'
  stock_quantity integer not null default 0,
  sku text unique,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS TABLE
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  restaurant_id uuid references public.restaurants on delete cascade not null,
  driver_id uuid references public.drivers on delete set null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled')),
  total_amount numeric(10, 2) not null,
  delivery_fee numeric(10, 2) default 0,
  tax_amount numeric(10, 2) default 0,
  delivery_address text not null,
  scheduled_delivery_time timestamp with time zone,
  actual_delivery_time timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete restrict not null,
  quantity integer not null,
  unit_price numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DRIVER ROUTES
create table public.driver_routes (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.drivers on delete cascade not null,
  status text default 'active' check (status in ('active', 'completed')),
  start_location_lat numeric,
  start_location_lng numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTIFICATIONS
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  message text not null,
  type text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PAYMENTS
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders on delete restrict not null,
  amount numeric(10, 2) not null,
  method text not null check (method in ('card', 'bank_transfer', 'cash')),
  status text default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
-- Add RLS (Row Level Security) here to protect data.
-- (Simplified for this snippet, in production you'd want granular RLS)

-- Example RLS setup:
-- alter table public.users enable row level security;
-- create policy "Users can view their own data" on public.users for select using (auth.uid() = id);

-- Create a function to handle new user registration
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'restaurant'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
