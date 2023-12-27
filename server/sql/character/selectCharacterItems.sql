SELECT
  (j.value::jsonb)->>'count' AS item_count,
  i.*
FROM
  character AS c
LEFT JOIN LATERAL jsonb_each_text(c.inventory) j ON TRUE
LEFT JOIN
  items AS i ON i.item_id = (j.key::text)::int
WHERE
  c.player_id = $1;
