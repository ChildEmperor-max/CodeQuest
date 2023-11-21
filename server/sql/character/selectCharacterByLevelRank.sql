SELECT
  *,
  (SELECT COUNT(*) FROM character WHERE level > c.level) + 1 AS rank
FROM character c
WHERE player_id = $1;
