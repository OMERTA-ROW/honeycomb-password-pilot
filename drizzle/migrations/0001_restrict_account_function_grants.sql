REVOKE EXECUTE ON FUNCTION public.account_session_active() FROM anon;
REVOKE EXECUTE ON FUNCTION public.register_account_session() FROM anon;
REVOKE EXECUTE ON FUNCTION public.revoke_account_session(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.revoke_other_account_sessions() FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_account_profile() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.profile_activity() FROM anon, authenticated;
COMMENT ON FUNCTION public.register_account_session() IS 'Intentional authenticated SECURITY DEFINER; validates auth.uid and managed session; no caller-supplied identity. Never reactivates revoked/expired sessions.';
COMMENT ON FUNCTION public.revoke_account_session(uuid) IS 'Intentional authenticated SECURITY DEFINER; requires active caller and only revokes own account sessions.';