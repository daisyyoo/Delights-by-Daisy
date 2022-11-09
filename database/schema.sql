set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."orders" (
	"orderId" serial NOT NULL UNIQUE,
	"orderedAt" timestamp with time zone NOT NULL,
	"cartId" int NOT NULL,
	"email" TEXT,
	"confirmedAt" timestamp with time zone,
	CONSTRAINT "orders_pk" PRIMARY KEY ("orderId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."cookies" (
	"cookieId" serial NOT NULL,
	"flavor" TEXT NOT NULL,
	"price" int NOT NULL,
	"weight" float8 NOT NULL,
	"description" TEXT NOT NULL,
	"ingredients" TEXT NOT NULL,
	"allergens" TEXT NOT NULL,
	"backstory" TEXT NOT NULL,
	"imageUrl" TEXT NOT NULL,
	CONSTRAINT "cookies_pk" PRIMARY KEY ("cookieId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."cartItems" (
	"cartId" int NOT NULL,
	"cookieId" int NOT NULL,
	"quantity" int NOT NULL,
	"message" TEXT
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."carts" (
	"cartId" serial NOT NULL,
	CONSTRAINT "carts_pk" PRIMARY KEY ("cartId")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("cartId") REFERENCES "carts"("cartId");


ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_fk0" FOREIGN KEY ("cartId") REFERENCES "carts"("cartId");
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_fk1" FOREIGN KEY ("cookieId") REFERENCES "cookies"("cookieId");
