/*
  Warnings:

  - Added the required column `location` to the `furniture_listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "furniture_listing" ADD COLUMN     "location" TEXT NOT NULL;

CREATE TABLE IF NOT EXISTS messages
(
    id integer NOT NULL DEFAULT nextval('messages_id_seq'::regclass),
    sender_id text COLLATE pg_catalog."default" NOT NULL,
    recipient_id text COLLATE pg_catalog."default" NOT NULL,
    message_text text COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now(),
    conversation_id text COLLATE pg_catalog."default",
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_recipient_id_fkey FOREIGN KEY (recipient_id)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
