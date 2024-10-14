--Create the database first, if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'CSE437') THEN
        CREATE DATABASE CSE437;
    END IF;
END $$;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying(20) COLLATE pg_catalog."default" NOT NULL,
    password character varying(10) COLLATE pg_catalog."default" NOT NULL,
    biography text COLLATE pg_catalog."default",
    "is-business" boolean,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT "unique-username" UNIQUE (username)
        INCLUDE(username, password)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;


--***************************--

-- Table: public.house-listing

-- DROP TABLE IF EXISTS public."house-listing";

CREATE TABLE IF NOT EXISTS public."house-listing"
(
    id integer NOT NULL DEFAULT nextval('"house-listing_id_seq"'::regclass),
    "user-id" integer NOT NULL,
    price numeric(10,2) NOT NULL,
    location text COLLATE pg_catalog."default" NOT NULL,
    amenities text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    availability text COLLATE pg_catalog."default" NOT NULL,
    policies text COLLATE pg_catalog."default",
    pics bytea[],
    CONSTRAINT "house-listing_pkey" PRIMARY KEY (id),
    CONSTRAINT "user-id_fk" FOREIGN KEY ("user-id")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."house-listing"
    OWNER to postgres;


--***************************--
-- Table: public.furniture-listing

-- DROP TABLE IF EXISTS public."furniture-listing";

CREATE TABLE IF NOT EXISTS public."furniture-listing"
(
    id integer NOT NULL DEFAULT nextval('"furniture-listing_id_seq"'::regclass),
    "user-id" integer NOT NULL,
    price integer NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    condition text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "furniture-listing_pkey" PRIMARY KEY (id),
    CONSTRAINT "user-id_fk" FOREIGN KEY ("user-id")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."furniture-listing"
    OWNER to postgres;
    
--***************************--
-- Table: public.business-user

-- DROP TABLE IF EXISTS public."business-user";

CREATE TABLE IF NOT EXISTS public."business-user"
(
    id integer NOT NULL DEFAULT nextval('"businessUser_id_seq"'::regclass),
    "userID" integer NOT NULL DEFAULT nextval('"businessUser_userID_seq"'::regclass),
    rating smallint NOT NULL,
    "furniture-listing-id" integer NOT NULL,
    "housing-listing-id" integer NOT NULL,
    CONSTRAINT "business-user_pkey" PRIMARY KEY (id),
    CONSTRAINT "furniture-listing" FOREIGN KEY ("furniture-listing-id")
        REFERENCES public."furniture-listing" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "housing-listing" FOREIGN KEY ("housing-listing-id")
        REFERENCES public."house-listing" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "userID" FOREIGN KEY ("userID")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."business-user"
    OWNER to postgres;
