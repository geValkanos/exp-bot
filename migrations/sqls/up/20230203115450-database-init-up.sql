CREATE SEQUENCE users_id_sequence
  INCREMENT BY 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1
;

CREATE TABLE users (
    "id" BIGINT DEFAULT nextval('users_id_sequence'::regclass) NOT NULL,
    "experience" INT DEFAULT 0 NOT NULL,
    "discord_id" BIGINT UNIQUE NOT NULL,
    "on_voice" BOOLEAN DEFAULT FALSE NOT NULL,
    "is_active" BOOLEAN DEFAULT TRUE NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT timezone('utc'::text, now()) NOT NULL
) WITH (OIDS = FALSE);

ALTER SEQUENCE "users_id_sequence" OWNED BY "users"."id";

ALTER TABLE "users" ADD PRIMARY KEY ("id");