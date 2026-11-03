create table public.planner_events (
 id uuid primary key,
 sequence bigint generated always as identity unique,
 session_id uuid not null,
 customer_label text not null check (char_length(customer_label) between 1 and 80),
 rep_name text not null check (char_length(rep_name) between 1 and 80),
 action text not null check(action in ('presented','applied','removed','updated')),
 discount_key text not null default '' check(discount_key in ('','standard0','standard1','standard2','dollars','percent')),
 discount_label text not null default '' check(char_length(discount_label)<=80),
 value numeric not null default 0 check(value>=0 and value<=10000000),
 previous_value numeric not null default 0 check(previous_value>=0 and previous_value<=10000000),
 amount_cents bigint not null default 0 check(amount_cents between 0 and 1000000000),
 retail_cents bigint not null check(retail_cents between 1 and 1000000000),
 total_cents bigint not null check(total_cents between 0 and retail_cents),
 occurred_at timestamptz not null,
 received_at timestamptz not null default now()
);
create index planner_events_session_idx on public.planner_events(session_id,sequence);
create index planner_events_occurred_idx on public.planner_events(occurred_at desc);
alter table public.planner_events enable row level security;
revoke all on public.planner_events from anon,authenticated;
grant select on public.planner_events to anon,authenticated;
grant insert (id,session_id,customer_label,rep_name,action,discount_key,discount_label,value,previous_value,amount_cents,retail_cents,total_cents,occurred_at) on public.planner_events to anon,authenticated;
grant usage on sequence public.planner_events_sequence_seq to anon,authenticated;
create policy "Shared activity readable by link" on public.planner_events for select to anon,authenticated using (true);
create policy "Append activity only" on public.planner_events for insert to anon,authenticated with check (occurred_at<=now()+interval '10 minutes');
create function public.planner_shorten_customer() returns trigger language plpgsql security invoker set search_path = '' as $$
declare parts text[];
begin
 parts := regexp_split_to_array(trim(new.customer_label), '\s+');
 new.customer_label := parts[1] || case when array_length(parts,1)>1 then ' ' || left(parts[array_length(parts,1)],1) || '.' else '' end;
 return new;
end $$;
revoke all on function public.planner_shorten_customer() from public;
create trigger shorten_customer before insert on public.planner_events for each row execute function public.planner_shorten_customer();
