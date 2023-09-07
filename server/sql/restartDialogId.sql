-- Reset the identity column of the "dialog" table to start from 7
-- Replace "dialog" with your table name and "id" with your column name if necessary
ALTER SEQUENCE dialog_id_seq RESTART WITH 7;
