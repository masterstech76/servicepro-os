create extension if not exists pgcrypto;

create type job_status     as enum ('unassigned','assigned','on_the_way','in_progress','completed','cancelled');
create type user_role      as enum ('owner','technician');
create type pricing_type   as enum ('flat','hourly');
create type invoice_status as enum ('draft','sent','paid','void');
create type payment_kind   as enum ('deposit','remaining','tip','refund');
create type payment_status as enum ('pending','succeeded','failed');
create type line_item_kind as enum ('labor','parts','fee','discount');
create type sms_template   as enum ('booked','on_the_way','completed','rescheduled','cancelled','payment_link','slot_lost');
