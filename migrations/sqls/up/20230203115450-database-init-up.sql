CREATE TABLE guilds (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT timezone('utc'::text, now()) NOT NULL
) WITH (OIDS = FALSE);

CREATE TABLE users (
    "id" BIGINT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "experience" INT DEFAULT 0 NOT NULL,
    "voice_channel_id" BIGINT,
    "is_on_exp_mode" BOOLEAN DEFAULT FALSE NOT NULL,
    "is_active" BOOLEAN DEFAULT TRUE NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT timezone('utc'::text, now()) NOT NULL
) WITH (OIDS = FALSE);

ALTER TABLE "users" ADD PRIMARY KEY ("id", "guild_id");
ALTER TABLE "guilds" ADD PRIMARY KEY ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("guild_id") REFERENCES "guilds" ("id") ON DELETE CASCADE ON UPDATE CASCADE;