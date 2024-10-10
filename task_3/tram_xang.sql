CREATE TABLE "tram_xang"(
    "id" UUID NOT NULL,
    "dia_chi" TEXT NOT NULL
);
ALTER TABLE
    "tram_xang" ADD PRIMARY KEY("id");
CREATE TABLE "tru_bom"(
    "id" UUID NOT NULL,
    "tram_id" UUID NOT NULL,
    "hang_id" UUID NOT NULL
);
ALTER TABLE
    "tru_bom" ADD PRIMARY KEY("id");
CREATE TABLE "giao_dich"(
    "id" BIGINT NOT NULL,
    "tru_id" BIGINT NOT NULL,
    "ngay_tao" DATE NOT NULL,
    "gia_tri" BIGINT NOT NULL
);
ALTER TABLE
    "giao_dich" ADD PRIMARY KEY("id");
CREATE TABLE "hang_hoa"(
    "id" UUID NOT NULL,
    "ten_hang" TEXT NOT NULL,
    "loai_hang" BIGINT NOT NULL
);
ALTER TABLE
    "hang_hoa" ADD PRIMARY KEY("id");
ALTER TABLE
    "tru_bom" ADD CONSTRAINT "tru_bom_tram_id_foreign" FOREIGN KEY("tram_id") REFERENCES "tram_xang"("id");
ALTER TABLE
    "tru_bom" ADD CONSTRAINT "tru_bom_hang_id_foreign" FOREIGN KEY("hang_id") REFERENCES "hang_hoa"("id");
ALTER TABLE
    "giao_dich" ADD CONSTRAINT "giao_dich_tru_id_foreign" FOREIGN KEY("tru_id") REFERENCES "tru_bom"("id");