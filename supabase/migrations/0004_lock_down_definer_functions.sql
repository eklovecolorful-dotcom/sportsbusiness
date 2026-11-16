-- 0004 · Lock down SECURITY DEFINER functions (Supabase security advisor 0028 / 0029)
--
-- 1. handle_new_user() only runs as the auth.users trigger. Triggers do not need
--    EXECUTE grants, so no API role should be able to call it.
-- 2. has_active_subscription(uid) was callable as /rest/v1/rpc/has_active_subscription,
--    letting anyone who knows a user id learn whether that user is subscribed.
--    Move it to a schema PostgREST does not expose. The paywall policy on
--    brief_bodies references the function by OID, so it keeps working; anon and
--    authenticated keep EXECUTE because RLS evaluates the policy as the caller.

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

alter function public.has_active_subscription(uuid) set schema private;
revoke execute on function private.has_active_subscription(uuid) from public;
grant execute on function private.has_active_subscription(uuid) to anon, authenticated, service_role;
