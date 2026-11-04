
create extension if not exists pgcrypto;

create table if not exists public.apartments (
  id text primary key,
  title text not null,
  detail text not null default '',
  nightly integer not null check (nightly > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.apartment_photos (
  id uuid primary key default gen_random_uuid(),
  apartment_id text not null references public.apartments(id) on delete cascade,
  src text not null,
  label text not null default '',
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.apartments enable row level security;
alter table public.apartment_photos enable row level security;

-- Public visitors can view listings and photos. Only the allowlisted admin can write.
create policy "Public can read apartments" on public.apartments
  for select using (true);
create policy "Admin can insert apartments" on public.apartments
  for insert to authenticated
  with check (lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com');
create policy "Admin can update apartments" on public.apartments
  for update to authenticated
  using (lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com')
  with check (lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com');
create policy "Admin can delete apartments" on public.apartments
  for delete to authenticated
  using (lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com');

create policy "Public can read apartment photos" on public.apartment_photos
  for select using (true);
create policy "Admin can insert apartment photos" on public.apartment_photos
  for insert to authenticated
  with check (lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com');
create policy "Admin can update apartment photos" on public.apartment_photos
  for update to authenticated
  using (lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com')
  with check (lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com');
create policy "Admin can delete apartment photos" on public.apartment_photos
  for delete to authenticated
  using (lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com');

insert into public.apartments (id,title,detail,nightly,sort_order) values
 ('block-1','Block 1 — Three-Bedroom Apartment','Three-bedroom apartment • bedroom • living room • sitting area • hallway',150000,1),
 ('block-2','Block 2 — Three-Bedroom Apartment','Three bedrooms • parlour • kitchen • bathroom • outdoor area',230000,2)
on conflict (id) do nothing;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('apartment-photos','apartment-photos',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "Public can view apartment image files" on storage.objects
  for select using (bucket_id = 'apartment-photos');
create policy "Only BOUJEELUX admin can upload apartment images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'apartment-photos' and lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com');
create policy "Only BOUJEELUX admin can update apartment image files" on storage.objects
  for update to authenticated
  using (bucket_id = 'apartment-photos' and lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com')
  with check (bucket_id = 'apartment-photos' and lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com');
create policy "Only BOUJEELUX admin can delete apartment image files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'apartment-photos' and lower(coalesce(auth.jwt()->>'email','')) = 'boujeelux24@gmail.com');

-- Seed initial current photographs. Any missing rooms can be added from the admin dashboard.
insert into public.apartment_photos (apartment_id,src,label,alt,sort_order) values
 ('block-1','/resources/block-1-bedroom.jpg','Bedroom','Block 1 bedroom',1),
 ('block-1','/resources/block-1-living-room.jpg','Living Room','Block 1 living room',2),
 ('block-1','/resources/block-1-sitting-room.jpg','Sitting Area','Block 1 sitting area',3),
 ('block-2','/resources/block-2-bedroom.jpg','Bedroom','Block 2 bedroom',1),
 ('block-2','/resources/block-2-bedroom-parlour.jpg','Bedroom & Parlour','Block 2 bedroom and parlour',2),
 ('block-2','/resources/block-2-parlour.jpg','Parlour','Block 2 parlour',3),
 ('block-2','/resources/block-2-bathroom.jpg','Bathroom','Block 2 bathroom',4),
 ('block-2','/resources/block-2-outdoor.jpg','Outdoor Area','Block 2 outdoor area',5)
on conflict do nothing;
