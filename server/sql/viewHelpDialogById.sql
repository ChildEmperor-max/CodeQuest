SELECT h.id, h.title, h.description, h.template, h.one_line_highlight, h.multi_line_highlight 
FROM help as h
LEFT JOIN dialog
ON dialog.quest_hint_id = h.id
WHERE h.id = $1