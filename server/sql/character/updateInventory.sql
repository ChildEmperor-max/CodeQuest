UPDATE character
SET inventory = inventory || 
jsonb_build_object(
	$2::text,
	jsonb_set(
	COALESCE(inventory->$2, '{}'::jsonb),
	'{count}',
	(COALESCE(inventory->$2->>'count', '0')::int + $3)::text::jsonb
	)
)
WHERE player_id = $1